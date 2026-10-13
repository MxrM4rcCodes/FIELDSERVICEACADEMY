import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { query } from "../src/lib/db";
import { runSeed } from "../src/lib/db/seed";
import { seedScenarios } from "../src/lib/db/seed-data/scenarios";

describe("Scenario branching simulation integrity", () => {
  let constraintUserId = "";

  beforeAll(async () => {
    await runSeed();
  });

  afterAll(async () => {
    if (constraintUserId) await query("DELETE FROM users WHERE id = $1", [constraintUserId]);
  });

  it("seeds the ten authored scenario graphs with valid starts, edges, and terminal nodes", async () => {
    const scenarios = await query<{ id: string; scenario_number: number; slug: string; initial_node_key: string }>(
      "SELECT id, scenario_number, slug, initial_node_key FROM troubleshooting_scenarios ORDER BY scenario_number",
    );
    expect(scenarios.rows).toHaveLength(10);
    expect(seedScenarios).toHaveLength(10);

    for (const scenario of scenarios.rows) {
      const source = seedScenarios.find((item) => item.scenarioNumber === scenario.scenario_number);
      expect(source?.slug).toBe(scenario.slug);
      const nodes = await query<{ node_key: string; is_terminal: boolean; is_hazardous: boolean; node_type: string }>(
        "SELECT node_key, is_terminal, is_hazardous, node_type FROM scenario_nodes WHERE scenario_id = $1",
        [scenario.id],
      );
      const nodeKeys = new Set(nodes.rows.map((item) => item.node_key));
      expect(nodeKeys.size).toBe(source?.nodes.length);
      expect(nodeKeys.has(scenario.initial_node_key)).toBe(true);
      const initial = nodes.rows.find((item) => item.node_key === scenario.initial_node_key);
      expect(initial?.is_terminal).toBe(false);
      expect(nodes.rows.some((item) => item.is_terminal)).toBe(true);

      const choices = await query<{ source_node: string; target_node_key: string }>(
        `SELECT n.node_key AS source_node, c.target_node_key
           FROM scenario_choices c
           JOIN scenario_nodes n ON n.id = c.node_id
          WHERE n.scenario_id = $1`,
        [scenario.id],
      );
      expect(choices.rows.length).toBeGreaterThan(0);
      for (const edge of choices.rows) expect(nodeKeys.has(edge.target_node_key)).toBe(true);

      const terminalChoices = await query<{ count: string }>(
        `SELECT count(c.id) AS count
           FROM scenario_nodes n
           LEFT JOIN scenario_choices c ON c.node_id = n.id
          WHERE n.scenario_id = $1 AND n.is_terminal = TRUE
          GROUP BY n.id`,
        [scenario.id],
      );
      expect(terminalChoices.rows.every((row) => Number(row.count) === 0)).toBe(true);
      expect(nodes.rows.filter((item) => item.is_hazardous).every((item) => item.is_terminal && item.node_type !== "terminal_success")).toBe(true);
    }
  });

  it("scores evidence-focused choices separately from hazardous and unsupported choices", async () => {
    const choices = await query<{
      choice_key: string;
      points_safety: number;
      points_diagnostic: number;
      target_node_key: string;
      scenario_number: number;
      source_node: string;
    }>(
      `SELECT c.choice_key, c.points_safety, c.points_diagnostic, c.target_node_key,
              s.scenario_number, n.node_key AS source_node
         FROM scenario_choices c
         JOIN scenario_nodes n ON n.id = c.node_id
         JOIN troubleshooting_scenarios s ON s.id = n.scenario_id`,
    );
    const gather = choices.rows.find((item) => item.choice_key === "c1_gather_context");
    expect(gather?.points_diagnostic).toBeGreaterThan(0);
    const approvedReview = choices.rows.find((item) => item.choice_key === "c1_review_records");
    expect(approvedReview?.points_diagnostic).toBeGreaterThan(0);

    const hazardChoice = choices.rows.find((item) => item.scenario_number === 10 && item.choice_key === "c10_open_cabinet");
    expect(hazardChoice?.points_safety).toBeLessThan(0);
    const hazardousTarget = await query<{ is_terminal: boolean; is_hazardous: boolean }>(
      `SELECT is_terminal, is_hazardous FROM scenario_nodes
        WHERE scenario_id = (SELECT id FROM troubleshooting_scenarios WHERE scenario_number = 10)
          AND node_key = $1`,
      [hazardChoice?.target_node_key],
    );
    expect(hazardousTarget.rows[0]).toEqual({ is_terminal: true, is_hazardous: true });
  });

  it("enforces at most one active run per learner and scenario at the database layer", async () => {
    const userId = `scenario-constraint-user-${crypto.randomUUID()}`;
    constraintUserId = userId;
    const scenario = await query<{ id: string; initial_node_key: string }>(
      "SELECT id, initial_node_key FROM troubleshooting_scenarios WHERE scenario_number = 1",
    );
    await query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ($1, $2, 'unused-test-hash', 'Scenario Constraint Test', 'learner')`,
      [userId, `${userId}@example.test`],
    );
    const runValues = (id: string) => [id, userId, scenario.rows[0].id, scenario.rows[0].initial_node_key];
    const insertRun = `INSERT INTO scenario_runs (id, user_id, scenario_id, status, current_node_key)
                       VALUES ($1, $2, $3, 'in_progress', $4)`;
    await query(insertRun, runValues(crypto.randomUUID()));
    await expect(query(insertRun, runValues(crypto.randomUUID()))).rejects.toThrow();
  });
});
