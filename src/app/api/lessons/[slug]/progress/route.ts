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
    const { status, timeSpentSeconds } = await req.json();

    const lessonRes = await query("SELECT id FROM lessons WHERE slug = $1;", [slug]);
    if (lessonRes.rows.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    const lessonId = lessonRes.rows[0].id;

    const progressId = `prog_${user.id}_${lessonId}`;
    const isCompleted = status === "completed";

    await query(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, status, time_spent_seconds, completed_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, ${isCompleted ? "CURRENT_TIMESTAMP" : "NULL"}, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET
         status = EXCLUDED.status,
         time_spent_seconds = lesson_progress.time_spent_seconds + EXCLUDED.time_spent_seconds,
         completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN CURRENT_TIMESTAMP ELSE lesson_progress.completed_at END,
         updated_at = CURRENT_TIMESTAMP;`,
      [progressId, user.id, lessonId, status || "in_progress", timeSpentSeconds || 0]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update progress" }, { status: 500 });
  }
}
