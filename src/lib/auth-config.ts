export const SESSION_COOKIE_NAME = "cgs_session_token";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function getSessionSecret(): Uint8Array | null {
  const configured = process.env.JWT_SECRET;
  if (configured && configured.length >= 32) return new TextEncoder().encode(configured);

  // A deliberately non-production key keeps local development easy to start.
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("local-only-secret-change-before-deploy-cgs-oris-academy");
  }
  return null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
