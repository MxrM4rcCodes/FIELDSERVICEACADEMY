import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cgs-oris-field-service-academy-secret-key-2026-plymouth-mn"
);

export const SESSION_COOKIE_NAME = "cgs_session_token";
export const ROLE_COOKIE_NAME = "cgs_user_role";

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "learner";
}

export async function createSessionToken(user: UserSession): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: payload.role as "admin" | "learner",
    };
  } catch {
    return null;
  }
}

export async function getUserForRole(role: "admin" | "learner"): Promise<UserSession> {
  const email = role === "admin" ? "admin@cgs-oris.academy" : "technician@cgs-oris.academy";
  try {
    const res = await query(
      "SELECT id, email, full_name, role FROM users WHERE LOWER(email) = LOWER($1);",
      [email]
    );
    if (res && res.rows.length > 0) {
      const row = res.rows[0];
      return {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        role: row.role as "admin" | "learner",
      };
    }
  } catch {
    // fallback if db query fails
  }

  if (role === "admin") {
    return {
      id: "usr_admin_01",
      email: "admin@cgs-oris.academy",
      fullName: "Sarah Jenkins (Technical Director)",
      role: "admin",
    };
  }
  return {
    id: "usr_learner_01",
    email: "technician@cgs-oris.academy",
    fullName: "Alex Morgan (Field Service Candidate)",
    role: "learner",
  };
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    // 1. Check custom headers (x-user-role or authorization Bearer)
    try {
      const headerList = headers();
      const roleHeader = headerList.get("x-user-role");
      if (roleHeader === "admin" || roleHeader === "learner") {
        return await getUserForRole(roleHeader);
      }

      const authHeader = headerList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const bearerToken = authHeader.substring(7);
        const verified = await verifySessionToken(bearerToken);
        if (verified) return verified;
      }
    } catch {
      // headers() unavailable (e.g. outside request context)
    }

    // 2. Check cookies
    try {
      const cookieStore = cookies();
      const roleCookie = cookieStore.get(ROLE_COOKIE_NAME)?.value;
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

      if (token) {
        const session = await verifySessionToken(token);
        if (session) {
          if (roleCookie === "admin" && session.role !== "admin") {
            return await getUserForRole("admin");
          }
          if (roleCookie === "learner" && session.role !== "learner") {
            return await getUserForRole("learner");
          }
          return session;
        }
      }

      if (roleCookie === "admin" || roleCookie === "learner") {
        return await getUserForRole(roleCookie);
      }
    } catch {
      // cookies() unavailable
    }

    // 3. Check persistent database app_settings table
    try {
      const dbRoleRes = await query("SELECT value FROM app_settings WHERE key = 'active_role';");
      if (dbRoleRes && dbRoleRes.rows.length > 0) {
        const activeRole = dbRoleRes.rows[0].value;
        if (activeRole === "admin" || activeRole === "learner") {
          return await getUserForRole(activeRole);
        }
      }
    } catch {
      // app_settings unavailable
    }

    // Default to the seeded learner session
    return await getUserForRole("learner");
  } catch {
    return await getUserForRole("learner");
  }
}

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserSession; error?: string }> {
  const result = await query(
    "SELECT id, email, password_hash, full_name, role FROM users WHERE LOWER(email) = LOWER($1);",
    [email.trim()]
  );

  if (result.rows.length === 0) {
    return { success: false, error: "Invalid email or password." };
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return { success: false, error: "Invalid email or password." };
  }

  const userSession: UserSession = {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role as "admin" | "learner",
  };

  return { success: true, user: userSession };
}
