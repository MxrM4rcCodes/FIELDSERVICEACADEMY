CREATE TABLE IF NOT EXISTS practice_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_slug TEXT NOT NULL,
  prompt_index INT NOT NULL CHECK (prompt_index BETWEEN 0 AND 4),
  choice_key TEXT NOT NULL CHECK (choice_key IN ('verify', 'guess', 'assume')),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_activity
  ON practice_attempts (user_id, activity_slug, created_at DESC);
