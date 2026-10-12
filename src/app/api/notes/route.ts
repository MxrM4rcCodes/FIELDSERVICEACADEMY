import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || "usr_learner_01";
    const { searchParams } = new URL(req.url);
    const refType = searchParams.get("type");

    let sql = `SELECT id, reference_type, reference_id, title, note_text, updated_at FROM user_notes WHERE user_id = $1`;
    const params: any[] = [userId];

    if (refType) {
      sql += ` AND reference_type = $2`;
      params.push(refType);
    }
    sql += ` ORDER BY updated_at DESC;`;

    const res = await query(sql, params);
    return NextResponse.json({ notes: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referenceType, referenceId, title, noteText } = await req.json();
    if (!title || !noteText) {
      return NextResponse.json({ error: "Title and text required" }, { status: 400 });
    }

    const noteId = `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await query(
      `INSERT INTO user_notes (id, user_id, reference_type, reference_id, title, note_text)
       VALUES ($1, $2, $3, $4, $5, $6);`,
      [noteId, user.id, referenceType || "general", referenceId || null, title, noteText]
    );

    return NextResponse.json({ success: true, id: noteId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save note" }, { status: 500 });
  }
}
