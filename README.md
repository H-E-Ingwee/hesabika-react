# Hesabika Trust — Full Stack React Web App

**Brand:** `#bd2427` Red · `#166935` Green · Black · White  
**Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Supabase + Vercel

---

## 🏗️ Architecture (100% Vercel)

```
hesabika-react/
├── frontend/          ← React SPA (Vite) → Vercel static hosting
│   ├── src/
│   │   ├── components/   (layout, sections, ui)
│   │   ├── pages/        (12 pages)
│   │   └── lib/          (supabase, utils, data)
│   └── public/images/    (96 original images)
├── api/               ← Vercel Serverless Functions
│   ├── _lib/             (supabase, resend, cors helpers)
│   ├── contact.ts
│   ├── newsletter.ts
│   ├── upload.ts
│   ├── applications/
│   │   ├── intern.ts
│   │   └── mentor.ts
│   └── admin/
│       ├── stats.ts
│       ├── messages.ts
│       ├── applications.ts
│       └── blog.ts
├── backend/           ← Reference only (NOT deployed)
├── vercel.json        ← Single config for frontend + API
└── package.json       ← Root dependencies for API functions
```

> **Note:** The `backend/` folder is kept for reference only. All API logic lives in `api/` and is deployed as Vercel Serverless Functions.

---

## 🔐 Security — Environment Variables

**⚠️ IMPORTANT: Never commit `.env` files or hardcode secrets in code.**

All sensitive values must be set in **Vercel Dashboard → Project Settings → Environment Variables**.

### Frontend Variables (Public — safe for browser)
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key |
| `VITE_API_URL` | Leave empty on Vercel (uses same domain) |

### API/Backend Variables (Secret — server-side only)
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase secret key (never expose to browser) |
| `RESEND_API_KEY` | Resend email service API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## 🚀 Deploy to Vercel (Option A — Fresh Deploy)

### Step 1 — Set Up GitHub Repo

```bash
# Clone or unzip the project
cd hesabika-react

# Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push everything
git add -A
git commit -m "Initial commit: Hesabika Trust full stack"
git push -f origin main
```

### Step 2 — Run Supabase Migration

1. Go to **supabase.com → your project → SQL Editor**
2. Open `backend/src/migrations/001_initial_schema.sql`
3. Paste the entire contents and click **Run**
4. This creates all 12 tables + RLS policies + seed data

### Step 3 — Import to Vercel

1. Go to **vercel.com → New Project**
2. Import your GitHub repository
3. Configure build settings:

| Setting | Value |
|---|---|
| **Root Directory** | *(leave blank — use repo root)* |
| **Framework Preset** | Other |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Output Directory** | `frontend/dist` |
| **Install Command** | `npm install` |

### Step 4 — Add Environment Variables

In Vercel Dashboard → **Settings → Environment Variables**, add:

**Frontend (Public):**
```
VITE_SUPABASE_URL          = https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_your_key_here
VITE_API_URL               = (leave empty)
```

**API/Backend (Secret):**
```
SUPABASE_URL               = https://your-project.supabase.co
SUPABASE_SECRET_KEY        = sb_secret_your_secret_key_here
RESEND_API_KEY             = re_your_resend_key_here
CLOUDINARY_CLOUD_NAME      = your_cloud_name
CLOUDINARY_API_KEY         = your_api_key
CLOUDINARY_API_SECRET      = your_api_secret
```

> Set all variables to **All Environments** (Production, Preview, Development)

### Step 5 — Deploy

Click **Deploy** → your app goes live in ~2 minutes.

---

## 💻 Run Locally

### Option A — Vercel CLI (recommended, runs API functions too)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Link to your Vercel project
vercel link

# Pull environment variables from Vercel
vercel env pull frontend/.env.local

# Run everything locally
vercel dev
# → http://localhost:3000 (frontend + API)
```

### Option B — Frontend only
```bash
cd frontend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
# → http://localhost:5173
```

---

## ✅ Verify Deployment

After deploying, test these URLs (replace with your Vercel domain):

```
# Should return {"error":"Method not allowed"} — API is working
GET https://your-app.vercel.app/api/contact

# Should return {"error":"Unauthorized"} — Auth is working
GET https://your-app.vercel.app/api/admin/stats

# Should load the homepage
GET https://your-app.vercel.app/
```

---

## 📄 Pages (12 routes)

| Route | Page |
|---|---|
| `/` | Homepage — Hero, Stats, About, Values, GIPro, Blog, CTA |
| `/about` | About Us + History + Vision/Mission + Values |
| `/about/board` | Board of Trustees (9 members with photos) |
| `/about/secretariat` | Secretariat team |
| `/initiatives` | All 6 initiatives + Civic Education event |
| `/gipro` | GIPro programme detail + funding info |
| `/gipro/interns` | 35+ interns, filterable by cohort year |
| `/gipro/mentors` | 40+ mentors |
| `/blog` | Blog + Videos + Downloads + ACT Bulletin (tabbed) |
| `/blog/:slug` | Individual blog post with reading progress bar |
| `/get-involved` | Give + Apply + Mentor + Careers |
| `/contact` | Contact form + social links + map |

---

## 🔌 API Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/contact` | POST | No | Contact form → Supabase + Resend email |
| `/api/newsletter` | POST | No | Subscribe to newsletter |
| `/api/newsletter` | DELETE | No | Unsubscribe |
| `/api/applications/intern` | POST | No | GIPro intern application |
| `/api/applications/mentor` | POST | No | GIPro mentor application |
| `/api/upload` | POST | ✅ Yes | Upload image to Cloudinary |
| `/api/admin/stats` | GET | ✅ Yes | Dashboard statistics |
| `/api/admin/messages` | GET/PATCH/DELETE | ✅ Yes | Contact messages |
| `/api/admin/applications` | GET/PATCH | ✅ Yes | Applications management |
| `/api/admin/blog` | GET/POST/PUT/DELETE | ✅ Yes | Blog post CRUD |

---

## ✨ Features

- 🎬 Cinematic hero slider (4 slides, auto-play with smooth transitions)
- 🃏 3D flip values cards (Hesabika Covenant — click to reveal)
- 🔢 Animated stat counters triggered on scroll
- 🎠 Testimonials carousel with keyboard navigation
- 🏃 Infinite partner logo marquee
- 🔍 Filterable interns grid (by cohort year: 2021, 2022, 2023)
- 💬 Intern lightbox modal on click
- 📖 Blog reading progress bar
- 📤 Social share buttons (Twitter, Facebook, copy link)
- 📱 Fully responsive + mobile hamburger nav with accordion dropdowns
- ✉️ Contact forms → Supabase storage + Resend transactional emails
- 🔐 Supabase Auth for protected admin API routes
- ☁️ Cloudinary image upload for admin
- 🚀 Zero cold starts (Vercel serverless functions)
- 🎨 Framer Motion page transitions and scroll animations

---

## 🗄️ Database (Supabase)

Tables created by the migration:
- `blog_posts` — Blog articles
- `gipro_interns` — Intern profiles
- `gipro_mentors` — Mentor profiles
- `board_members` — Board of Trustees
- `contact_messages` — Contact form submissions
- `newsletter_subscribers` — Email subscribers
- `intern_applications` — GIPro intern applications
- `mentor_applications` — GIPro mentor applications
- `events` — Events and announcements
- `donations` — Donation records
- `downloads` — PDF downloads
- `profiles` — Auth user profiles

---

## 📁 Key Files

```
frontend/src/lib/data.ts      ← All Hesabika content (blog posts, team, values)
frontend/src/lib/supabase.ts  ← Supabase client (uses publishable key only)
api/_lib/supabase.ts          ← Server Supabase client (uses secret key)
api/_lib/resend.ts            ← Email templates and Resend client
vercel.json                   ← Routing: API functions + SPA fallback
backend/src/migrations/       ← SQL schema to run in Supabase
```

---

## 🛡️ Security Notes

1. **Frontend** only uses the `VITE_SUPABASE_PUBLISHABLE_KEY` (safe for browser)
2. **API functions** use `SUPABASE_SECRET_KEY` (server-side only, never in browser)
3. **All `.env` files** are in `.gitignore` — never committed to GitHub
4. **Admin endpoints** require Supabase Auth JWT token
5. **Row Level Security (RLS)** is enabled on all Supabase tables
6. **Rate limiting** is handled by Vercel's built-in protection

---

## 📞 Support

- **Email:** info@hesabika.com
- **Phone:** +254 718 899 103
- **Website:** https://hesabika.com