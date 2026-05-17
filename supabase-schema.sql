-- ============================================
-- ELECTION MANAGEMENT SYSTEM SCHEMA
-- ============================================

-- Enable RLS on all tables
ALTER DATABASE "postgres" SET "app.settings.jwt_secret" = '';

-- 1. PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'voter' CHECK (role IN ('voter', 'creator', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. ELECTION REQUESTS TABLE
CREATE TABLE election_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  organization TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE election_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON election_requests
  FOR SELECT USING (auth.uid() = creator_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. ELECTIONS TABLE
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_voters INTEGER DEFAULT 1000,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE elections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active elections" ON elections
  FOR SELECT USING (status = 'active' OR status = 'completed' OR auth.uid() = creator_id);

CREATE POLICY "Creators can manage their elections" ON elections
  FOR ALL USING (auth.uid() = creator_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 4. CANDIDATES TABLE
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  designation TEXT,
  manifesto TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view candidates" ON candidates
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage candidates" ON candidates
  FOR ALL USING (
    auth.uid() = (SELECT creator_id FROM elections WHERE id = candidates.election_id)
  );

-- 5. VOTER REGISTRATIONS TABLE
CREATE TABLE voter_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(election_id, voter_id)
);

ALTER TABLE voter_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their registrations" ON voter_registrations
  FOR SELECT USING (auth.uid() = voter_id OR auth.uid() = (
    SELECT creator_id FROM elections WHERE id = voter_registrations.election_id
  ));

-- 6. SECRET IDS TABLE
CREATE TABLE secret_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  secret_code TEXT UNIQUE NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(election_id, voter_id)
);

ALTER TABLE secret_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their secret IDs" ON secret_ids
  FOR SELECT USING (auth.uid() = voter_id);

-- 7. VOTES TABLE
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators and admins can view votes" ON votes
  FOR SELECT USING (
    auth.uid() = (SELECT creator_id FROM elections WHERE id = votes.election_id) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_elections_creator_id ON elections(creator_id);
CREATE INDEX idx_elections_status ON elections(status);
CREATE INDEX idx_candidates_election_id ON candidates(election_id);
CREATE INDEX idx_voter_registrations_election_id ON voter_registrations(election_id);
CREATE INDEX idx_voter_registrations_voter_id ON voter_registrations(voter_id);
CREATE INDEX idx_secret_ids_election_id ON secret_ids(election_id);
CREATE INDEX idx_secret_ids_voter_id ON secret_ids(voter_id);
CREATE INDEX idx_votes_election_id ON votes(election_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for candidate photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidates', 'candidates', true)
ON CONFLICT (id) DO NOTHING;

-- Set storage policies
CREATE POLICY "Candidates bucket is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'candidates');

CREATE POLICY "Creators can upload candidate photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'candidates' AND
    auth.uid() IS NOT NULL
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elections_updated_at
  BEFORE UPDATE ON elections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update election status
CREATE OR REPLACE FUNCTION update_election_status()
RETURNS VOID AS $$
BEGIN
  -- Update active elections
  UPDATE elections
  SET status = 'active'
  WHERE status = 'scheduled' 
    AND start_time <= CURRENT_TIMESTAMP 
    AND end_time > CURRENT_TIMESTAMP;

  -- Update completed elections
  UPDATE elections
  SET status = 'completed'
  WHERE status IN ('active', 'scheduled')
    AND end_time <= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call this function
-- You might want to set this up as a scheduled job in Supabase
