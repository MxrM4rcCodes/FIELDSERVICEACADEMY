import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    const { answers } = await req.json(); // { [questionId: string]: string (selectedOptionId) }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Answers object required" }, { status: 400 });
    }

    // 1. Get lesson
    const lessonRes = await query("SELECT id, competency_domain, title FROM lessons WHERE slug = $1;", [slug]);
    if (lessonRes.rows.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    const lesson = lessonRes.rows[0];

    // 2. Fetch all questions and options for this lesson
    const questionsRes = await query(
      `SELECT id, question_text, explanation FROM quiz_questions WHERE lesson_id = $1;`,
      [lesson.id]
    );

    let totalScore = 0;
    const totalQuestions = questionsRes.rows.length;
    const evaluatedAnswers: any[] = [];
    const missedTopics: string[] = [];

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    for (const q of questionsRes.rows) {
      const selectedOptionId = answers[q.id];
      const optionsRes = await query(
        `SELECT id, option_text, is_correct, explanation FROM quiz_options WHERE question_id = $1;`,
        [q.id]
      );

      const correctOption = optionsRes.rows.find((o) => o.is_correct);
      const selectedOption = optionsRes.rows.find((o) => o.id === selectedOptionId);
      const isCorrect = selectedOption?.is_correct || false;

      if (isCorrect) {
        totalScore++;
      } else {
        missedTopics.push(q.question_text);
      }

      evaluatedAnswers.push({
        questionId: q.id,
        questionText: q.question_text,
        selectedOptionId,
        selectedOptionText: selectedOption?.option_text || "None selected",
        isCorrect,
        correctOptionId: correctOption?.id,
        correctOptionText: correctOption?.option_text,
        explanation: selectedOption?.explanation || correctOption?.explanation || q.explanation,
      });
    }

    const passed = totalScore >= Math.ceil(totalQuestions * 0.8); // 80% passing standard

    // 3. Record attempt in database
    await query(
      `INSERT INTO quiz_attempts (id, user_id, lesson_id, score, total_questions, passed)
       VALUES ($1, $2, $3, $4, $5, $6);`,
      [attemptId, user.id, lesson.id, totalScore, totalQuestions, passed]
    );

    // 4. Record individual answers
    for (const ans of evaluatedAnswers) {
      if (ans.selectedOptionId) {
        await query(
          `INSERT INTO quiz_answers (id, attempt_id, question_id, selected_option_id, is_correct)
           VALUES ($1, $2, $3, $4, $5);`,
          [`qa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, attemptId, ans.questionId, ans.selectedOptionId, ans.isCorrect]
        );
      }
    }

    // 5. Update lesson progress
    const progressStatus = passed ? "completed" : "in_progress";
    await query(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, status, completed_at, updated_at)
       VALUES ($1, $2, $3, $4, ${passed ? "CURRENT_TIMESTAMP" : "NULL"}, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET
         status = CASE WHEN lesson_progress.status = 'completed' THEN 'completed' ELSE EXCLUDED.status END,
         completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN CURRENT_TIMESTAMP ELSE lesson_progress.completed_at END,
         updated_at = CURRENT_TIMESTAMP;`,
      [`prog_${user.id}_${lesson.id}`, user.id, lesson.id, progressStatus]
    );

    // 6. Recalculate competency score for domain
    const allDomainAttempts = await query(
      `SELECT qa.score, qa.total_questions
       FROM quiz_attempts qa
       JOIN lessons l ON l.id = qa.lesson_id
       WHERE qa.user_id = $1 AND l.competency_domain = $2;`,
      [user.id, lesson.competency_domain]
    );

    if (allDomainAttempts.rows.length > 0) {
      let earned = 0;
      let possible = 0;
      for (const row of allDomainAttempts.rows) {
        earned += row.score;
        possible += row.total_questions;
      }
      const newScore = Math.round((earned / possible) * 100);

      await query(
        `UPDATE competency_scores 
         SET observed_score = $1, total_evaluations = total_evaluations + 1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND domain = $3;`,
        [newScore, user.id, lesson.competency_domain]
      );
    }

    // 7. Targeted recommendation if incorrect
    let targetedRecommendation = null;
    if (!passed) {
      targetedRecommendation = {
        title: `Targeted Review: ${lesson.title}`,
        guidance: `You answered ${totalScore}/${totalQuestions} questions correctly. Focus your review on: ${missedTopics.slice(0, 2).join("; ")}. Review the teaching sections above before retrying.`,
      };
    }

    return NextResponse.json({
      success: true,
      score: totalScore,
      totalQuestions,
      percentage: Math.round((totalScore / totalQuestions) * 100),
      passed,
      evaluatedAnswers,
      targetedRecommendation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit quiz" }, { status: 500 });
  }
}
