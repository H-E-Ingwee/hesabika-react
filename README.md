# Hesabika Trust — Full Stack React Web App

**Brand:** `#bd2427` Red · `#166935` Green · Black · White  
**Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Supabase + Vercel Serverless

---

## 🏗️ Architecture (100% Vercel)

```
hesabika-react/
├── frontend/          ← React SPA (Vite) → Vercel static hosting
├── api/               ← Serverless functions → Vercel Functions
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
├── backend/           ← Reference only (not deployed)
└── vercel.json        ← Single config for everything
```

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
```bash
git init
git remote add origin https://github.com/H-E-Ingwee/Hesabikatrust.git
git add -A
git commit -m "Hesabika Trust React webapp"
git push -f origin main
```

### Step 2 — Run Supabase Migration
1. Go to **supabase.com → your project → SQL Editor**
2. Paste and run: `backend/src/migrations/001_initial_schema.sql`
3. This creates all 12 tables + RLS policies + seed data

### Step 3 — Import to Vercel
1. Go to **vercel.com → New Project**
2. Import from GitHub → select `Hesabikatrust`
3. **Root Directory**: leave as `/` (root)
4. **Framework**: Other
5. **Build Command**: `cd frontend && npm install && npm run build`
6. **Output Directory**: `frontend/dist`
7. **Install Command**: `npm install`

### Step 4 — Add Environment Variables in Vercel
Go to **Project Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://ckmuptnnbnonmouynysh.supabase.co` |
| `SUPABASE_SECRET_KEY` | `sb_secret_UqlyvBaimTtZn2Jsx-nZTA_JIWmLlLW` |
| `VITE_SUPABASE_URL` | `https://ckmuptnnbnonmouynysh.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_x-qrRT-bBDcfu-csjtuksQ_4jprIRwr` |
| `RESEND_API_KEY` | `re_6rZjTgkr_BRGkggqTPYFNnqT5rTa7SRS9` |
| `CLOUDINARY_API_SECRET` | `MSG-_kZUQOf1l1vDatdmI0i1cnY` |
| `VITE_API_URL` | *(leave empty — uses same domain)* |

### Step 5 — Deploy!
Click **Deploy** → your app is live at `https://hesabika-react.vercel.app`

---

## 💻 Run Locally

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173

# API functions (local testing)
# Install Vercel CLI
npm i -g vercel
vercel dev
# → Runs both frontend + API at http://localhost:3000
```

---

## 📄 Pages (12 routes)

| Route | Page |
|---|---|
| `/` | Homepage — Hero, Stats, About, Values, GIPro, Blog, CTA |
| `/about` | About Us + History + Vision/Mission + Values |
| `/about/board` | Board of Trustees (9 members) |
| `/about/secretariat` | Secretariat team |
| `/initiatives` | All 6 initiatives + Civic Education event |
| `/gipro` | GIPro programme detail + funding info |
| `/gipro/interns` | 35+ interns, filterable by cohort |
| `/gipro/mentors` | 40+ mentors |
| `/blog` | Blog + Videos + Downloads + ACT Bulletin |
| `/blog/:slug` | Individual blog post with reading progress |
| `/get-involved` | Give + Apply + Mentor + Careers |
| `/contact` | Contact form + social links |

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/contact` | POST | Contact form → Supabase + Resend email |
| `/api/newsletter` | POST/DELETE | Subscribe/unsubscribe |
| `/api/applications/intern` | POST | GIPro intern application |
| `/api/applications/mentor` | POST | GIPro mentor application |
| `/api/upload` | POST | Image upload to Cloudinary (auth required) |
| `/api/admin/stats` | GET | Dashboard stats (auth required) |
| `/api/admin/messages` | GET/PATCH/DELETE | Contact messages (auth required) |
| `/api/admin/applications` | GET/PATCH | Applications management (auth required) |
| `/api/admin/blog` | GET/POST/PUT/DELETE | Blog CRUD (auth required) |

---

## ✨ Features

- 🎬 Cinematic hero slider (4 slides, auto-play)
- 🃏 3D flip values cards (Hesabika Covenant)
- 🔢 Animated stat counters on scroll
- 🎠 Testimonials carousel with keyboard nav
- 🏃 Infinite partner logo marquee
- 🔍 Filterable interns grid (by cohort year)
- 💬 Intern lightbox modal
- 📖 Blog reading progress bar
- 📤 Social share buttons on blog posts
- 📱 Fully responsive + mobile hamburger nav
- ✉️ Contact forms → Supabase + Resend emails
- 🔐 Supabase Auth for admin routes
- ☁️ Cloudinary image upload
- 🚀 Zero cold starts (Vercel serverless)