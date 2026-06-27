# Supabase Setup Guide - Analyst Prep Kit

## Quick Start (5 minutes)

### 1. Supabase Project Already Created ✓
- **Project name:** analyst-prep-kit
- **Organization:** michaelnocito's Org (FREE)
- **Database:** East US (North Virginia)
- **API Key needed from:** Settings → API

### 2. Create the Database Schema

Go to **SQL Editor** in your Supabase dashboard and run this SQL (paste the entire block and click Run):

```sql
-- Create user_progress table
CREATE TABLE user_progress (
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

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Create user_entitlements table
CREATE TABLE user_entitlements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  has_interview_pass BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entitlements" ON user_entitlements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entitlements" ON user_entitlements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Configure Authentication

Go to **Authentication** in Supabase dashboard:

1. **Providers tab:**
   - Enable "Email" (already enabled)
   - Enable "Google" 
     - Client ID: (get from Google Cloud)
     - Client Secret: (get from Google Cloud)

2. **Email/Password settings:**
   - Auto Confirm: OFF (users must verify email)
   - Confirm Email Change: ON

3. **URL Configuration:**
   - Site URL: `https://michaelnocito.github.io/analyst-prep-kit/`
   - Redirect URLs:
     ```
     https://michaelnocito.github.io/analyst-prep-kit/
     https://michaelnocito.github.io/analyst-prep-kit/index.html
     ```

### 4. Get Your API Credentials

Go to **Settings → API** and copy:
- **Project URL:** `https://liiivtbyyawueboeavmw.supabase.co` (or your project's URL)
- **Anon Key:** (copy this, you'll need it for the kits)

### 5. Database Password

Password you created: `SupabaseAPKv1!Password2026` (save this securely)

---

## Next Steps

Once the schema is created and Auth is configured, the code in `supabase_auth_sync.js` will:
1. Handle login/signup in the hub
2. Automatically sync progress across devices
3. Gate the Interview Pass behind backend verification

See `SUPABASE_INTEGRATION.md` for code integration steps.
