import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const queryTerm = searchParams.get("q");

    let sql = `
      SELECT f.id, f.term, f.category, f.pronunciation, f.definition,
             f.field_context, f.key_takeaway, f.common_misconception, f.sort_order,
             COALESCE(fm.mastery_level, 0) as mastery_level,
             COALESCE(fm.review_count, 0) as review_count,
             COALESCE(fm.correct_count, 0) as correct_count,
             fm.next_review_at
      FROM flashcards f
      LEFT JOIN flashcard_mastery fm ON fm.flashcard_id = f.id AND fm.user_id = $1
      WHERE 1=1
    `;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (category && category !== "all") {
      sql += ` AND f.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (queryTerm && queryTerm.trim().length > 0) {
      sql += ` AND (LOWER(f.term) LIKE $${paramIndex} OR LOWER(f.definition) LIKE $${paramIndex})`;
      params.push(`%${queryTerm.trim().toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY f.sort_order ASC;`;

    const res = await query(sql, params);

    // Calculate category counts and overall mastery stats
    const statsRes = await query(
      `SELECT count(*) as total,
              count(*) FILTER (WHERE fm.mastery_level >= 3) as mastered,
              count(*) FILTER (WHERE fm.mastery_level BETWEEN 1 AND 2) as learning,
              count(*) FILTER (WHERE fm.mastery_level IS NULL OR fm.mastery_level = 0) as unreviewed
       FROM flashcards f
       LEFT JOIN flashcard_mastery fm ON fm.flashcard_id = f.id AND fm.user_id = $1;`,
      [userId]
    );

    return NextResponse.json({
      flashcards: res.rows,
      stats: statsRes.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load flashcards" }, { status: 500 });
  }
}
