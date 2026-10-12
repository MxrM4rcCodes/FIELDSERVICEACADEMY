import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    // Admin overview statistics
    const userCount = await query("SELECT count(*) FROM users;");
    const lessonCount = await query("SELECT count(*) FROM lessons;");
    const quizCount = await query("SELECT count(*) FROM quiz_questions;");
    const scenarioCount = await query("SELECT count(*) FROM troubleshooting_scenarios;");
    const flashcardCount = await query("SELECT count(*) FROM flashcards;");
    const ticketCount = await query("SELECT count(*) FROM service_tickets;");

    const users = await query(
      `SELECT u.id, u.email, u.full_name, u.role, u.created_at, p.active_track, p.target_interview_date
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       ORDER BY u.created_at DESC;`
    );

    const revisions = await query(
      `SELECT r.id, r.entity_type, r.entity_id, r.diff_summary, r.created_at, u.full_name as author_name
       FROM content_revisions r
       LEFT JOIN users u ON u.id = r.changed_by_user_id
       ORDER BY r.created_at DESC LIMIT 20;`
    );

    return NextResponse.json({
      stats: {
        users: parseInt(userCount.rows[0]?.count || "0", 10),
        lessons: parseInt(lessonCount.rows[0]?.count || "0", 10),
        quizQuestions: parseInt(quizCount.rows[0]?.count || "0", 10),
        scenarios: parseInt(scenarioCount.rows[0]?.count || "0", 10),
        flashcards: parseInt(flashcardCount.rows[0]?.count || "0", 10),
        serviceTickets: parseInt(ticketCount.rows[0]?.count || "0", 10),
      },
      users: users.rows,
      revisions: revisions.rows,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Admin failure" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    const { action, entityType, entityId, payload, diffSummary } = await req.json();

    if (action === "update_lesson") {
      const { title, summary, estimatedMinutes } = payload;
      await query(
        `UPDATE lessons SET title = $1, summary = $2, estimated_minutes = $3 WHERE id = $4;`,
        [title, summary, estimatedMinutes, entityId]
      );
    } else if (action === "update_quiz_question") {
      const { questionText, explanation } = payload;
      await query(
        `UPDATE quiz_questions SET question_text = $1, explanation = $2 WHERE id = $3;`,
        [questionText, explanation, entityId]
      );
    }

    // Record revision
    const revId = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await query(
      `INSERT INTO content_revisions (id, entity_type, entity_id, changed_by_user_id, diff_summary)
       VALUES ($1, $2, $3, $4, $5);`,
      [revId, entityType || "lesson", entityId || "unknown", user.id, diffSummary || "Updated via admin console"]
    );

    return NextResponse.json({ success: true, revisionId: revId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save admin change" }, { status: 500 });
  }
}
