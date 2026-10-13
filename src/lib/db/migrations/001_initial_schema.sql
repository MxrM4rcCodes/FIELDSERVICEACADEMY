-- CGS ORIS FIELD SERVICE ACADEMY
-- PostgreSQL Relational Schema

CREATE TABLE IF NOT EXISTS roles (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL
);

INSERT INTO roles (name, description) VALUES
  ('learner', 'Standard learner account'),
  ('admin', 'Authorized content administrator')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner' REFERENCES roles(name),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_interview_date DATE,
  active_track TEXT NOT NULL DEFAULT 'course_14' CHECK (active_track IN ('bootcamp', 'course_14')),
  notes TEXT,
  experience_level TEXT DEFAULT 'entry_field_service',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_tracks (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  total_days INT NOT NULL,
  estimated_hours NUMERIC(4,1) NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  bootcamp_day_number INT, -- Nullable, set for Bootcamp days (1, 2, 3)
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  estimated_minutes INT NOT NULL DEFAULT 90,
  competency_domain TEXT NOT NULL, -- 'hardware_safety', 'color_oris', 'metis_scanning', 'customer_docs', 'company_interview'
  objectives TEXT[] NOT NULL DEFAULT '{}',
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lesson_content_blocks (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  block_type TEXT NOT NULL DEFAULT 'teaching', -- 'teaching', 'visual_explanation', 'field_example', 'interactive_practice', 'summary_review', 'printable_reference'
  content_markdown TEXT NOT NULL,
  sort_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  time_spent_seconds INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  competency_domain TEXT NOT NULL,
  explanation TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quiz_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  explanation TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 0),
  total_questions INT NOT NULL CHECK (total_questions > 0),
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_option_id TEXT NOT NULL REFERENCES quiz_options(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  UNIQUE (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS troubleshooting_scenarios (
  id TEXT PRIMARY KEY,
  scenario_number INT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'intermediate', -- 'basic', 'intermediate', 'advanced'
  customer_complaint TEXT NOT NULL,
  equipment_context TEXT NOT NULL,
  recent_changes TEXT NOT NULL,
  hidden_root_cause TEXT NOT NULL,
  initial_node_key TEXT NOT NULL DEFAULT 'start',
  verification_criteria TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scenario_nodes (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES troubleshooting_scenarios(id) ON DELETE CASCADE,
  node_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  node_type TEXT NOT NULL DEFAULT 'decision', -- 'initial', 'safety_check', 'test_selection', 'hypothesis_review', 'action_execution', 'verification', 'escalation', 'terminal_success', 'terminal_fail'
  is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
  is_hazardous BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(scenario_id, node_key)
);

CREATE TABLE IF NOT EXISTS scenario_choices (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL REFERENCES scenario_nodes(id) ON DELETE CASCADE,
  choice_key TEXT NOT NULL,
  text TEXT NOT NULL,
  target_node_key TEXT NOT NULL,
  test_revealed_evidence TEXT,
  points_safety INT NOT NULL DEFAULT 0,
  points_diagnostic INT NOT NULL DEFAULT 0,
  points_cost INT NOT NULL DEFAULT 0,
  feedback TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS service_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  equipment_model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  customer_complaint TEXT NOT NULL,
  safety_assessment TEXT NOT NULL,
  configuration_notes TEXT,
  diagnostic_tests_performed TEXT NOT NULL,
  observations TEXT NOT NULL,
  actions_taken TEXT NOT NULL,
  verification_results TEXT NOT NULL,
  customer_communication TEXT NOT NULL,
  escalation_follow_up TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending_parts', 'escalated', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scenario_runs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL REFERENCES troubleshooting_scenarios(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed_success', 'failed_safety', 'failed_wrong_fix', 'abandoned')),
  total_score INT NOT NULL DEFAULT 0,
  safety_score INT NOT NULL DEFAULT 0,
  diagnostic_score INT NOT NULL DEFAULT 0,
  service_ticket_id TEXT REFERENCES service_tickets(id) ON DELETE SET NULL,
  current_node_key TEXT NOT NULL DEFAULT 'start',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scenario_events (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES scenario_runs(id) ON DELETE CASCADE,
  node_key TEXT NOT NULL,
  choice_key TEXT NOT NULL,
  choice_text TEXT NOT NULL,
  feedback TEXT NOT NULL,
  revealed_evidence TEXT,
  points_delta INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flashcards (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL,
  category TEXT NOT NULL, -- 'printer_hardware', 'inkjet_defects', 'color_science', 'scanning', 'rip_networking', 'safety', 'oris_products', 'customer_service'
  pronunciation TEXT,
  definition TEXT NOT NULL,
  field_context TEXT NOT NULL,
  key_takeaway TEXT NOT NULL,
  common_misconception TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS flashcard_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id TEXT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  mastery_level INT NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  review_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, flashcard_id)
);

CREATE TABLE IF NOT EXISTS competency_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL, -- 'hardware_safety', 'color_oris', 'metis_scanning', 'customer_docs', 'company_interview'
  observed_score NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (observed_score BETWEEN 0 AND 100),
  weight_percentage NUMERIC(5,2) NOT NULL CHECK (weight_percentage BETWEEN 0 AND 100),
  total_evaluations INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, domain)
);

CREATE TABLE IF NOT EXISTS user_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reference_type TEXT NOT NULL, -- 'lesson', 'scenario', 'system_node', 'general'
  reference_id TEXT,
  title TEXT NOT NULL,
  note_text TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  category TEXT NOT NULL, -- 'technical', 'behavioral', 'customer', 'field_ops'
  competency_domain TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  model_answer TEXT NOT NULL,
  evaluation_rubric JSONB NOT NULL,
  transferable_skills_tips TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS interview_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  score_technical INT NOT NULL DEFAULT 0,
  score_safety INT NOT NULL DEFAULT 0,
  score_communication INT NOT NULL DEFAULT 0,
  score_verification INT NOT NULL DEFAULT 0,
  score_clarity INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  feedback_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS source_references (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  citation TEXT NOT NULL,
  confidence_level TEXT NOT NULL, -- 'confirmed_spec', 'industry_standard', 'conceptual_model'
  notes TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_revisions (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changed_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  diff_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and user-scoped queries
CREATE INDEX IF NOT EXISTS idx_lessons_day ON lessons(day_number);
CREATE INDEX IF NOT EXISTS idx_blocks_lesson_order ON lesson_content_blocks(lesson_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson_order ON quiz_questions(lesson_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_order ON quiz_options(question_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_scenario_nodes_scenario_key ON scenario_nodes(scenario_id, node_key);
CREATE INDEX IF NOT EXISTS idx_scenario_choices_node_order ON scenario_choices(node_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_scenario_events_run_created ON scenario_events(run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_flashcards_category_order ON flashcards(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_content_revisions_entity ON content_revisions(entity_type, entity_id, created_at);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_runs_user ON scenario_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_mastery_user ON flashcard_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_attempts_user ON interview_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_user ON service_tickets(user_id);
