import { NextResponse } from "next/server";
import { loginWithCredentials, createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await loginWithCredentials(email, password);
    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || "Authentication failed" }, { status: 401 });
    }

    const token = await createSessionToken(result.user);
    const response = NextResponse.json({ success: true, user: result.user });

    response.cookies.set("cgs_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
