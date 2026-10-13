import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const body = await req.json().catch(() => null);
    const flashcardId = typeof body?.flashcardId === "string" ? body.flashcardId : "";
    if (!flashcardId || flashcardId.length > 120 || typeof body?.isCorrect !== "boolean") {
      return NextResponse.json({ error: "A flashcard ID and boolean review result are required." }, { status: 400 });
    }

    const exists = await query<{ id: string }>("SELECT id FROM flashcards WHERE id = $1", [flashcardId]);
    if (!exists.rows[0]) return NextResponse.json({ error: "Flashcard not found." }, { status: 404 });

    const isCorrect = body.isCorrect;
    const saved = await query(
      `INSERT INTO flashcard_mastery
        (id, user_id, flashcard_id, mastery_level, review_count, correct_count, next_review_at, updated_at)
       VALUES (
        $1, $2, $3, CASE WHEN $4 THEN 1 ELSE 0 END, 1, CASE WHEN $4 THEN 1 ELSE 0 END,
        CURRENT_TIMESTAMP + CASE WHEN $4 THEN INTERVAL '2 days' ELSE INTERVAL '1 day' END,
        CURRENT_TIMESTAMP
       )
       ON CONFLICT (user_id, flashcard_id) DO UPDATE SET
         mastery_level = CASE
           WHEN $4 THEN LEAST(5, flashcard_mastery.mastery_level + 1)
           ELSE 0
         END,
         review_count = flashcard_mastery.review_count + 1,
         correct_count = flashcard_mastery.correct_count + CASE WHEN $4 THEN 1 ELSE 0 END,
         next_review_at = CASE
           WHEN $4 THEN CURRENT_TIMESTAMP + (LEAST(5, flashcard_mastery.mastery_level + 1) * INTERVAL '2 days')
           ELSE CURRENT_TIMESTAMP + INTERVAL '1 day'
         END,
         updated_at = CURRENT_TIMESTAMP
       RETURNING mastery_level, review_count, correct_count, next_review_at`,
      [crypto.randomUUID(), user.id, flashcardId, isCorrect],
    );
    return NextResponse.json({ success: true, mastery: saved.rows[0] });
  } catch (error) {
    console.error("Flashcard review save failed", error);
    return NextResponse.json({ error: "Unable to save this review." }, { status: 500 });
  }
}
