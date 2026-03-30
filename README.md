# Muneeb's Portfolio

A modern, high-performance personal portfolio website built with Next.js 15, TypeScript, Supabase, Tailwind CSS, and Framer Motion.

---

## Features

### Public Site

- **Hero Section** — Animated bitmoji avatar, headline, CTA buttons, Framer Motion entrance animations
- **About Section** — AI-powered chat widget (Groq / llama-3.3-70b), bio card, watermark
- **Experience Section** — Timeline of work history pulled from Supabase
- **Skills Section**
  - Desktop: interactive 3D keyboard layout with RGB glow strip and floating decorative keys
  - Mobile: 3D keycap-style button grid, fills screen width in a 4-column layout
  - Keys pop-animate on every scroll in random order
- **Projects Section**
  - Desktop: Apple-style sticky scroll — left panel shows live preview with parallax, right side scrolls through entries; `IntersectionObserver` drives active state
  - Mobile: stacked cards with 16:9 screenshots, tech badges, and action buttons
- **Contact Section** — Validated contact form backed by Supabase; fields collapse to single-column on mobile
- **Interactive Map** — Mapbox GL map showing location (Islamabad)
- **AI Chatbot** — Groq-powered streaming chat; graceful local fallback when API is unavailable
- **Mood Bar** — Real-time mood indicator set from the admin panel
- **Scroll Progress** — Thin top progress bar
- **Easter Eggs** — Cursor trail, terminal Easter egg

### Admin Dashboard (`/admin`)

- **Login** — Credentials-based auth via NextAuth v5, bcryptjs password hashing
- **Projects Manager** — Create, edit, delete, reorder projects with image uploads
- **Skills Manager** — Manage skill categories and individual skills (name, icon, color, proficiency)
- **About Editor** — Update bio, profile image, and work experience entries
- **Contact Inbox** — View and manage contact form submissions
- **Guestbook Manager** — Approve or reject guestbook entries
- **Mood Editor** — Set current mood/status
- **Settings** — Change admin password, update site metadata

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth v5 + bcryptjs |
| Validation | Zod v4 |
| AI / Chat | Groq SDK (llama-3.3-70b-versatile) |
| Rate Limiting | Upstash Redis + @upstash/ratelimit |
| Maps | Mapbox GL |
| File Storage | Supabase Storage |

---

## Security

- **HTTP Security Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (set via `next.config.ts`)
- **Input Validation** — All API routes validate request bodies with Zod schemas before touching the database
- **Rate Limiting** — Upstash sliding-window limiters on all public endpoints:
  - Contact form: 3 requests / hour / IP
  - Guestbook: 5 requests / hour / IP
  - Chat: 30 requests / minute / IP
- **Authentication** — NextAuth middleware protects all `/admin/*` routes at the edge; passwords hashed with bcryptjs
- **File Upload Hardening** — MIME type allowlist (JPEG, PNG, WebP, GIF, AVIF), 5 MB size cap, bucket allowlist, server-generated filenames (no user-controlled paths)
- **No Raw SQL** — All database access goes through the Supabase client with parameterised queries

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Public homepage
│   ├── admin/                    # Protected dashboard pages
│   │   └── login/page.tsx
│   └── api/                      # API routes
│       ├── contact/
│       ├── guestbook/
│       ├── projects/
│       ├── skills/
│       ├── chat/
│       ├── upload/
│       └── ...
├── components/
│   ├── sections/                 # Homepage sections
│   ├── admin/                    # Admin-only components
│   ├── layout/                   # Navbar, Footer, MoodBar
│   └── ui/                       # Shared primitives
├── lib/
│   ├── auth.ts                   # NextAuth setup
│   ├── ratelimit.ts              # Upstash rate limiters
│   ├── supabase/                 # Supabase clients (admin, server, client)
│   └── validations/              # Zod schemas
└── middleware.ts                 # Edge auth guard
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- An Upstash Redis database
- A Groq API key
- A Mapbox token

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AUTH_SECRET=                      # generate with: openssl rand -base64 32

NEXT_PUBLIC_MAPBOX_TOKEN=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

GROQ_API_KEY=
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Deploy

The project is optimised for Vercel. Push to your repo and connect it in the Vercel dashboard. Add all environment variables under **Project → Settings → Environment Variables**.
