-- Create letter_history table for storing generated letters
CREATE TABLE IF NOT EXISTS letter_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  school_name TEXT NOT NULL,
  program TEXT NOT NULL,
  letter_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_letter_history_user_id ON letter_history(user_id);
CREATE INDEX IF NOT EXISTS idx_letter_history_created_at ON letter_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE letter_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own letter history"
  ON letter_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own letters"
  ON letter_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own letters"
  ON letter_history FOR DELETE
  USING (auth.uid() = user_id);
