ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own moods"
ON moods
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own moods"
ON moods
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own moods"
ON moods
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own moods"
ON moods
FOR DELETE
USING (user_id = auth.uid());


ALTER TABLE mood_rate_limits ENABLE ROW LEVEL SECURITY;

alter policy "allow all for all authenticated users"
on "mood_rate_limits"
to authenticated
using (
   (user_id = auth.uid())
) with check (
  true
);