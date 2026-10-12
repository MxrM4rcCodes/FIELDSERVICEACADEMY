import { NextResponse } from "next/server";
import { createSessionToken, getUserForRole, SESSION_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

async function persistActiveRole(role: "admin" | "learner") {
  await query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key VARCHAR(50) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `).catch(() => {});

  await query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ('active_role', $1, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW();`,
    [role]
  ).catch(() => {});
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetRole: "admin" | "learner" = body.role === "admin" ? "admin" : "learner";

    // 1. Persist active role to database
    await persistActiveRole(targetRole);

    // 2. Resolve user
    const sessionUser = await getUserForRole(targetRole);
    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      token,
      role: targetRole,
    });

    // 3. Set cross-context cookies (works across iframes, HTTPS, and regular browsers)
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set(ROLE_COOKIE_NAME, targetRole, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to switch role" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const requestedRole: "admin" | "learner" = url.searchParams.get("role") === "admin" ? "admin" : "learner";
    const redirectTo = url.searchParams.get("redirect") || (requestedRole === "admin" ? "/admin" : "/");

    // 1. Persist active role to database
    await persistActiveRole(requestedRole);

    // 2. Resolve user
    const sessionUser = await getUserForRole(requestedRole);
    const token = await createSessionToken(sessionUser);

    const response = NextResponse.redirect(new URL(redirectTo, req.url));

    // 3. Set cookies
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set(ROLE_COOKIE_NAME, requestedRole, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
