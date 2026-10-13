-- Upgrade older installations, retire bundled demo accounts, and serialize
-- active scenario runs. Safe to apply once through schema_migrations.

CREATE TABLE IF NOT EXISTS roles (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL
);
INSERT INTO roles (name, description) VALUES
  ('learner', 'Standard learner account'),
  ('admin', 'Authorized content administrator')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));

-- These accounts and all their dependent progress/tickets/notes were bundled
-- demo fixtures with public, hard-coded passwords. Remove them completely.
DELETE FROM users
 WHERE id IN ('usr_admin_01', 'usr_learner_01')
    OR LOWER(email) IN ('admin@cgs-oris.academy', 'technician@cgs-oris.academy');

ALTER TABLE service_tickets ALTER COLUMN status SET DEFAULT 'open';
ALTER TABLE service_tickets DROP CONSTRAINT IF EXISTS service_tickets_status_check;
ALTER TABLE service_tickets ADD CONSTRAINT service_tickets_status_check
  CHECK (status IN ('open', 'pending_parts', 'escalated', 'completed'));

ALTER TABLE scenario_runs DROP CONSTRAINT IF EXISTS scenario_runs_status_check;
ALTER TABLE scenario_runs ADD CONSTRAINT scenario_runs_status_check
  CHECK (status IN ('in_progress', 'completed_success', 'failed_safety', 'failed_wrong_fix', 'abandoned'));

-- Keep the newest active run if a previous deployment created more than one.
WITH ranked_active_runs AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY user_id, scenario_id ORDER BY created_at DESC, id DESC
  ) AS run_rank
  FROM scenario_runs
  WHERE status = 'in_progress'
)
UPDATE scenario_runs
   SET status = 'abandoned', completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)
 WHERE id IN (SELECT id FROM ranked_active_runs WHERE run_rank > 1);

CREATE UNIQUE INDEX IF NOT EXISTS idx_scenario_runs_one_active_per_user
  ON scenario_runs (user_id, scenario_id) WHERE status = 'in_progress';
CREATE UNIQUE INDEX IF NOT EXISTS idx_scenario_choices_node_key
  ON scenario_choices (node_id, choice_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_answers_attempt_question
  ON quiz_answers (attempt_id, question_id);
