import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { slug } = await params;
    const body = await req.json().catch(() => null);
    const timeSpentSeconds = body?.timeSpentSeconds ?? 0;
    if (!Number.isInteger(timeSpentSeconds) || timeSpentSeconds < 0 || timeSpentSeconds > 3600) {
      return NextResponse.json({ error: "timeSpentSeconds must be an integer from 0 to 3600." }, { status: 400 });
    }
    if (body?.status !== undefined && body.status !== "in_progress") {
      return NextResponse.json({ error: "Only lesson reading progress can be saved here; completion is recorded by a passing knowledge check." }, { status: 400 });
    }

    const lesson = await query<{ id: string }>("SELECT id FROM lessons WHERE slug = $1", [slug]);
    if (!lesson.rows[0]) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const lessonId = lesson.rows[0].id;
    await query(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, status, time_spent_seconds, updated_at)
       VALUES ($1, $2, $3, 'in_progress', $4, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET
         status = CASE WHEN lesson_progress.status = 'completed' THEN 'completed' ELSE 'in_progress' END,
         time_spent_seconds = lesson_progress.time_spent_seconds + EXCLUDED.time_spent_seconds,
         updated_at = CURRENT_TIMESTAMP`,
      [`progress_${crypto.randomUUID()}`, user.id, lessonId, timeSpentSeconds],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lesson progress update failed", error);
    return NextResponse.json({ error: "Unable to save lesson progress." }, { status: 500 });
  }
}
