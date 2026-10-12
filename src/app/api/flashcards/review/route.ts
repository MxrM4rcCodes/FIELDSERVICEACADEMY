import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flashcardId, isCorrect } = await req.json();

    if (!flashcardId) {
      return NextResponse.json({ error: "flashcardId is required" }, { status: 400 });
    }

    // Leitner system: level 0 to 5
    // Correct increases level by 1, incorrect drops back to level 1
    const masteryId = `fcm_${user.id}_${flashcardId}`;

    await query(
      `INSERT INTO flashcard_mastery (id, user_id, flashcard_id, mastery_level, review_count, correct_count, next_review_at, updated_at)
       VALUES ($1, $2, $3, $4, 1, $5, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, flashcard_id) DO UPDATE SET
         mastery_level = CASE 
           WHEN $6 = true THEN LEAST(5, flashcard_mastery.mastery_level + 1)
           ELSE GREATEST(0, flashcard_mastery.mastery_level - 1)
         END,
         review_count = flashcard_mastery.review_count + 1,
         correct_count = flashcard_mastery.correct_count + CASE WHEN $6 = true THEN 1 ELSE 0 END,
         next_review_at = CURRENT_TIMESTAMP + (
           CASE 
             WHEN $6 = true THEN (LEAST(5, flashcard_mastery.mastery_level + 1) * INTERVAL '2 days')
             ELSE INTERVAL '1 day'
           END
         ),
         updated_at = CURRENT_TIMESTAMP;`,
      [masteryId, user.id, flashcardId, isCorrect ? 1 : 0, isCorrect ? 1 : 0, isCorrect]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record flashcard review" }, { status: 500 });
  }
}
