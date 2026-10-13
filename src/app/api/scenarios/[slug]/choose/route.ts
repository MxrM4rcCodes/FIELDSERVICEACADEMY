import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { withTransaction } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { slug } = await params;
    const body = await req.json().catch(() => null);
    const runId = typeof body?.runId === "string" ? body.runId : "";
    const choiceKey = typeof body?.choiceKey === "string" ? body.choiceKey : "";
    if (!runId || runId.length > 120 || !choiceKey || choiceKey.length > 120) {
      return NextResponse.json({ error: "A valid runId and choiceKey are required." }, { status: 400 });
    }

    const outcome = await withTransaction(async (tx) => {
      // Lock the user's run and hold the lock through event insertion and state
      // update. Concurrent clicks then see the committed node, not stale state.
      const runResult = await tx.query<{
        id: string;
        scenario_id: string;
        current_node_key: string;
        total_score: number;
        safety_score: number;
        diagnostic_score: number;
        status: string;
      }>(
        `SELECT r.id, r.scenario_id, r.current_node_key, r.total_score,
                r.safety_score, r.diagnostic_score, r.status
           FROM scenario_runs r
           JOIN troubleshooting_scenarios s ON s.id = r.scenario_id
          WHERE r.id = $1 AND r.user_id = $2 AND s.slug = $3
          FOR UPDATE OF r`,
        [runId, user.id, slug],
      );
      const run = runResult.rows[0];
      if (!run) return { error: "Scenario run not found", status: 404 } as const;
      if (run.status !== "in_progress") {
        return { error: "This scenario run is already complete. Restart to practice again.", status: 409 } as const;
      }

      const nodeResult = await tx.query<{ id: string; node_key: string }>(
        `SELECT id, node_key FROM scenario_nodes
          WHERE scenario_id = $1 AND node_key = $2`,
        [run.scenario_id, run.current_node_key],
      );
      const currentNode = nodeResult.rows[0];
      if (!currentNode) return { error: "Current scenario node not found", status: 409 } as const;

      const choiceResult = await tx.query<{
        choice_key: string;
        text: string;
        target_node_key: string;
        test_revealed_evidence: string | null;
        points_safety: number;
        points_diagnostic: number;
        points_cost: number;
        feedback: string;
      }>(
        `SELECT choice_key, text, target_node_key, test_revealed_evidence,
                points_safety, points_diagnostic, points_cost, feedback
           FROM scenario_choices WHERE node_id = $1 AND choice_key = $2`,
        [currentNode.id, choiceKey],
      );
      const choice = choiceResult.rows[0];
      if (!choice) return { error: "That choice is not available at the current node.", status: 409 } as const;

      const targetResult = await tx.query<{
        node_key: string;
        node_type: string;
        is_terminal: boolean;
        is_hazardous: boolean;
      }>(
        `SELECT node_key, node_type, is_terminal, is_hazardous
           FROM scenario_nodes WHERE scenario_id = $1 AND node_key = $2`,
        [run.scenario_id, choice.target_node_key],
      );
      const target = targetResult.rows[0];
      if (!target) return { error: "The scenario path is misconfigured. Contact an administrator.", status: 409 } as const;

      const totalDelta = Number(choice.points_safety) + Number(choice.points_diagnostic) + Number(choice.points_cost);
      const newTotalScore = Math.max(0, Number(run.total_score) + totalDelta);
      const newSafetyScore = Number(run.safety_score) + Number(choice.points_safety);
      const newDiagnosticScore = Number(run.diagnostic_score) + Number(choice.points_diagnostic);
      let newStatus = "in_progress";
      if (target.is_terminal) {
        newStatus = target.node_type === "terminal_success"
          ? "completed_success"
          : target.is_hazardous
            ? "failed_safety"
            : "failed_wrong_fix";
      }

      await tx.query(
        `INSERT INTO scenario_events
          (id, run_id, node_key, choice_key, choice_text, feedback, revealed_evidence, points_delta)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          crypto.randomUUID(),
          run.id,
          currentNode.node_key,
          choice.choice_key,
          choice.text,
          choice.feedback,
          choice.test_revealed_evidence || null,
          totalDelta,
        ],
      );
      await tx.query(
        `UPDATE scenario_runs
            SET current_node_key = $1,
                total_score = $2,
                safety_score = $3,
                diagnostic_score = $4,
                status = $5,
                completed_at = CASE WHEN $6 = 'in_progress' THEN NULL ELSE CURRENT_TIMESTAMP END
          WHERE id = $7 AND user_id = $8`,
        [target.node_key, newTotalScore, newSafetyScore, newDiagnosticScore, newStatus, newStatus, run.id, user.id],
      );

      return {
        success: true,
        feedback: choice.feedback,
        revealedEvidence: choice.test_revealed_evidence || null,
        targetNodeKey: target.node_key,
        pointsDelta: totalDelta,
        newTotalScore,
        isTerminal: target.is_terminal,
        terminalType: target.node_type,
      } as const;
    });

    if ("error" in outcome) return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    return NextResponse.json(outcome);
  } catch (error) {
    console.error("Scenario choice failed", error);
    return NextResponse.json({ error: "Unable to record this scenario choice." }, { status: 500 });
  }
}
