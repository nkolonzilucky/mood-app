CREATE TABLE moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  level integer NOT NULL CHECK (level BETWEEN 0 AND 5),
  text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE TABLE mood_rate_limits (
  user_id uuid PRIMARY KEY,
  window_start timestamptz NOT NULL,
  insert_count integer NOT NULL,
  blocked_until timestamptz
);

