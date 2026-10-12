import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || "usr_learner_01";
    const { slug } = params;

    // 1. Fetch scenario
    const scnRes = await query(
      `SELECT id, scenario_number, title, slug, category, difficulty,
              customer_complaint, equipment_context, recent_changes,
              hidden_root_cause, initial_node_key, verification_criteria
       FROM troubleshooting_scenarios WHERE slug = $1;`,
      [slug]
    );

    if (scnRes.rows.length === 0) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }
    const scenario = scnRes.rows[0];

    // 2. Fetch or create active run
    let activeRunRes = await query(
      `SELECT id, current_node_key, status, total_score, safety_score, diagnostic_score, service_ticket_id
       FROM scenario_runs
       WHERE user_id = $1 AND scenario_id = $2 AND status = 'in_progress'
       ORDER BY created_at DESC LIMIT 1;`,
      [userId, scenario.id]
    );

    let run = activeRunRes.rows[0];
    if (!run) {
      const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await query(
        `INSERT INTO scenario_runs (id, user_id, scenario_id, status, current_node_key, total_score, safety_score, diagnostic_score)
         VALUES ($1, $2, $3, 'in_progress', $4, 0, 0, 0);`,
        [runId, userId, scenario.id, scenario.initial_node_key]
      );
      run = {
        id: runId,
        current_node_key: scenario.initial_node_key,
        status: "in_progress",
        total_score: 0,
        safety_score: 0,
        diagnostic_score: 0,
        service_ticket_id: null,
      };
    }

    // 3. Fetch current node
    const nodeRes = await query(
      `SELECT id, node_key, title, description, node_type, is_terminal, is_hazardous
       FROM scenario_nodes WHERE scenario_id = $1 AND node_key = $2;`,
      [scenario.id, run.current_node_key]
    );
    const currentNode = nodeRes.rows[0];

    // 4. Fetch available choices for this node
    let choices: any[] = [];
    if (currentNode && !currentNode.is_terminal) {
      const choiceRes = await query(
        `SELECT id, choice_key, text, target_node_key, sort_order
         FROM scenario_choices WHERE node_id = $1
         ORDER BY sort_order ASC;`,
        [currentNode.id]
      );
      choices = choiceRes.rows;
    }

    // 5. Fetch event history for this run
    const eventsRes = await query(
      `SELECT node_key, choice_key, choice_text, feedback, revealed_evidence, points_delta, created_at
       FROM scenario_events WHERE run_id = $1
       ORDER BY created_at ASC;`,
      [run.id]
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
      choices,
      events: eventsRes.rows,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load scenario" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  // Reset / restart scenario run
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = params;

    const scnRes = await query("SELECT id, initial_node_key FROM troubleshooting_scenarios WHERE slug = $1;", [slug]);
    if (scnRes.rows.length === 0) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }
    const scenario = scnRes.rows[0];

    const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await query(
      `INSERT INTO scenario_runs (id, user_id, scenario_id, status, current_node_key, total_score, safety_score, diagnostic_score)
       VALUES ($1, $2, $3, 'in_progress', $4, 0, 0, 0);`,
      [runId, user.id, scenario.id, scenario.initial_node_key]
    );

    return NextResponse.json({ success: true, runId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset scenario" }, { status: 500 });
  }
}
