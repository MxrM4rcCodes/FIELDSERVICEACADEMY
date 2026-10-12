import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    const { runId, choiceKey } = await req.json();

    if (!runId || !choiceKey) {
      return NextResponse.json({ error: "runId and choiceKey are required" }, { status: 400 });
    }

    // 1. Get active run
    const runRes = await query(
      `SELECT r.id, r.scenario_id, r.current_node_key, r.total_score, r.safety_score, r.diagnostic_score, r.status
       FROM scenario_runs r
       WHERE r.id = $1 AND r.user_id = $2;`,
      [runId, user.id]
    );

    if (runRes.rows.length === 0) {
      return NextResponse.json({ error: "Scenario run not found" }, { status: 404 });
    }
    const run = runRes.rows[0];

    // 2. Fetch current node
    const nodeRes = await query(
      `SELECT id, node_key, title FROM scenario_nodes WHERE scenario_id = $1 AND node_key = $2;`,
      [run.scenario_id, run.current_node_key]
    );
    if (nodeRes.rows.length === 0) {
      return NextResponse.json({ error: "Current node not found" }, { status: 404 });
    }
    const currentNode = nodeRes.rows[0];

    // 3. Fetch choice
    const choiceRes = await query(
      `SELECT id, choice_key, text, target_node_key, test_revealed_evidence, points_safety, points_diagnostic, points_cost, feedback
       FROM scenario_choices WHERE node_id = $1 AND choice_key = $2;`,
      [currentNode.id, choiceKey]
    );
    if (choiceRes.rows.length === 0) {
      return NextResponse.json({ error: "Choice not found" }, { status: 404 });
    }
    const choice = choiceRes.rows[0];

    // 4. Fetch target node
    const targetNodeRes = await query(
      `SELECT id, node_key, title, description, node_type, is_terminal, is_hazardous
       FROM scenario_nodes WHERE scenario_id = $1 AND node_key = $2;`,
      [run.scenario_id, choice.target_node_key]
    );
    if (targetNodeRes.rows.length === 0) {
      return NextResponse.json({ error: "Target node not found" }, { status: 404 });
    }
    const targetNode = targetNodeRes.rows[0];

    // 5. Calculate score deltas
    const totalDelta = choice.points_safety + choice.points_diagnostic + choice.points_cost;
    const newTotalScore = Math.max(0, run.total_score + totalDelta);
    const newSafetyScore = run.safety_score + choice.points_safety;
    const newDiagnosticScore = run.diagnostic_score + choice.points_diagnostic;

    // 6. Record event
    const eventId = `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await query(
      `INSERT INTO scenario_events (id, run_id, node_key, choice_key, choice_text, feedback, revealed_evidence, points_delta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        eventId,
        run.id,
        currentNode.node_key,
        choice.choice_key,
        choice.text,
        choice.feedback,
        choice.test_revealed_evidence || null,
        totalDelta,
      ]
    );

    // 7. Check terminal status
    let newStatus = run.status;
    let completedAt = null;

    if (targetNode.is_terminal) {
      if (targetNode.node_type === "terminal_success") {
        newStatus = "completed_success";
        completedAt = new Date().toISOString();
        // Boost hardware_safety competency score
        await query(
          `UPDATE competency_scores 
           SET observed_score = LEAST(100.0, observed_score + 8.0),
               total_evaluations = total_evaluations + 1,
               updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $1 AND domain = 'hardware_safety';`,
          [user.id]
        );
      } else if (targetNode.is_hazardous) {
        newStatus = "failed_safety";
        completedAt = new Date().toISOString();
      } else {
        newStatus = "failed_wrong_fix";
        completedAt = new Date().toISOString();
      }
    }

    // 8. Update run
    await query(
      `UPDATE scenario_runs
       SET current_node_key = $1,
           total_score = $2,
           safety_score = $3,
           diagnostic_score = $4,
           status = $5,
           completed_at = ${completedAt ? "CURRENT_TIMESTAMP" : "NULL"}
       WHERE id = $6;`,
      [targetNode.node_key, newTotalScore, newSafetyScore, newDiagnosticScore, newStatus, run.id]
    );

    return NextResponse.json({
      success: true,
      feedback: choice.feedback,
      revealedEvidence: choice.test_revealed_evidence || null,
      targetNodeKey: targetNode.node_key,
      pointsDelta: totalDelta,
      newTotalScore,
      isTerminal: targetNode.is_terminal,
      terminalType: targetNode.node_type,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process choice" }, { status: 500 });
  }
}
