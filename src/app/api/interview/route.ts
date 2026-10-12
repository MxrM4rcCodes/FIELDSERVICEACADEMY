import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || "usr_learner_01";

    const questionsRes = await query(
      `SELECT id, question_text, category, competency_domain, difficulty,
              model_answer, evaluation_rubric, transferable_skills_tips, sort_order
       FROM interview_questions
       ORDER BY sort_order ASC;`
    );

    const attemptsRes = await query(
      `SELECT question_id, user_answer, score_technical, score_safety,
              score_communication, score_verification, score_clarity,
              total_score, feedback_text, created_at
       FROM interview_attempts
       WHERE user_id = $1
       ORDER BY created_at DESC;`,
      [userId]
    );

    return NextResponse.json({
      questions: questionsRes.rows,
      attempts: attemptsRes.rows,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load interview studio" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, userAnswer } = await req.json();

    if (!questionId || !userAnswer || userAnswer.trim().length < 10) {
      return NextResponse.json({ error: "Please write a comprehensive response (at least 10 characters)." }, { status: 400 });
    }

    const qRes = await query(
      "SELECT id, question_text, model_answer, evaluation_rubric FROM interview_questions WHERE id = $1;",
      [questionId]
    );
    if (qRes.rows.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    const question = qRes.rows[0];

    // Transparent Rule-Based Evaluation Rubric
    // Analyzes presence of key technical concepts, safety principles, customer-service phrasing, and STAR structure
    const lower = userAnswer.toLowerCase();

    // 1. Technical Reasoning (0-20)
    let scoreTech = 10;
    if (lower.includes("nozzle") || lower.includes("sub-tank") || lower.includes("vacuum") || lower.includes("delta e") || lower.includes("cielab") || lower.includes("encoder") || lower.includes("schematic")) scoreTech += 4;
    if (lower.includes("calibrate") || lower.includes("lineariz") || lower.includes("meniscus") || lower.includes("multimeter") || lower.includes("spectrophotometer")) scoreTech += 4;
    if (lower.includes("least-invasive") || lower.includes("isolate") || lower.includes("root cause")) scoreTech += 2;
    scoreTech = Math.min(20, scoreTech);

    // 2. Safety Awareness (0-20)
    let scoreSafety = 10;
    if (lower.includes("lockout") || lower.includes("loto") || lower.includes("e-stop") || lower.includes("zero-energy") || lower.includes("disconnect")) scoreSafety += 5;
    if (lower.includes("ppe") || lower.includes("nitrile") || lower.includes("goggles") || lower.includes("meter") || lower.includes("capacitor")) scoreSafety += 5;
    scoreSafety = Math.min(20, scoreSafety);

    // 3. Customer Communication (0-20)
    let scoreComm = 10;
    if (lower.includes("listen") || lower.includes("empath") || lower.includes("calm") || lower.includes("urgency") || lower.includes("deadline")) scoreComm += 5;
    if (lower.includes("update") || lower.includes("timeline") || lower.includes("expectation") || lower.includes("train")) scoreComm += 5;
    scoreComm = Math.min(20, scoreComm);

    // 4. Verification & Documentation (0-20)
    let scoreVerif = 10;
    if (lower.includes("test print") || lower.includes("verify") || lower.includes("measure") || lower.includes("check")) scoreVerif += 4;
    if (lower.includes("ticket") || lower.includes("document") || lower.includes("signoff") || lower.includes("fat") || lower.includes("sat")) scoreVerif += 4;
    if (lower.includes("data") || lower.includes("log") || lower.includes("report")) scoreVerif += 2;
    scoreVerif = Math.min(20, scoreVerif);

    // 5. Clarity & Structure (0-20)
    const wordCount = userAnswer.trim().split(/\s+/).length;
    let scoreClarity = 10;
    if (wordCount >= 40) scoreClarity += 4;
    if (wordCount >= 80) scoreClarity += 4;
    if (lower.includes("first") || lower.includes("then") || lower.includes("finally") || lower.includes("situation") || lower.includes("result")) scoreClarity += 2;
    scoreClarity = Math.min(20, scoreClarity);

    const totalScore = scoreTech + scoreSafety + scoreComm + scoreVerif + scoreClarity;

    const feedbackText = `Scored ${totalScore}/100 across 5 dimensions: Technical (${scoreTech}/20), Safety (${scoreSafety}/20), Communication (${scoreComm}/20), Verification (${scoreVerif}/20), Clarity (${scoreClarity}/20). Your response shows good technical grounding. Compare your answer against the model answer below to incorporate exact Plymouth facility details and quantitative benchmarks.`;

    const attemptId = `inta_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await query(
      `INSERT INTO interview_attempts (
        id, user_id, question_id, user_answer, score_technical, score_safety,
        score_communication, score_verification, score_clarity, total_score, feedback_text
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
      [
        attemptId,
        user.id,
        questionId,
        userAnswer,
        scoreTech,
        scoreSafety,
        scoreComm,
        scoreVerif,
        scoreClarity,
        totalScore,
        feedbackText,
      ]
    );

    // Update company_interview competency score
    await query(
      `UPDATE competency_scores 
       SET observed_score = LEAST(100.0, observed_score + 5.0),
           total_evaluations = total_evaluations + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND domain = 'company_interview';`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      scores: {
        technical: scoreTech,
        safety: scoreSafety,
        communication: scoreComm,
        verification: scoreVerif,
        clarity: scoreClarity,
        total: totalScore,
      },
      feedback: feedbackText,
      modelAnswer: question.model_answer,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit interview response" }, { status: 500 });
  }
}
