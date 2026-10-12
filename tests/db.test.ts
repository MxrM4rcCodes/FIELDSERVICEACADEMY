import { describe, it, expect, beforeAll } from "vitest";
import { query } from "../src/lib/db";
import { runSeed } from "../src/lib/db/seed";

describe("Database & Curriculum Integrity", () => {
  beforeAll(async () => {
    await runSeed();
  });

  it("should have seeded all 14 curriculum days", async () => {
    const res = await query("SELECT count(*) FROM lessons;");
    expect(parseInt(res.rows[0].count, 10)).toBe(14);
  });

  it("should have at least 5 quiz questions per lesson (at least 70 total)", async () => {
    const res = await query("SELECT count(*) FROM quiz_questions;");
    expect(parseInt(res.rows[0].count, 10)).toBeGreaterThanOrEqual(70);
  });

  it("should have exactly 10 troubleshooting scenarios with initial nodes", async () => {
    const res = await query("SELECT count(*) FROM troubleshooting_scenarios;");
    expect(parseInt(res.rows[0].count, 10)).toBe(10);

    const nodesRes = await query("SELECT count(*) FROM scenario_nodes;");
    expect(parseInt(nodesRes.rows[0].count, 10)).toBeGreaterThanOrEqual(40);
  });

  it("should have at least 60 technical glossary flashcards across all categories", async () => {
    const res = await query("SELECT count(*) FROM flashcards;");
    expect(parseInt(res.rows[0].count, 10)).toBeGreaterThanOrEqual(60);
  });

  it("should enforce distinct admin and learner user accounts", async () => {
    const admin = await query("SELECT role FROM users WHERE email = 'admin@cgs-oris.academy';");
    expect(admin.rows[0].role).toBe("admin");

    const learner = await query("SELECT role FROM users WHERE email = 'technician@cgs-oris.academy';");
    expect(learner.rows[0].role).toBe("learner");
  });
});
