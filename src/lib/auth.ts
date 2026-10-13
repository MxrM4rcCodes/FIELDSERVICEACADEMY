import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { getSessionSecret, SESSION_COOKIE_NAME } from "@/lib/auth-config";

export { SESSION_COOKIE_NAME } from "@/lib/auth-config";

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "learner";
}

export async function createSessionToken(user: Pick<UserSession, "id">): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error("JWT_SECRET must be set to a random value of at least 32 characters in production.");

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<{ id: string } | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    return { id: payload.sub };
  } catch {
    return null;
  }
}

/** Resolve identity and role from the database; never trust client role headers or JWT claims. */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const claims = await verifySessionToken(token);
    if (!claims) return null;

    const result = await query<{
      id: string;
      email: string;
      full_name: string;
      role: "admin" | "learner";
    }>(
      `SELECT id, email, full_name, role
         FROM users
        WHERE id = $1 AND is_active = TRUE`,
      [claims.id],
    );
    const row = result.rows[0];
    if (!row || (row.role !== "admin" && row.role !== "learner")) return null;

    return { id: row.id, email: row.email, fullName: row.full_name, role: row.role };
  } catch {
    return null;
  }
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: UserSession; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await query<{
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    role: "admin" | "learner";
  }>(
    `SELECT id, email, password_hash, full_name, role
       FROM users
      WHERE LOWER(email) = $1 AND is_active = TRUE`,
    [normalizedEmail],
  );

  if (result.rows.length === 0) {
    return { success: false, error: "Invalid email or password." };
  }

  const row = result.rows[0];
  const isValid = await bcrypt.compare(password, row.password_hash);
  if (!isValid) return { success: false, error: "Invalid email or password." };

  return {
    success: true,
    user: {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
    },
  };
}
