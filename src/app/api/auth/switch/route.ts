import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    const targetEmail = role === "admin" ? "admin@cgs-oris.academy" : "technician@cgs-oris.academy";

    const res = await query(
      "SELECT id, email, full_name, role FROM users WHERE LOWER(email) = LOWER($1);",
      [targetEmail]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = res.rows[0];
    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role as "admin" | "learner",
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({ success: true, user: sessionUser });

    response.cookies.set("cgs_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to switch role" }, { status: 500 });
  }
}
