import { query } from "@/lib/db";

export const COMPETENCY_WEIGHTS = {
  hardware_safety: 35,
  color_oris: 25,
  metis_scanning: 15,
  customer_docs: 15,
  company_interview: 10,
} as const;

export type CompetencyDomain = keyof typeof COMPETENCY_WEIGHTS;

export async function seedCompetencyRows(
  tx: { query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[] }> },
  userId: string,
) {
  for (const [domain, weight] of Object.entries(COMPETENCY_WEIGHTS)) {
    await tx.query(
      `INSERT INTO competency_scores
        (id, user_id, domain, observed_score, weight_percentage, total_evaluations)
       VALUES ($1, $2, $3, 0, $4, 0)
       ON CONFLICT (user_id, domain) DO NOTHING`,
      [`comp_${userId}_${domain}`, userId, domain, weight],
    );
  }
}

/**
 * Recompute average saved practice-assessment scores for a domain. This is a
 * coaching signal only; it is not a validated measure of field competence.
 */
export async function recalculateCompetency(userId: string, domain: CompetencyDomain): Promise<void> {
  const assessments = await query<{ score: string | number }>(
    `SELECT 100.0 * qa.score / NULLIF(qa.total_questions, 0) AS score
       FROM quiz_attempts qa
       JOIN lessons l ON l.id = qa.lesson_id
      WHERE qa.user_id = $1 AND l.competency_domain = $2
     UNION ALL
     SELECT ia.total_score::numeric AS score
       FROM interview_attempts ia
       JOIN interview_questions iq ON iq.id = ia.question_id
      WHERE ia.user_id = $1 AND iq.competency_domain = $2`,
    [userId, domain],
  );

  const values = assessments.rows.map((row) => Number(row.score)).filter(Number.isFinite);
  if (values.length === 0) return;

  const average = values.reduce((sum, score) => sum + score, 0) / values.length;
  await query(
    `UPDATE competency_scores
        SET observed_score = $1, total_evaluations = $2, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3 AND domain = $4`,
    [Math.round(average * 100) / 100, values.length, userId, domain],
  );
}
