import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const allowedReferenceTypes = new Set(["lesson", "scenario", "system_node", "general"]);

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const referenceType = new URL(req.url).searchParams.get("type");
    if (referenceType && !allowedReferenceTypes.has(referenceType)) {
      return NextResponse.json({ error: "Unsupported note reference type." }, { status: 400 });
    }

    const result = referenceType
      ? await query(
          `SELECT id, reference_type, reference_id, title, note_text, updated_at
             FROM user_notes WHERE user_id = $1 AND reference_type = $2
            ORDER BY updated_at DESC`,
          [user.id, referenceType],
        )
      : await query(
          `SELECT id, reference_type, reference_id, title, note_text, updated_at
             FROM user_notes WHERE user_id = $1 ORDER BY updated_at DESC`,
          [user.id],
        );
    return NextResponse.json({ notes: result.rows });
  } catch (error) {
    console.error("Notes read failed", error);
    return NextResponse.json({ error: "Unable to load your notes." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Note details are required." }, { status: 400 });
    }
    const referenceType = body.referenceType === undefined ? "general" : body.referenceType;
    const referenceId = body.referenceId ?? null;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const noteText = typeof body.noteText === "string" ? body.noteText.trim() : "";
    if (typeof referenceType !== "string" || !allowedReferenceTypes.has(referenceType)) {
      return NextResponse.json({ error: "Choose a supported note reference type." }, { status: 400 });
    }
    if (referenceId !== null && (typeof referenceId !== "string" || referenceId.length > 120)) {
      return NextResponse.json({ error: "Note reference ID is invalid." }, { status: 400 });
    }
    if (title.length < 1 || title.length > 160 || noteText.length < 1 || noteText.length > 10000) {
      return NextResponse.json({ error: "Enter a title up to 160 characters and note text up to 10,000 characters." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO user_notes (id, user_id, reference_type, reference_id, title, note_text)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, user.id, referenceType, referenceId, title, noteText],
    );
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("Note save failed", error);
    return NextResponse.json({ error: "Unable to save your note." }, { status: 500 });
  }
}
