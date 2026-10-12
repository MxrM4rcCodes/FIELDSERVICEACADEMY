import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track"); // 'bootcamp' or 'course_14'

    let sql = `
      SELECT l.id, l.day_number, l.bootcamp_day_number, l.title, l.slug, l.summary,
             l.estimated_minutes, l.competency_domain, l.objectives, l.prerequisites,
             lp.status, lp.time_spent_seconds, lp.completed_at
      FROM lessons l
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
    `;

    const params: any[] = [user?.id || "usr_learner_01"];

    if (track === "bootcamp") {
      sql += ` WHERE l.bootcamp_day_number IS NOT NULL ORDER BY l.bootcamp_day_number ASC, l.day_number ASC;`;
    } else {
      sql += ` ORDER BY l.day_number ASC;`;
    }

    const res = await query(sql, params);
    return NextResponse.json({ lessons: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load lessons" }, { status: 500 });
  }
}
