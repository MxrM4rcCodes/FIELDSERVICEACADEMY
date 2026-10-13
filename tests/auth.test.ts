import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAccount } from "../src/lib/accounts";
import { loginWithCredentials, createSessionToken, verifySessionToken } from "../src/lib/auth";
import { query } from "../src/lib/db";

describe("Database-backed authentication and sessions", () => {
  const unique = crypto.randomUUID();
  const learnerEmail = `learner-${unique}@example.test`;
  const adminEmail = `admin-${unique}@example.test`;
  let learnerId = "";
  let adminId = "";

  beforeAll(async () => {
    const learner = await createAccount({ email: learnerEmail, password: "LearnerTest!Passphrase2026", fullName: "Test Learner" });
    const admin = await createAccount({ email: adminEmail, password: "AdminTest!Passphrase2026", fullName: "Test Administrator", role: "admin" });
    learnerId = learner.id;
    adminId = admin.id;
  });

  afterAll(async () => {
    if (learnerId || adminId) {
      await query("DELETE FROM users WHERE id = ANY($1::text[])", [[learnerId, adminId].filter(Boolean)]);
    }
  });

  it("authenticates database-backed learner and administrator identities", async () => {
    const learner = await loginWithCredentials(learnerEmail.toUpperCase(), "LearnerTest!Passphrase2026");
    expect(learner.success).toBe(true);
    expect(learner.user?.role).toBe("learner");
    expect(learner.user?.id).toBe(learnerId);

    const admin = await loginWithCredentials(adminEmail, "AdminTest!Passphrase2026");
    expect(admin.success).toBe(true);
    expect(admin.user?.role).toBe("admin");
    expect(admin.user?.id).toBe(adminId);
  });

  it("rejects incorrect credentials without revealing whether the account exists", async () => {
    const wrongPassword = await loginWithCredentials(learnerEmail, "WrongTest!Passphrase2026");
    const unknownEmail = await loginWithCredentials(`unknown-${unique}@example.test`, "WrongTest!Passphrase2026");
    expect(wrongPassword).toEqual({ success: false, error: "Invalid email or password." });
    expect(unknownEmail).toEqual({ success: false, error: "Invalid email or password." });
  });

  it("signs a subject-only token, rejects tampering, and does not trust role claims", async () => {
    const token = await createSessionToken({ id: learnerId });
    expect(typeof token).toBe("string");
    expect(await verifySessionToken(token)).toEqual({ id: learnerId });
    expect(await verifySessionToken(`${token}tampered`)).toBeNull();
  });
});
