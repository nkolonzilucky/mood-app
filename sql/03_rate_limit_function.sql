CREATE OR REPLACE FUNCTION enforce_mood_rate_limit()
RETURNS trigger AS $$
DECLARE 
  rl record;
  now_ts timestamptz := now();
BEGIN
  SELECT *
  INTO rl
  FROM mood_rate_limits
  WHERE user_id = NEW.user_id;

-- First mood ever

IF rl IS NULL THEN
  INSERT INTO mood_rate_limits (
    user_id,
    window_start,
    insert_count
  )
  VALUES (
    NEW.user_id,
    now_ts,
    1
  );
  RETURN NEW;
END IF;

-- If user is currently blocked

IF rl.blocked_until IS NOT NULL AND now_ts < rl.blocked_until THEN RAISE EXCEPTION
  'Mood limit reached. Try again in a few minutes';
  -- EXTRACT(MINUTES FROM (now_ts() - rl.blocked_until));
END IF;

-- New window (15 minutes elapsed)
IF now_ts > rl.window_start + '15 minutes'::INTERVAL THEN 
  UPDATE mood_rate_limits
  SET 
    window_start = now_ts,
    insert_count = 1,
    blocked_until = NULL
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END IF;

-- Same window, increment count
IF rl.insert_count < 3 THEN
  UPDATE mood_rate_limits
  SET insert_count = insert_count + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END IF;

-- Limit exceeded -> block user
UPDATE mood_rate_limits
SET blocked_until = rl.window_start + '15 minutes'::INTERVAL
WHERE user_id = NEW.user_id;

RAISE EXCEPTION
  'Mood limit reached. Try again in a few minutes';
  -- EXTRACT(MINUTES FROM (now_ts - (rl.window_start + '15 minutes'::INTERVAL)));
END;
$$ LANGUAGE plpgsql;