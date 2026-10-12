import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || "usr_learner_01";

    const res = await query(
      `SELECT s.id, s.scenario_number, s.title, s.slug, s.category, s.difficulty,
              s.customer_complaint, s.equipment_context, s.verification_criteria,
              sr.status as run_status, sr.total_score, sr.safety_score, sr.diagnostic_score, sr.completed_at
       FROM troubleshooting_scenarios s
       LEFT JOIN (
         SELECT DISTINCT ON (scenario_id) scenario_id, status, total_score, safety_score, diagnostic_score, completed_at
         FROM scenario_runs
         WHERE user_id = $1
         ORDER BY scenario_id, total_score DESC, completed_at DESC
       ) sr ON sr.scenario_id = s.id
       ORDER BY s.scenario_number ASC;`,
      [userId]
    );

    return NextResponse.json({ scenarios: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load scenarios" }, { status: 500 });
  }
}
