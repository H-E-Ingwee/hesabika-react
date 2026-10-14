# Hesabika Trust — React Web App

**Full-stack React webapp for Hesabika Trust**
Brand: `#bd2427` Red · `#166935` Green · Black · White

## Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Email**: Resend
- **Images**: Cloudinary
- **Deploy**: Vercel (frontend) + Render (backend)

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
```

## Database Setup
1. Go to Supabase SQL Editor
2. Run `backend/src/migrations/001_initial_schema.sql`
3. Create storage buckets: `hesabika-media` and `hesabika-docs`

## Deploy

### Frontend → Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Set root directory: `frontend`
4. Add env vars from `frontend/.env.example`

### Backend → Render
1. Push to GitHub
2. Create new Web Service in Render
3. Set root directory: `backend`
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Add env vars from `backend/.env`

## Pages
- `/` — Homepage
- `/about` — About Us
- `/about/board` — Board of Trustees
- `/about/secretariat` — Secretariat
- `/initiatives` — All Initiatives
- `/gipro` — GIPro Programme
- `/gipro/interns` — GIPro Interns (filterable)
- `/gipro/mentors` — GIPro Mentors
- `/blog` — Blog + Videos + Downloads + ACT Bulletin
- `/blog/:slug` — Individual blog post
- `/get-involved` — Give + Apply + Mentor + Careers
- `/contact` — Contact form + social links
