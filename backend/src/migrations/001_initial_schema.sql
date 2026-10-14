-- ============================================================
-- HESABIKA TRUST — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES (Auth users) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BLOG POSTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Hesabika Team',
  category TEXT NOT NULL DEFAULT 'General',
  image_url TEXT DEFAULT '/images/blog-1.jpg',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  read_time INTEGER DEFAULT 3,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── GIPRO INTERNS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gipro_interns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cohort TEXT NOT NULL,
  placement TEXT DEFAULT 'Government Institution',
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '/images/board-Hesabika-Noimg.jpg',
  linkedin_url TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── GIPRO MENTORS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gipro_mentors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  organization TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '/images/board-Hesabika-Noimg.jpg',
  linkedin_url TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BOARD MEMBERS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS board_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Trustee',
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '/images/board-Hesabika-Noimg.jpg',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONTACT MESSAGES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── NEWSLETTER SUBSCRIBERS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INTERN APPLICATIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS intern_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  university TEXT DEFAULT '',
  course TEXT DEFAULT '',
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── MENTOR APPLICATIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentor_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  profession TEXT DEFAULT '',
  organization TEXT DEFAULT '',
  years_experience TEXT DEFAULT '5-10',
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── EVENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT DEFAULT 'Nairobi, Kenya',
  image_url TEXT DEFAULT '/images/hero-1.jpg',
  registration_url TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DONATIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'KES',
  frequency TEXT DEFAULT 'one-time',
  payment_method TEXT DEFAULT 'mpesa',
  status TEXT DEFAULT 'pending',
  reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DOWNLOADS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'PDF',
  file_size TEXT DEFAULT '',
  download_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gipro_interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE gipro_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE intern_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- ── PUBLIC READ POLICIES ───────────────────────────────────
-- Blog posts: public can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Interns: public can read
CREATE POLICY "Public can read interns"
  ON gipro_interns FOR SELECT
  USING (true);

-- Mentors: public can read
CREATE POLICY "Public can read mentors"
  ON gipro_mentors FOR SELECT
  USING (true);

-- Board: public can read
CREATE POLICY "Public can read board members"
  ON board_members FOR SELECT
  USING (true);

-- Events: public can read active events
CREATE POLICY "Public can read active events"
  ON events FOR SELECT
  USING (active = true);

-- Downloads: public can read active downloads
CREATE POLICY "Public can read downloads"
  ON downloads FOR SELECT
  USING (active = true);

-- ── PUBLIC INSERT POLICIES ─────────────────────────────────
-- Contact messages: anyone can submit
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Newsletter: anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Intern applications: anyone can apply
CREATE POLICY "Anyone can submit intern applications"
  ON intern_applications FOR INSERT
  WITH CHECK (true);

-- Mentor applications: anyone can apply
CREATE POLICY "Anyone can submit mentor applications"
  ON mentor_applications FOR INSERT
  WITH CHECK (true);

-- Donations: anyone can submit
CREATE POLICY "Anyone can submit donations"
  ON donations FOR INSERT
  WITH CHECK (true);

-- ── AUTHENTICATED USER POLICIES ────────────────────────────
-- Profiles: users can read/update their own
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin: authenticated users can manage all content
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage interns"
  ON gipro_interns FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage mentors"
  ON gipro_mentors FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage board"
  ON board_members FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update messages"
  ON contact_messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read applications"
  ON intern_applications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update intern applications"
  ON intern_applications FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read mentor applications"
  ON mentor_applications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update mentor applications"
  ON mentor_applications FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage downloads"
  ON downloads FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED DATA — Board Members
-- ============================================================
INSERT INTO board_members (name, role, bio, image_url, order_index) VALUES
  ('Rachel Kitonyo Devotsu', 'Chairperson, Board of Trustees', 'Providing strategic leadership and oversight for Hesabika Trust''s mission to transform Kenya through values-driven governance.', '/images/board-rachel-kitonyo.jpg', 1),
  ('Pastor Simon Kande', 'Trustee', 'Bringing pastoral wisdom and church leadership experience to Hesabika''s mission of mobilizing the church for Kenya''s transformation.', '/images/board-pastor-kande.jpg', 2),
  ('Dr. Nelson Gitonga', 'Trustee', 'Contributing academic and professional expertise to Hesabika''s governance and strategic direction.', '/images/board-Dr-Nelson-Gitonga.jpg', 3),
  ('Dr. Lukas Owako', 'Trustee', 'Providing professional and academic leadership to advance Hesabika''s mission of values-driven transformation.', '/images/board-Dr.-Lukas-Owako.jpg', 4),
  ('Prof. Daniel Ojuka', 'Trustee', 'Bringing academic excellence and research expertise to strengthen Hesabika''s governance and programme development.', '/images/board-Prof-Daniel-Ojuka.jpg', 5),
  ('Purity Rachael Wambui', 'Trustee', 'Contributing professional expertise and a passion for Kenya''s transformation to Hesabika''s board governance.', '/images/board-Purity-Rachael-Wambui.jpg', 6),
  ('Edward Buri', 'Trustee', 'Providing strategic oversight and professional leadership to advance Hesabika''s mission across Kenya.', '/images/board-edward-buri.jpg', 7),
  ('Esther Chengo', 'Trustee', 'Contributing professional expertise and a commitment to integrity to Hesabika''s board of trustees.', '/images/board-esther-chengo.jpg', 8),
  ('Joseph Ngetich', 'Trustee', 'Bringing professional experience and a passion for Kenya''s governance transformation to Hesabika''s board.', '/images/board-joseph-ngetich.jpg', 9)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS (run separately in Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hesabika-media', 'hesabika-media', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hesabika-docs', 'hesabika-docs', true);