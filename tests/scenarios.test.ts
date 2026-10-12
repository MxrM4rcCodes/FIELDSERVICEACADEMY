import { describe, it, expect, beforeAll } from "vitest";
import { query } from "../src/lib/db";
import { runSeed } from "../src/lib/db/seed";

describe("Scenario Branching Simulation Engine", () => {
  beforeAll(async () => {
    await runSeed();
  });

  it("should have all 10 scenarios with valid initial and terminal nodes", async () => {
    const scenarios = await query("SELECT id, scenario_number, initial_node_key FROM troubleshooting_scenarios ORDER BY scenario_number;");
    expect(scenarios.rows.length).toBe(10);

    for (const scn of scenarios.rows) {
      const initNode = await query(
        "SELECT id, is_terminal FROM scenario_nodes WHERE scenario_id = $1 AND node_key = $2;",
        [scn.id, scn.initial_node_key]
      );
      expect(initNode.rows.length).toBe(1);
      expect(initNode.rows[0].is_terminal).toBe(false);

      const terminalNodes = await query(
        "SELECT id, node_type FROM scenario_nodes WHERE scenario_id = $1 AND is_terminal = true;",
        [scn.id]
      );
      expect(terminalNodes.rows.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should penalize hazardous choices and reward least-invasive diagnostic choices", async () => {
    // Check choices in Scenario 1
    const choices = await query(
      `SELECT c.choice_key, c.points_safety, c.points_diagnostic, c.points_cost
       FROM scenario_choices c
       JOIN scenario_nodes n ON n.id = c.node_id
       JOIN troubleshooting_scenarios s ON s.id = n.scenario_id
       WHERE s.scenario_number = 1;`
    );

    const razorScrape = choices.rows.find((c) => c.choice_key === "c1_scrape_razor");
    expect(razorScrape.points_diagnostic).toBeLessThan(0);

    const nozzleCheck = choices.rows.find((c) => c.choice_key === "c1_inspect_nozzle_check");
    expect(nozzleCheck.points_diagnostic).toBeGreaterThan(0);
  });
});
