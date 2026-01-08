-- Create recommendations_log table
CREATE TABLE IF NOT EXISTS recommendations_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_log_user_id ON recommendations_log(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_log_created_at ON recommendations_log(created_at DESC);

-- Enable RLS
ALTER TABLE recommendations_log ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own recommendation logs"
  ON recommendations_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own recommendation logs"
  ON recommendations_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);
