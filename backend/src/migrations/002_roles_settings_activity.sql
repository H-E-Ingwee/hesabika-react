-- ============================================================
-- HESABIKA TRUST — Migration 002
-- Roles, Site Settings, Testimonials, Activity Log, Media
-- Self-contained — creates profiles if not exists
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (safe to run again)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ROLES ENUM ───────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── PROFILES TABLE (create or update) ────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'viewer',
  avatar_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  department TEXT DEFAULT '',
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  invited_by UUID,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if they don't exist (safe ALTER)
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ── SITE SETTINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'general',
  label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO site_settings (key, value, category, label) VALUES
  ('site_name', 'Hesabika Trust', 'general', 'Site Name'),
  ('tagline', 'Translating Concern into Action', 'general', 'Tagline'),
  ('description', 'HESABIKA is a catalyst for a value-driven socio-economic transformation of Kenya.', 'general', 'Description'),
  ('phone', '+254 718 899 103', 'contact', 'Phone Number'),
  ('email', 'info@hesabika.com', 'contact', 'Email Address'),
  ('address', 'FOCUS Center, Kasarani, Nairobi', 'contact', 'Address'),
  ('mpesa_paybill', '769936', 'giving', 'MPESA Paybill'),
  ('mpesa_account', 'GIPro', 'giving', 'MPESA Account'),
  ('bank_name', 'Bank of Africa, Kenya', 'giving', 'Bank Name'),
  ('bank_account', '08250710005', 'giving', 'Bank Account Number'),
  ('bank_swift', 'AFRIKENX', 'giving', 'SWIFT Code'),
  ('facebook_url', 'https://facebook.com/HesabikaTrust', 'social', 'Facebook URL'),
  ('twitter_url', 'https://twitter.com/HesabikaTrust', 'social', 'Twitter URL'),
  ('instagram_url', 'https://instagram.com/HesabikaTrust', 'social', 'Instagram URL'),
  ('youtube_url', 'https://youtube.com/@HesabikaTrust', 'social', 'YouTube URL'),
  ('linkedin_url', 'https://linkedin.com/company/hesabika', 'social', 'LinkedIn URL'),
  ('elpro_fellows_count', '23', 'programmes', 'ELPro Fellows Count'),
  ('gipro_alumni_count', '50', 'programmes', 'GIPro Alumni Count'),
  ('caucuses_count', '5', 'programmes', 'Caucuses Count'),
  ('maintenance_mode', 'false', 'system', 'Maintenance Mode'),
  ('announcement_text', 'ELPro Inaugural Cohort — Launched April 11, 2026 · 23 Fellows Enrolled', 'general', 'Announcement Banner Text'),
  ('announcement_active', 'true', 'general', 'Show Announcement Banner')
ON CONFLICT (key) DO NOTHING;

-- ── TESTIMONIALS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT DEFAULT '/images/board-Hesabika-Noimg.jpg',
  programme TEXT DEFAULT 'GIPro',
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO testimonials (quote, name, role, image_url, programme, order_index) VALUES
  ('This program came at an opportune time in my life. I was just about to graduate from campus when that beautiful email of successful selection hit my phone. Campus transitions are not the easiest — GIPro gave me direction.', 'Sophia Nthuku', 'GIPro 2021 Cohort', '/images/intern-Sophia-Nthuku.jpg', 'GIPro', 1),
  ('After four years in campus, Hesabika was just what I needed towards career alignment. Bringing in my inclination as a leader and aligning it to my career was, for me, a game changer.', 'Charles Etole', 'GIPro 2021 Cohort', '/images/intern-Charles-Etole.jpg', 'GIPro', 2),
  ('I had always yearned for a space that would give me a chance to identify with leadership and governance aspects geared towards upholding right values. GIPro came in handy!', 'Adonijah Oginga', 'GIPro 2022 Cohort', '/images/intern-Adonijah-Oginga.jpg', 'GIPro', 3),
  ('Politics are so dirty that the only people who can survive are Christians. Where it is dark, that is where Christians are required to shine the light, because we are in a redemptive mission!', 'Dr. David Oginde', 'ELPro Launch Speaker, April 11, 2026', '/images/board-Hesabika-Noimg.jpg', 'ELPro', 4),
  ('It is a journey with few who''ve resolved to Translate Concern to Action, yet it is fruitful and full of great gains.', 'Wabere Mwangi', 'Outgoing STEM Staff, Hesabika', '/images/board-Hesabika-Noimg.jpg', 'General', 5)
ON CONFLICT DO NOTHING;

-- ── ACTIVITY LOG ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  user_email TEXT DEFAULT '',
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  resource_label TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── MEDIA LIBRARY ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  cloudinary_id TEXT DEFAULT '',
  file_type TEXT DEFAULT 'image',
  file_size INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  alt_text TEXT DEFAULT '',
  folder TEXT DEFAULT 'general',
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ANNOUNCEMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  link_text TEXT DEFAULT '',
  link_url TEXT DEFAULT '',
  type TEXT DEFAULT 'info',
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO announcements (text, link_text, link_url, type, active) VALUES
  ('ELPro Inaugural Cohort — Launched April 11, 2026 · 23 Fellows Enrolled', 'Learn More', '/elpro', 'success', true)
ON CONFLICT DO NOTHING;

-- ── CAUCUS GROUPS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS caucus_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'landmark',
  title TEXT NOT NULL,
  convenor TEXT NOT NULL,
  color TEXT DEFAULT 'green',
  description TEXT NOT NULL DEFAULT '',
  focus_areas TEXT[] DEFAULT '{}',
  recent_work TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO caucus_groups (slug, icon, title, convenor, color, description, focus_areas, recent_work, order_index) VALUES
  ('governance', 'landmark', 'Governance & Civic Education', 'Paul Mungai', 'green', 'The most active caucus, focused on good governance, civic education, and Christian engagement in politics.', ARRAY['Good governance and accountability', 'Civic education curriculum development', '2027 General Elections engagement', 'Katiba Movement partnership'], 'Developing civic education and electoral engagement framework ahead of the 2027 General Elections.', 1),
  ('economy', 'banknote', 'Economy', 'Dr. Rugo', 'red', 'An analytically rigorous caucus engaging Kenya''s most pressing economic challenges from a biblical standpoint.', ARRAY['Youth unemployment (39.8% of Kenyan youth)', 'SOE corruption and mismanagement', 'Finance Bill 2026–2027 analysis'], 'Analysis and advocacy on the Finance Bill 2026–2027 and SOE governance reforms.', 2),
  ('education', 'book', 'Education', 'Dr. Lynette Kisaka', 'green', 'A growing caucus engaging Kenya''s education sector transformation, with focus on the CBC transition.', ARRAY['Competency Based Curriculum (CBC) implementation', 'Education financing and funding gaps', 'Out-of-school children'], 'CBC webinar and education advocacy engagement with the Ministry of Education.', 3),
  ('theology', 'cross', 'Public Theology', 'Mr. Frederick Abuya', 'red', 'The theological foundation of all Hesabika''s work. Ensures every area of advocacy is grounded in a robust biblical worldview.', ARRAY['Biblical worldview and public engagement', 'Monthly public theology webinars', 'Ezra Conference integration'], 'Monthly webinar series on public theology and Christian engagement in Kenya''s public life.', 4),
  ('health', 'building2', 'Health', 'Racheal Kitonyo & Prof. Ojuka', 'green', 'Engaging Kenya''s health policy landscape with significant advocacy output.', ARRAY['Tobacco regulation and the Tobacco Amendment Bill', 'Mental health — stigma and services', 'Universal Health Coverage'], 'Submission of memorandum on the Tobacco Amendment Bill to Parliament.', 5)
ON CONFLICT (slug) DO NOTHING;

-- ── ELPRO FELLOWS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS elpro_fellows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cohort TEXT NOT NULL DEFAULT '2026',
  placement TEXT DEFAULT 'Government Institution',
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '/images/board-Hesabika-Noimg.jpg',
  linkedin_url TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INITIATIVES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL DEFAULT '01',
  tag TEXT NOT NULL DEFAULT 'General',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '/images/initiative-1.jpg',
  color TEXT DEFAULT 'green',
  link TEXT DEFAULT '/initiatives',
  external BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE caucus_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE elpro_fellows ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users see own profile" ON profiles;
DROP POLICY IF EXISTS "Auth update own profile" ON profiles;
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Auth manage site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Auth manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Auth manage activity_log" ON activity_log;
DROP POLICY IF EXISTS "Public read media_library" ON media_library;
DROP POLICY IF EXISTS "Auth manage media_library" ON media_library;
DROP POLICY IF EXISTS "Public read announcements" ON announcements;
DROP POLICY IF EXISTS "Auth manage announcements" ON announcements;
DROP POLICY IF EXISTS "Public read caucus_groups" ON caucus_groups;
DROP POLICY IF EXISTS "Auth manage caucus_groups" ON caucus_groups;
DROP POLICY IF EXISTS "Public read elpro_fellows" ON elpro_fellows;
DROP POLICY IF EXISTS "Auth manage elpro_fellows" ON elpro_fellows;
DROP POLICY IF EXISTS "Public read initiatives" ON initiatives;
DROP POLICY IF EXISTS "Auth manage initiatives" ON initiatives;

-- Profiles
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Auth update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Auth insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public read
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (active = true);
CREATE POLICY "Public read caucus_groups" ON caucus_groups FOR SELECT USING (active = true);
CREATE POLICY "Public read elpro_fellows" ON elpro_fellows FOR SELECT USING (active = true);
CREATE POLICY "Public read initiatives" ON initiatives FOR SELECT USING (active = true);
CREATE POLICY "Public read media_library" ON media_library FOR SELECT USING (true);

-- Authenticated manage
CREATE POLICY "Auth manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage activity_log" ON activity_log FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage media_library" ON media_library FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage caucus_groups" ON caucus_groups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage elpro_fellows" ON elpro_fellows FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage initiatives" ON initiatives FOR ALL USING (auth.role() = 'authenticated');

-- ── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── SET FIRST USER AS SUPERADMIN ─────────────────────────────
-- Run this manually after creating your first admin user:
-- UPDATE profiles SET role = 'superadmin', full_name = 'Your Name' WHERE email = 'your@email.com';

-- ── HELPER: Get user role ────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = p_user_id;
  RETURN COALESCE(v_role, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;