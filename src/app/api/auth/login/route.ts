import { NextResponse } from "next/server";
import { loginWithCredentials, createSessionToken } from "@/lib/auth";
import { sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-config";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (email.length > 254 || password.length > 256 || !email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const result = await loginWithCredentials(email, password);
    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken(result.user);
    const response = NextResponse.json({ success: true, user: result.user });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error("Login request failed", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
