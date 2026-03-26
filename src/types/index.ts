export interface SiteMeta {
  id: number;
  site_title: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_label: string;
  hero_cta_url: string;
  og_image_url: string | null;
  updated_at: string;
}

export interface About {
  id: number;
  bio_short: string;
  bio_long: string;
  avatar_url: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  location_label: string | null;
  location_lat: number | null;
  location_lng: number | null;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  company_url: string | null;
  logo_url: string | null;
  order: number;
  created_at: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  skills?: Skill[];
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  icon_slug: string | null;
  proficiency: number;
  order: number;
  color: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description_short: string;
  description_long: string;
  cover_image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Currently {
  id: string;
  card_type: "reading" | "building" | "listening" | "obsessed";
  label: string;
  sublabel: string | null;
  link_url: string | null;
  emoji: string;
  updated_at: string;
}

export interface Mood {
  id: number;
  text: string;
  link_url: string | null;
  is_visible: boolean;
  updated_at: string;
}

export interface ThingILove {
  id: string;
  label: string;
  emoji: string;
  order: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  avatar_seed: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
