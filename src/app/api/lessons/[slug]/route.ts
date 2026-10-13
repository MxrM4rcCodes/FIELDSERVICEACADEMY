import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const userId = user.id;
    const { slug } = await params;

    // 1. Fetch lesson
    const lessonRes = await query(
      `SELECT id, module_id, day_number, bootcamp_day_number, title, slug, summary,
              estimated_minutes, competency_domain, objectives, prerequisites
       FROM lessons WHERE slug = $1;`,
      [slug]
    );

    if (lessonRes.rows.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lesson = lessonRes.rows[0];

    // 2. Fetch content blocks
    const blocksRes = await query(
      `SELECT id, section_title, block_type, content_markdown, sort_order
       FROM lesson_content_blocks WHERE lesson_id = $1
       ORDER BY sort_order ASC;`,
      [lesson.id]
    );

    // 3. Fetch source references
    const refRes = await query(
      `SELECT title, citation, confidence_level, notes
       FROM source_references WHERE lesson_id = $1;`,
      [lesson.id]
    );

    // 4. Fetch quiz questions & options
    const questionsRes = await query(
      `SELECT id, question_text, competency_domain, sort_order
       FROM quiz_questions WHERE lesson_id = $1
       ORDER BY sort_order ASC;`,
      [lesson.id]
    );

    const questionsWithOptions = await Promise.all(
      questionsRes.rows.map(async (q) => {
        const optRes = await query(
          `SELECT id, option_text, sort_order
           FROM quiz_options WHERE question_id = $1
           ORDER BY sort_order ASC;`,
          [q.id]
        );
        return {
          ...q,
          options: optRes.rows,
        };
      })
    );

    // 5. Fetch user progress
    const progressRes = await query(
      `SELECT status, time_spent_seconds, completed_at
       FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2;`,
      [userId, lesson.id]
    );

    // 6. Fetch previous quiz attempts
    const attemptsRes = await query(
      `SELECT id, score, total_questions, passed, created_at
       FROM quiz_attempts WHERE user_id = $1 AND lesson_id = $2
       ORDER BY created_at DESC LIMIT 3;`,
      [userId, lesson.id]
    );

    // 7. Fetch user notes for this lesson
    const notesRes = await query(
      `SELECT id, title, note_text, updated_at
       FROM user_notes WHERE user_id = $1 AND reference_type = 'lesson' AND reference_id = $2
       ORDER BY updated_at DESC;`,
      [userId, lesson.id]
    );

    // 8. Adjacent lessons (Prev / Next)
    const prevRes = await query(
      `SELECT title, slug, day_number FROM lessons WHERE day_number = $1 - 1;`,
      [lesson.day_number]
    );
    const nextRes = await query(
      `SELECT title, slug, day_number FROM lessons WHERE day_number = $1 + 1;`,
      [lesson.day_number]
    );

    return NextResponse.json({
      lesson,
      blocks: blocksRes.rows,
      sourceReference: refRes.rows[0] || null,
      quiz: questionsWithOptions,
      progress: progressRes.rows[0] || { status: "not_started", time_spent_seconds: 0 },
      attempts: attemptsRes.rows,
      userNotes: notesRes.rows,
      navigation: {
        prev: prevRes.rows[0] || null,
        next: nextRes.rows[0] || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load lesson" }, { status: 500 });
  }
}
