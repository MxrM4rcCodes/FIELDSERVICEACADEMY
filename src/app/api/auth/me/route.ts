import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  // Fetch full profile info
  const profileRes = await query(
    `SELECT target_interview_date, active_track, notes, experience_level 
     FROM profiles WHERE user_id = $1;`,
    [user.id]
  );

  return NextResponse.json({
    user: {
      ...user,
      profile: profileRes.rows[0] || null,
    },
  });
}
