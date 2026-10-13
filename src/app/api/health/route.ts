import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query<{ version: string }>(
      "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1",
    );
    if (!result.rows[0]) return NextResponse.json({ status: "not_ready" }, { status: 503 });
    return NextResponse.json({ status: "ok", schemaVersion: result.rows[0].version });
  } catch {
    return NextResponse.json({ status: "not_ready" }, { status: 503 });
  }
}
