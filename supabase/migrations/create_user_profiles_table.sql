-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_id ON user_profiles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON user_profiles(subscription_status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, subscription_status)
  VALUES (new.id, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
