import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query, withTransaction } from "@/lib/db";

const ACTIVITY_SLUG = "oris_requirement_check";
const CHOICE_KEYS = new Set(["verify", "guess", "assume"]);

interface PracticeStatsRow {
  attempts: string | number;
  correct: string | number;
}

async function loadStats(userId: string, tx?: { query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[] }> }) {
  const sql = `SELECT count(*) AS attempts,
                      count(*) FILTER (WHERE is_correct = TRUE) AS correct
                 FROM practice_attempts
                WHERE user_id = $1 AND activity_slug = $2`;
  const result = tx
    ? await tx.query<PracticeStatsRow>(sql, [userId, ACTIVITY_SLUG])
    : await query<PracticeStatsRow>(sql, [userId, ACTIVITY_SLUG]);
  const row = result.rows[0] ?? { attempts: 0, correct: 0 };
  return { attempts: Number(row.attempts), correct: Number(row.correct) };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    return NextResponse.json({ stats: await loadStats(user.id) });
  } catch (error) {
    console.error("ORIS practice score read failed", error);
    return NextResponse.json({ error: "Unable to load your saved practice score." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const body = await req.json().catch(() => null);
    const promptIndex = body?.promptIndex;
    const choiceKey = body?.choiceKey;
    if (!Number.isInteger(promptIndex) || promptIndex < 0 || promptIndex > 4
      || typeof choiceKey !== "string" || !CHOICE_KEYS.has(choiceKey)) {
      return NextResponse.json({ error: "Choose a valid response for an ORIS practice prompt." }, { status: 400 });
    }

    const stats = await withTransaction(async (tx) => {
      await tx.query(
        `INSERT INTO practice_attempts (id, user_id, activity_slug, prompt_index, choice_key, is_correct)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [crypto.randomUUID(), user.id, ACTIVITY_SLUG, promptIndex, choiceKey, choiceKey === "verify"],
      );
      return loadStats(user.id, tx);
    });

    return NextResponse.json({ success: true, isCorrect: choiceKey === "verify", stats });
  } catch (error) {
    console.error("ORIS practice answer save failed", error);
    return NextResponse.json({ error: "Unable to save your practice response." }, { status: 500 });
  }
}
