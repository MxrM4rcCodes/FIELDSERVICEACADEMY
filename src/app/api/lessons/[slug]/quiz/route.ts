import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query, withTransaction } from "@/lib/db";
import { recalculateCompetency, type CompetencyDomain } from "@/lib/competency";

interface QuizOptionRow {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  explanation: string;
  sort_order: number;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { slug } = await params;
    const body = await req.json().catch(() => null);
    const answers = body?.answers;
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json({ error: "An answers object is required." }, { status: 400 });
    }

    const lessonResult = await query<{
      id: string;
      competency_domain: string;
      title: string;
    }>("SELECT id, competency_domain, title FROM lessons WHERE slug = $1", [slug]);
    const lesson = lessonResult.rows[0];
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const questionResult = await query<{
      id: string;
      question_text: string;
      explanation: string;
      sort_order: number;
    }>(
      `SELECT id, question_text, explanation, sort_order
         FROM quiz_questions
        WHERE lesson_id = $1
        ORDER BY sort_order`,
      [lesson.id],
    );
    const questions = questionResult.rows;
    if (questions.length < 5) {
      return NextResponse.json({ error: "This lesson's assessment is not ready." }, { status: 409 });
    }

    const answerKeys = Object.keys(answers);
    if (answerKeys.length !== questions.length || questions.some((question) => !answerKeys.includes(question.id))) {
      return NextResponse.json({ error: "Select one answer for every question before submitting." }, { status: 400 });
    }

    const optionsResult = await query<QuizOptionRow>(
      `SELECT o.id, o.question_id, o.option_text, o.is_correct, o.explanation, o.sort_order
         FROM quiz_options o
         JOIN quiz_questions q ON q.id = o.question_id
        WHERE q.lesson_id = $1
        ORDER BY q.sort_order, o.sort_order`,
      [lesson.id],
    );
    const optionsByQuestion = new Map<string, QuizOptionRow[]>();
    for (const option of optionsResult.rows) {
      const list = optionsByQuestion.get(option.question_id) ?? [];
      list.push(option);
      optionsByQuestion.set(option.question_id, list);
    }

    const evaluatedAnswers = questions.map((question) => {
      const selectedId = answers[question.id];
      if (typeof selectedId !== "string") return null;
      const options = optionsByQuestion.get(question.id) ?? [];
      const selected = options.find((option) => option.id === selectedId);
      const correct = options.find((option) => option.is_correct);
      if (!selected || !correct) return null;
      return {
        questionId: question.id,
        questionText: question.question_text,
        selectedOptionId: selected.id,
        selectedOptionText: selected.option_text,
        isCorrect: selected.is_correct,
        correctOptionId: correct.id,
        correctOptionText: correct.option_text,
        explanation: selected.is_correct
          ? selected.explanation
          : `Your selection: ${selected.explanation} Correct answer (${correct.option_text}): ${correct.explanation}`,
        optionFeedback: options.map((option) => ({
          id: option.id,
          isCorrect: option.is_correct,
          explanation: option.explanation,
        })),
        questionRationale: question.explanation,
      };
    });
    if (evaluatedAnswers.some((answer) => answer === null)) {
      return NextResponse.json({ error: "One or more selected answers are invalid." }, { status: 400 });
    }

    const evaluated = evaluatedAnswers as NonNullable<(typeof evaluatedAnswers)[number]>[];
    const score = evaluated.filter((answer) => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const passed = score >= Math.ceil(totalQuestions * 0.8);
    const attemptId = crypto.randomUUID();
    const missed = evaluated.filter((answer) => !answer.isCorrect).map((answer) => answer.questionText);

    await withTransaction(async (tx) => {
      await tx.query(
        `INSERT INTO quiz_attempts (id, user_id, lesson_id, score, total_questions, passed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [attemptId, user.id, lesson.id, score, totalQuestions, passed],
      );

      for (const answer of evaluated) {
        await tx.query(
          `INSERT INTO quiz_answers (id, attempt_id, question_id, selected_option_id, is_correct)
           VALUES ($1, $2, $3, $4, $5)`,
          [crypto.randomUUID(), attemptId, answer.questionId, answer.selectedOptionId, answer.isCorrect],
        );
      }

      await tx.query(
        `INSERT INTO lesson_progress (id, user_id, lesson_id, status, completed_at, updated_at)
         VALUES ($1, $2, $3, $4, CASE WHEN $4 = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET
           status = CASE
             WHEN lesson_progress.status = 'completed' THEN 'completed'
             ELSE EXCLUDED.status
           END,
           completed_at = CASE
             WHEN EXCLUDED.status = 'completed' THEN COALESCE(lesson_progress.completed_at, CURRENT_TIMESTAMP)
             ELSE lesson_progress.completed_at
           END,
           updated_at = CURRENT_TIMESTAMP`,
        [`progress_${crypto.randomUUID()}`, user.id, lesson.id, passed ? "completed" : "in_progress"],
      );
    });

    const domain = lesson.competency_domain as CompetencyDomain;
    if (domain in { hardware_safety: 1, color_oris: 1, metis_scanning: 1, customer_docs: 1, company_interview: 1 }) {
      await recalculateCompetency(user.id, domain);
    }

    return NextResponse.json({
      success: true,
      attemptId,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      passed,
      evaluatedAnswers: evaluated,
      targetedRecommendation: passed
        ? null
        : {
            title: `Targeted Review: ${lesson.title}`,
            guidance: `You answered ${score}/${totalQuestions} correctly. Revisit: ${missed.slice(0, 2).join("; ")}. Use the section explanations above before retrying.`,
          },
    });
  } catch (error) {
    console.error("Quiz submission failed", error);
    return NextResponse.json({ error: "Unable to record this knowledge check." }, { status: 500 });
  }
}
