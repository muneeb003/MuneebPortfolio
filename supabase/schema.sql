-- ============================================================
-- Portfolio Website — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- SINGLETON TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS site_meta (
  id          SMALLINT PRIMARY KEY DEFAULT 1,
  site_title  TEXT NOT NULL DEFAULT 'Muneeb — Developer',
  hero_headline    TEXT NOT NULL DEFAULT 'Hey, I''m Muneeb.',
  hero_subheadline TEXT NOT NULL DEFAULT 'I build things for the web.',
  hero_cta_label   TEXT NOT NULL DEFAULT 'View My Work',
  hero_cta_url     TEXT NOT NULL DEFAULT '#projects',
  og_image_url     TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_meta_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS about (
  id              SMALLINT PRIMARY KEY DEFAULT 1,
  bio_short       TEXT NOT NULL DEFAULT '',
  bio_long        TEXT NOT NULL DEFAULT '',
  avatar_url      TEXT,
  resume_url      TEXT,
  github_url      TEXT,
  linkedin_url    TEXT,
  twitter_url     TEXT,
  email           TEXT,
  location_label  TEXT,
  location_lat    FLOAT8,
  location_lng    FLOAT8,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT about_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS mood (
  id          SMALLINT PRIMARY KEY DEFAULT 1,
  text        TEXT NOT NULL DEFAULT '',
  link_url    TEXT,
  is_visible  BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT mood_singleton CHECK (id = 1)
);


-- ============================================================
-- EXPERIENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS experience (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE,
  description TEXT NOT NULL DEFAULT '',
  company_url TEXT,
  logo_url    TEXT,
  "order"     SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SKILLS
-- ============================================================

CREATE TABLE IF NOT EXISTS skill_categories (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT NOT NULL,
  "order" SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon_slug   TEXT,
  proficiency SMALLINT NOT NULL DEFAULT 3 CHECK (proficiency BETWEEN 1 AND 5),
  "order"     SMALLINT NOT NULL DEFAULT 0,
  color       TEXT
);


-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  description_short  TEXT NOT NULL DEFAULT '',
  description_long   TEXT NOT NULL DEFAULT '',
  cover_image_url    TEXT,
  demo_url           TEXT,
  github_url         TEXT,
  tech_stack         TEXT[] NOT NULL DEFAULT '{}',
  status             TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured           BOOLEAN NOT NULL DEFAULT FALSE,
  "order"            SMALLINT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- CURRENTLY CARDS
-- ============================================================

CREATE TABLE IF NOT EXISTS currently (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_type   TEXT NOT NULL UNIQUE CHECK (card_type IN ('reading', 'building', 'listening', 'obsessed')),
  label       TEXT NOT NULL DEFAULT '',
  sublabel    TEXT,
  link_url    TEXT,
  emoji       TEXT NOT NULL DEFAULT '✨',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- THINGS I LOVE (ticker items)
-- ============================================================

CREATE TABLE IF NOT EXISTS things_i_love (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label   TEXT NOT NULL,
  emoji   TEXT NOT NULL,
  "order" SMALLINT NOT NULL DEFAULT 0
);


-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  subject   TEXT NOT NULL,
  message   TEXT NOT NULL,
  is_read   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- GUESTBOOK
-- ============================================================

CREATE TABLE IF NOT EXISTS guestbook (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  message     TEXT NOT NULL CHECK (char_length(message) <= 280),
  avatar_seed TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- ADMIN USERS (NextAuth credentials)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE site_meta           ENABLE ROW LEVEL SECURITY;
ALTER TABLE about               ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood                ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills              ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE currently           ENABLE ROW LEVEL SECURITY;
ALTER TABLE things_i_love       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook           ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;

-- Public read access for non-sensitive tables
CREATE POLICY "Public read" ON site_meta        FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON about            FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON mood             FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON experience       FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON skill_categories FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON skills           FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON projects         FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Public read" ON currently        FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read" ON things_i_love    FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read approved" ON guestbook FOR SELECT TO anon USING (status = 'approved');

-- Public insert for contact & guestbook
CREATE POLICY "Public insert" ON contact_submissions FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Public insert" ON guestbook           FOR INSERT TO anon WITH CHECK (status = 'pending');

-- No anon access to admin_users
-- (service_role bypasses RLS for all write operations)


-- ============================================================
-- SEED DATA — singleton rows
-- ============================================================

INSERT INTO site_meta (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO about     (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO mood      (id) VALUES (1) ON CONFLICT DO NOTHING;

INSERT INTO currently (card_type, emoji) VALUES
  ('reading',   '📖'),
  ('building',  '🛠️'),
  ('listening', '🎧'),
  ('obsessed',  '✨')
ON CONFLICT DO NOTHING;

-- Seed some default things_i_love items
INSERT INTO things_i_love (label, emoji, "order") VALUES
  ('Clean Code',            '✨', 1),
  ('Dark Mode',             '🌙', 2),
  ('Mechanical Keyboards',  '⌨️', 3),
  ('Coffee',                '☕', 4),
  ('Open Source',           '🐙', 5),
  ('TypeScript',            '💙', 6),
  ('Good Design',           '🎨', 7),
  ('Fast APIs',             '⚡', 8),
  ('Late Night Coding',     '🌃', 9),
  ('Learning New Things',   '📚', 10)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SEED ADMIN USER
-- Replace the password_hash below with a real bcrypt hash.
-- Generate with: node -e "const b=require('bcryptjs');console.log(b.hashSync('yourpassword',10))"
-- ============================================================

-- INSERT INTO admin_users (username, password_hash)
-- VALUES ('admin', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH');
