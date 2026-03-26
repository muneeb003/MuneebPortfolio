-- ============================================================
-- Portfolio Website — Content Seed
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ============================================================


-- ============================================================
-- ADMIN USER
-- Password: admin123
-- ============================================================

INSERT INTO admin_users (username, password_hash)
VALUES ('muneeb', '$2b$12$3pHRCS1tkHTu0eFAJEw38.occefgevYqQ7853CD0PfxQ61pLfa3/K')
ON CONFLICT (username) DO NOTHING;


-- ============================================================
-- SITE META
-- ============================================================

INSERT INTO site_meta (id, site_title, hero_headline, hero_subheadline, hero_cta_label, hero_cta_url)
VALUES (
  1,
  'Muneeb — Full Stack Developer',
  'Hey, I''m Muneeb.',
  'I build fast, beautiful, and thoughtful web experiences.',
  'See My Work',
  '#projects'
)
ON CONFLICT (id) DO UPDATE SET
  site_title       = EXCLUDED.site_title,
  hero_headline    = EXCLUDED.hero_headline,
  hero_subheadline = EXCLUDED.hero_subheadline,
  hero_cta_label   = EXCLUDED.hero_cta_label,
  hero_cta_url     = EXCLUDED.hero_cta_url,
  updated_at       = NOW();


-- ============================================================
-- ABOUT
-- ============================================================

INSERT INTO about (
  id, bio_short, bio_long,
  github_url, linkedin_url, twitter_url, email,
  location_label, location_lat, location_lng
)
VALUES (
  1,
  'Full stack developer who loves turning ideas into polished products.',
  E'I''m a full stack developer based in Karachi, Pakistan — passionate about building products that are as thoughtful under the hood as they are on the surface.\n\nI specialize in **Next.js**, **TypeScript**, and **Supabase**, with a habit of obsessing over performance, accessibility, and developer experience in equal measure.\n\nWhen I''m not writing code, I''m probably reading about systems design, listening to lo-fi, or hunting for the perfect mechanical keyboard switch.',
  'https://github.com/muneeb',
  'https://linkedin.com/in/muneeb',
  'https://twitter.com/muneeb',
  'hello@muneeb.dev',
  'Karachi, Pakistan',
  24.8607,
  67.0011
)
ON CONFLICT (id) DO UPDATE SET
  bio_short      = EXCLUDED.bio_short,
  bio_long       = EXCLUDED.bio_long,
  github_url     = EXCLUDED.github_url,
  linkedin_url   = EXCLUDED.linkedin_url,
  twitter_url    = EXCLUDED.twitter_url,
  email          = EXCLUDED.email,
  location_label = EXCLUDED.location_label,
  location_lat   = EXCLUDED.location_lat,
  location_lng   = EXCLUDED.location_lng,
  updated_at     = NOW();


-- ============================================================
-- MOOD BAR
-- ============================================================

INSERT INTO mood (id, text, link_url, is_visible)
VALUES (1, 'Open to new opportunities', 'mailto:hello@muneeb.dev', TRUE)
ON CONFLICT (id) DO UPDATE SET
  text       = EXCLUDED.text,
  link_url   = EXCLUDED.link_url,
  is_visible = EXCLUDED.is_visible,
  updated_at = NOW();


-- ============================================================
-- EXPERIENCE
-- ============================================================

INSERT INTO experience (company, role, start_date, end_date, description, company_url, "order")
VALUES
  (
    'Freelance',
    'Full Stack Developer',
    '2023-01-01',
    NULL,
    E'Building end-to-end web applications for clients across various industries.\n\n- Delivered 10+ projects using Next.js, Supabase, and Tailwind CSS\n- Reduced client onboarding time by building reusable admin panel templates\n- Maintained 100% on-time delivery across all engagements',
    NULL,
    1
  ),
  (
    'Manzil',
    'Frontend Developer',
    '2022-06-01',
    '2022-12-31',
    E'Worked on the Manzil residence platform, building apartment listing and management interfaces.\n\n- Built reusable component library with React and TypeScript\n- Improved page load time by 40% through code splitting and lazy loading\n- Collaborated with design team to implement pixel-perfect UI from Figma specs',
    'https://manzil.pk',
    2
  ),
  (
    'Self-taught Journey',
    'Developer in Training',
    '2021-01-01',
    '2022-05-31',
    E'Dedicated full time to learning modern web development from first principles.\n\n- Completed 500+ hours of structured learning across HTML, CSS, JavaScript, and React\n- Built 20+ personal projects to solidify concepts\n- Contributed to open-source repositories to gain real-world experience',
    NULL,
    3
  );


-- ============================================================
-- SKILL CATEGORIES + SKILLS
-- ============================================================

WITH cats AS (
  INSERT INTO skill_categories (name, "order") VALUES
    ('Frontend',   1),
    ('Backend',    2),
    ('Tools',      3)
  RETURNING id, name
)
INSERT INTO skills (category_id, name, proficiency, "order", color)
SELECT
  c.id,
  s.name,
  s.proficiency,
  s."order",
  s.color
FROM cats c
JOIN (VALUES
  -- Frontend
  ('Frontend', 'Next.js',        5, 1,  '#000000'),
  ('Frontend', 'React',          5, 2,  '#61DAFB'),
  ('Frontend', 'TypeScript',     4, 3,  '#3178C6'),
  ('Frontend', 'Tailwind CSS',   5, 4,  '#06B6D4'),
  ('Frontend', 'HTML & CSS',     5, 5,  '#E34F26'),
  ('Frontend', 'Framer Motion',  3, 6,  '#BB4BFF'),

  -- Backend
  ('Backend', 'Supabase',        4, 1,  '#3ECF8E'),
  ('Backend', 'PostgreSQL',      4, 2,  '#336791'),
  ('Backend', 'Node.js',         4, 3,  '#339933'),
  ('Backend', 'REST APIs',       4, 4,  '#FF6B35'),
  ('Backend', 'NextAuth',        3, 5,  '#000000'),

  -- Tools
  ('Tools', 'Git & GitHub',      5, 1,  '#F05032'),
  ('Tools', 'Vercel',            4, 2,  '#000000'),
  ('Tools', 'Figma',             3, 3,  '#F24E1E'),
  ('Tools', 'VS Code',           5, 4,  '#007ACC'),
  ('Tools', 'Linux',             3, 5,  '#FCC624')
) AS s(category, name, proficiency, "order", color) ON c.name = s.category;


-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO projects (title, slug, description_short, description_long, tech_stack, demo_url, github_url, status, featured, "order")
VALUES
  (
    'This Portfolio',
    'portfolio',
    'The very site you''re looking at — a full-stack portfolio with WebGL fluid canvas, admin panel, and a terminal easter egg.',
    E'A full-stack portfolio website built from scratch with Next.js 14 App Router and Supabase.\n\n**Features:**\n- WebGL fluid dynamics canvas as hero background\n- Admin panel for managing all content without touching code\n- Constellation skill visualization\n- 3D card-flip project grid\n- Terminal easter egg (try pressing `~`)\n- Guestbook with moderation queue\n- Leaflet map\n- Cursor trail and scroll progress bar',
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'NextAuth', 'WebGL'],
    'https://muneeb.dev',
    'https://github.com/muneeb/portfolio',
    'published',
    TRUE,
    1
  ),
  (
    'Manzil Residence',
    'manzil-residence',
    'Apartment listing and management platform with search, filtering, and a full admin dashboard for property managers.',
    E'A full-featured real estate platform for Manzil, enabling property managers to list apartments and tenants to browse and inquire.\n\n**Features:**\n- Advanced filtering by location, price, and amenities\n- Image gallery with lightbox\n- Inquiry form with email notifications\n- Admin dashboard for listing CRUD\n- Mobile-first responsive design',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'React Hook Form'],
    'https://manzil.pk',
    NULL,
    'published',
    TRUE,
    2
  ),
  (
    'Dev Notes',
    'dev-notes',
    'A minimal markdown-based note-taking app with real-time sync and offline support.',
    E'A lightweight note-taking app built for developers who think in markdown.\n\n**Features:**\n- Real-time sync across devices via Supabase Realtime\n- Full markdown preview with syntax highlighting\n- Offline-first with service worker caching\n- Tag-based organization\n- Keyboard-first navigation',
    ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vite'],
    NULL,
    'https://github.com/muneeb/dev-notes',
    'published',
    FALSE,
    3
  );


-- ============================================================
-- CURRENTLY CARDS
-- ============================================================

INSERT INTO currently (card_type, label, sublabel, link_url, emoji)
VALUES
  ('reading',   'The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', '📖'),
  ('building',  'This Portfolio',            'Next.js + Supabase',         NULL,                                                                                       '🛠️'),
  ('listening', 'lo-fi hip hop radio',       'beats to code to',           'https://www.youtube.com/watch?v=jfKfPfyJRdk',                                              '🎧'),
  ('obsessed',  'WebGL + Shaders',           'Making the web feel alive',  'https://thebookofshaders.com',                                                             '✨')
ON CONFLICT (card_type) DO UPDATE SET
  label      = EXCLUDED.label,
  sublabel   = EXCLUDED.sublabel,
  link_url   = EXCLUDED.link_url,
  emoji      = EXCLUDED.emoji,
  updated_at = NOW();


-- ============================================================
-- THINGS I LOVE (override schema defaults with richer set)
-- ============================================================

DELETE FROM things_i_love;

INSERT INTO things_i_love (label, emoji, "order") VALUES
  ('Clean Code',            '✨',  1),
  ('Dark Mode',             '🌙',  2),
  ('Mechanical Keyboards',  '⌨️',  3),
  ('Coffee',                '☕',  4),
  ('Open Source',           '🐙',  5),
  ('TypeScript',            '💙',  6),
  ('Good Design',           '🎨',  7),
  ('Fast APIs',             '⚡',  8),
  ('Late Night Coding',     '🌃',  9),
  ('WebGL',                 '🟣', 10),
  ('lo-fi beats',           '🎧', 11),
  ('Systems Design',        '🏗️', 12),
  ('Supabase',              '🟢', 13),
  ('Tailwind CSS',          '🌊', 14),
  ('Vim Motions',           '🔥', 15);


-- ============================================================
-- GUESTBOOK (sample approved entries)
-- ============================================================

INSERT INTO guestbook (name, message, avatar_seed, status)
VALUES
  ('Sarah K.',    'Love the fluid canvas effect on the hero — it''s mesmerizing. Great work!',         'sarah-k',    'approved'),
  ('Ali Hassan',  'The terminal easter egg made me smile. sudo hire muneeb indeed.',                   'ali-hassan', 'approved'),
  ('Priya M.',    'Clean, fast, and beautiful. This is what a developer portfolio should look like.',  'priya-m',    'approved');
