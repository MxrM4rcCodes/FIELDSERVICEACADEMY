import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  const profile = await query(
    `SELECT target_interview_date, active_track, experience_level
       FROM profiles
      WHERE user_id = $1`,
    [user.id],
  );
  return NextResponse.json({ user, profile: profile.rows[0] || null });
}
