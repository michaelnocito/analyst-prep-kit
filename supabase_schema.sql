-- ============================================================================
-- ANALYST PREP KIT - SUPABASE SCHEMA FOR CROSS-DEVICE PROGRESS SYNC
-- ============================================================================

-- Create user_progress table for storing lesson/drill completion state
CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kit_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  drill_id TEXT,
  state JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kit_id, lesson_id, drill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_kit_id ON user_progress(kit_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_updated ON user_progress(last_updated);

-- Create user_entitlements table for paid features (Interview Prep Pass)
CREATE TABLE IF NOT EXISTS user_entitlements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  has_interview_pass BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id ON user_entitlements(user_id);

-- Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- user_progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON user_progress;

CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON user_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_entitlements policies
DROP POLICY IF EXISTS "Users can view their own entitlements" ON user_entitlements;
DROP POLICY IF EXISTS "Users can insert their own entitlements" ON user_entitlements;
DROP POLICY IF EXISTS "Users can update their own entitlements" ON user_entitlements;

CREATE POLICY "Users can view their own entitlements" ON user_entitlements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entitlements" ON user_entitlements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entitlements" ON user_entitlements
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- AUTO-CREATED TRIGGERS
-- ============================================================================

-- Update user_entitlements.updated_at on changes
CREATE OR REPLACE FUNCTION update_entitlements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_entitlements_updated_at ON user_entitlements;
CREATE TRIGGER trigger_update_entitlements_updated_at
BEFORE UPDATE ON user_entitlements
FOR EACH ROW
EXECUTE FUNCTION update_entitlements_updated_at();

-- Update user_profiles.updated_at on changes
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Auto-create user_profiles entry when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (email) DO NOTHING;

  INSERT INTO user_entitlements (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_on_auth_user_created ON auth.users;
CREATE TRIGGER trigger_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
