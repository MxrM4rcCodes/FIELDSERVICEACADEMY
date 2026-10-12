import { describe, it, expect } from "vitest";
import { loginWithCredentials, createSessionToken, verifySessionToken } from "../src/lib/auth";

describe("Authentication & Session Handling", () => {
  it("should authenticate learner credentials correctly", async () => {
    const res = await loginWithCredentials("technician@cgs-oris.academy", "FieldTech2026!");
    expect(res.success).toBe(true);
    expect(res.user?.role).toBe("learner");
    expect(res.user?.email).toBe("technician@cgs-oris.academy");
  });

  it("should authenticate admin credentials correctly", async () => {
    const res = await loginWithCredentials("admin@cgs-oris.academy", "Admin123!");
    expect(res.success).toBe(true);
    expect(res.user?.role).toBe("admin");
  });

  it("should reject invalid passwords", async () => {
    const res = await loginWithCredentials("admin@cgs-oris.academy", "WrongPassword123!");
    expect(res.success).toBe(false);
    expect(res.user).toBeUndefined();
  });

  it("should sign and verify valid JWT session tokens", async () => {
    const testUser = {
      id: "usr_test_01",
      email: "test@example.com",
      fullName: "Test Engineer",
      role: "learner" as const,
    };
    const token = await createSessionToken(testUser);
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded?.id).toBe("usr_test_01");
    expect(decoded?.role).toBe("learner");
  });

  it("should resolve proper user identities when toggling roles", async () => {
    const { getUserForRole } = await import("../src/lib/auth");

    const adminUser = await getUserForRole("admin");
    expect(adminUser.role).toBe("admin");
    expect(adminUser.email).toBe("admin@cgs-oris.academy");
    expect(adminUser.fullName).toContain("Sarah Jenkins");

    const learnerUser = await getUserForRole("learner");
    expect(learnerUser.role).toBe("learner");
    expect(learnerUser.email).toBe("technician@cgs-oris.academy");
    expect(learnerUser.fullName).toContain("Alex Morgan");
  });
});
