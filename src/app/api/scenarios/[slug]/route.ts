import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query, withTransaction } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const { slug } = await params;

    const scenarioResult = await query(
      `SELECT id, scenario_number, title, slug, category, difficulty,
              customer_complaint, equipment_context, recent_changes,
              initial_node_key, verification_criteria
         FROM troubleshooting_scenarios WHERE slug = $1`,
      [slug],
    );
    const scenario = scenarioResult.rows[0];
    if (!scenario) return NextResponse.json({ error: "Scenario not found" }, { status: 404 });

    let activeRunResult = await query(
      `SELECT id, current_node_key, status, total_score, safety_score, diagnostic_score, service_ticket_id
         FROM scenario_runs
        WHERE user_id = $1 AND scenario_id = $2
        ORDER BY created_at DESC LIMIT 1`,
      [user.id, scenario.id],
    );
    let run = activeRunResult.rows[0];

    // Keep terminal feedback visible until the learner explicitly restarts.
    // A content-revision-abandoned run cannot be resumed, so make a fresh one.
    if (!run || run.status === "abandoned") {
      const runId = crypto.randomUUID();
      const created = await query(
        `INSERT INTO scenario_runs
           (id, user_id, scenario_id, status, current_node_key, total_score, safety_score, diagnostic_score)
         VALUES ($1, $2, $3, 'in_progress', $4, 0, 0, 0)
         ON CONFLICT DO NOTHING
         RETURNING id, current_node_key, status, total_score, safety_score, diagnostic_score, service_ticket_id`,
        [runId, user.id, scenario.id, scenario.initial_node_key],
      );
      run = created.rows[0];
      if (!run) {
        activeRunResult = await query(
          `SELECT id, current_node_key, status, total_score, safety_score, diagnostic_score, service_ticket_id
             FROM scenario_runs
            WHERE user_id = $1 AND scenario_id = $2 AND status = 'in_progress'
            ORDER BY created_at DESC LIMIT 1`,
          [user.id, scenario.id],
        );
        run = activeRunResult.rows[0];
      }
      if (!run) throw new Error("Could not create or load the active scenario run.");
    }

    const nodeResult = await query(
      `SELECT id, node_key, title, description, node_type, is_terminal, is_hazardous
         FROM scenario_nodes WHERE scenario_id = $1 AND node_key = $2`,
      [scenario.id, run.current_node_key],
    );
    const currentNode = nodeResult.rows[0];
    if (!currentNode) return NextResponse.json({ error: "Current scenario node not found" }, { status: 409 });

    const choiceResult = currentNode.is_terminal
      ? { rows: [] }
      : await query(
          `SELECT id, choice_key, text, target_node_key, sort_order
             FROM scenario_choices WHERE node_id = $1
            ORDER BY sort_order ASC`,
          [currentNode.id],
        );
    const eventsResult = await query(
      `SELECT node_key, choice_key, choice_text, feedback, revealed_evidence, points_delta, created_at
         FROM scenario_events WHERE run_id = $1
        ORDER BY created_at ASC`,
      [run.id],
    );

    return NextResponse.json({
      scenario: {
        id: scenario.id,
        scenarioNumber: scenario.scenario_number,
        title: scenario.title,
        slug: scenario.slug,
        category: scenario.category,
        difficulty: scenario.difficulty,
        customerComplaint: scenario.customer_complaint,
        equipmentContext: scenario.equipment_context,
        recentChanges: scenario.recent_changes,
        verificationCriteria: scenario.verification_criteria,
      },
      run: {
        id: run.id,
        status: run.status,
        currentNodeKey: run.current_node_key,
        totalScore: run.total_score,
        safetyScore: run.safety_score,
        diagnosticScore: run.diagnostic_score,
        serviceTicketId: run.service_ticket_id,
      },
      currentNode,
      choices: choiceResult.rows,
      events: eventsResult.rows,
    });
  } catch (error) {
    console.error("Scenario load failed", error);
    return NextResponse.json({ error: "Unable to load this scenario." }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  // Restart an exercise. The previous run is retained as abandoned history;
  // it is not scored as a failed diagnosis.
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const { slug } = await params;

    const scenarioResult = await query<{ id: string; initial_node_key: string }>(
      "SELECT id, initial_node_key FROM troubleshooting_scenarios WHERE slug = $1",
      [slug],
    );
    const scenario = scenarioResult.rows[0];
    if (!scenario) return NextResponse.json({ error: "Scenario not found" }, { status: 404 });

    const run = await withTransaction(async (tx) => {
      await tx.query(
        `UPDATE scenario_runs
            SET status = 'abandoned', completed_at = CURRENT_TIMESTAMP
          WHERE user_id = $1 AND scenario_id = $2 AND status = 'in_progress'`,
        [user.id, scenario.id],
      );
      const inserted = await tx.query<{ id: string }>(
        `INSERT INTO scenario_runs
           (id, user_id, scenario_id, status, current_node_key, total_score, safety_score, diagnostic_score)
         VALUES ($1, $2, $3, 'in_progress', $4, 0, 0, 0)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [crypto.randomUUID(), user.id, scenario.id, scenario.initial_node_key],
      );
      if (inserted.rows[0]) return inserted.rows[0];
      const active = await tx.query<{ id: string }>(
        `SELECT id FROM scenario_runs
          WHERE user_id = $1 AND scenario_id = $2 AND status = 'in_progress'
          ORDER BY created_at DESC LIMIT 1`,
        [user.id, scenario.id],
      );
      if (!active.rows[0]) throw new Error("Could not restart the scenario run.");
      return active.rows[0];
    });

    return NextResponse.json({ success: true, runId: run.id });
  } catch (error) {
    console.error("Scenario restart failed", error);
    return NextResponse.json({ error: "Unable to restart this scenario." }, { status: 500 });
  }
}
