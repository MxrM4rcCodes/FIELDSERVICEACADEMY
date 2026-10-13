import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { recalculateCompetency, type CompetencyDomain } from "@/lib/competency";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const questions = await query(
      `SELECT id, question_text, category, competency_domain, difficulty,
              evaluation_rubric, transferable_skills_tips, sort_order
         FROM interview_questions
        ORDER BY sort_order`,
    );
    const attempts = await query(
      `SELECT question_id, user_answer, score_technical, score_safety,
              score_communication, score_verification, score_clarity,
              total_score, feedback_text, created_at
         FROM interview_attempts
        WHERE user_id = $1
        ORDER BY created_at DESC`,
      [user.id],
    );
    return NextResponse.json({ questions: questions.rows, attempts: attempts.rows });
  } catch (error) {
    console.error("Interview studio read failed", error);
    return NextResponse.json({ error: "Unable to load interview practice." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const questionId = typeof body?.questionId === "string" ? body.questionId : "";
    const userAnswer = typeof body?.userAnswer === "string" ? body.userAnswer.trim() : "";
    if (!questionId || userAnswer.length < 10 || userAnswer.length > 5000) {
      return NextResponse.json({ error: "Write a response between 10 and 5,000 characters." }, { status: 400 });
    }

    const result = await query<{
      id: string;
      competency_domain: string;
      model_answer: string;
    }>(
      "SELECT id, competency_domain, model_answer FROM interview_questions WHERE id = $1",
      [questionId],
    );
    const question = result.rows[0];
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    // Transparent keyword/structure rubric. This is rule-based practice feedback, not AI or a judgment of technical truth.
    const text = userAnswer.toLowerCase();
    const wordCount = userAnswer.split(/\s+/).filter(Boolean).length;
    const includesAny = (terms: string[]) => terms.some((term) => text.includes(term));

    const technical = [
      includesAny(["nozzle", "media advance", "encoder", "printhead", "motion", "rip", "icc", "delta e", "cielab", "scanner", "calibration", "profile"]) ? 5 : 0,
      includesAny(["evidence", "test", "measure", "observe", "compare", "isolate"]) ? 5 : 0,
      includesAny(["hypothesis", "root cause", "alternative cause", "rule out"]) ? 5 : 0,
      includesAny(["least-invasive", "controlled test", "reproduce", "configuration"]) ? 5 : 0,
    ].reduce((sum, part) => sum + part, 0);

    const safety = [
      includesAny(["hazard", "risk", "safe", "safety assessment"]) ? 5 : 0,
      includesAny(["lockout", "loto", "energy isolation", "isolate energy"]) ? 5 : 0,
      includesAny(["ppe", "gloves", "eye protection", "guard", "interlock"]) ? 5 : 0,
      includesAny(["stop", "shutdown", "escalate", "authorized", "manufacturer procedure"]) ? 5 : 0,
    ].reduce((sum, part) => sum + part, 0);

    const communication = [
      includesAny(["listen", "clarify", "ask the customer", "customer reports"]) ? 5 : 0,
      includesAny(["explain", "update", "communicate", "confirm understanding"]) ? 5 : 0,
      includesAny(["expectation", "timeline", "impact", "production priority"]) ? 5 : 0,
      includesAny(["train", "show the operator", "handoff", "follow-up"]) ? 5 : 0,
    ].reduce((sum, part) => sum + part, 0);

    const verification = [
      includesAny(["verify", "verification", "acceptance criteria", "test print", "reference target"]) ? 5 : 0,
      includesAny(["before and after", "baseline", "repeat", "retest"]) ? 5 : 0,
      includesAny(["document", "ticket", "service report", "record"]) ? 5 : 0,
      includesAny(["result", "measurement", "evidence", "sign-off", "signoff"]) ? 5 : 0,
    ].reduce((sum, part) => sum + part, 0);

    const clarity = Math.min(10, Math.floor(wordCount / 15))
      + (includesAny(["first", "next", "then"]) ? 5 : 0)
      + (includesAny(["finally", "therefore", "because"]) ? 5 : 0);
    const total = technical + safety + communication + verification + clarity;

    const improvement = [
      technical < 15 ? "state a testable technical hypothesis and the evidence that would support it" : null,
      safety < 15 ? "start with a hazard check and define when you would stop or escalate" : null,
      communication < 15 ? "explain how you would update the customer and agree on next steps" : null,
      verification < 15 ? "define an acceptance check and what you would record" : null,
      clarity < 10 ? "organize the response into a concise sequence (first, next, finally)" : null,
    ].filter(Boolean);
    const feedback = `Rule-based practice score: ${total}/100. This transparent keyword-and-structure rubric does not evaluate technical truth or use AI. ${improvement.length ? `For another attempt, consider: ${improvement.join("; ")}.` : "Your response included markers across all five rubric areas; compare it with the model answer and adapt it to your real experience."}`;
    const attemptId = crypto.randomUUID();

    await query(
      `INSERT INTO interview_attempts (
        id, user_id, question_id, user_answer, score_technical, score_safety,
        score_communication, score_verification, score_clarity, total_score, feedback_text
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [attemptId, user.id, questionId, userAnswer, technical, safety, communication, verification, clarity, total, feedback],
    );

    const domain = question.competency_domain as CompetencyDomain;
    if (domain in { hardware_safety: 1, color_oris: 1, metis_scanning: 1, customer_docs: 1, company_interview: 1 }) {
      await recalculateCompetency(user.id, domain);
    }

    return NextResponse.json({
      success: true,
      attemptId,
      evaluationType: "rule_based",
      scores: { technical, safety, communication, verification, clarity, total },
      feedback,
      modelAnswer: question.model_answer,
    });
  } catch (error) {
    console.error("Interview attempt save failed", error);
    return NextResponse.json({ error: "Unable to save this practice response." }, { status: 500 });
  }
}
