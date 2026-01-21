CREATE TRIGGER mood_rate_limit_trigger
BEFORE INSERT ON moods
FOR EACH ROW
EXECUTE FUNCTION enforce_mood_rate_limit();