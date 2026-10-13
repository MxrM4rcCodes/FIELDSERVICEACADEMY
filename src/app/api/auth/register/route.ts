import { NextResponse } from "next/server";
import { createAccount } from "@/lib/accounts";
import { createSessionToken } from "@/lib/auth";
import { sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-config";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (fullName.length < 2 || fullName.length > 80) {
      return NextResponse.json({ error: "Enter a name between 2 and 80 characters." }, { status: 400 });
    }
    if (email.length > 254 || !emailPattern.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 12 || password.length > 128) {
      return NextResponse.json({ error: "Password must be 12–128 characters long." }, { status: 400 });
    }

    const user = await createAccount({ email, password, fullName, role: "learner" });
    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true, user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    return response;
  } catch (error: unknown) {
    const databaseError = error as { code?: string };
    if (databaseError.code === "23505") {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }
    console.error("Registration request failed", error);
    return NextResponse.json({ error: "Unable to create the account right now." }, { status: 500 });
  }
}
