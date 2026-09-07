<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

# Your Assistant — AI Job Intelligence Platform

**Enterprise-grade frontend for an autonomous AI job search platform.**

Real-time job radar, AI-powered ATS resume generation, cold email drafting,
and full FastAPI backend integration — all in a premium, animated UI.

</div>

---

## ✨ Key Features

### 🤖 AI-Powered Job Intelligence
- **Live Job Radar** — Connects to FastAPI + SQLite via `GET /jobs?job_keyword=...` with cosine similarity scores (FastEmbed BGE)
- **Animated Circular Match Score** — SVG `motion.circle` animates on card mount; color-coded: Emerald 90%+, Indigo 75–89%, Amber below 75%
- **Staggered Grid Animation** — Each job card enters with a cascading Framer Motion delay (`index × 60ms`)

### 📄 ATS Resume Generation
- Calls `POST /generate-resume/{id}` → `POST /api/resume/generate-pdf` to compile a ReportLab PDF
- Force-downloads the binary blob via a URL object link — no popups
- Graceful fallback if LLM keys are unconfigured: generates a structured PDF directly via ReportLab

### 📧 Cold Email Drafter
- Calls `POST /generate-email/{id}` — returns recruiter email, subject, and body
- Renders in a styled read-only `<textarea>` with a **Copy to Clipboard** button
- Animated `height: 0 → auto` reveal using Framer Motion `AnimatePresence`

### 🌗 Dark / Light Mode
- Powered by `next-themes` with system preference detection
- All components fully support both modes — zero flash on load
- Uses `suppressHydrationWarning` + `disableTransitionOnChange`

### 🛡️ XSS Protection
- Search input sanitized via a strict allow-list regex before any API call or DOM render
- Blocked characters: `< > " ' ` \ { } ( )`
- Live amber warning indicator appears when sanitization fires

### 🎞️ Framer Motion Animations
- Page transitions with `AnimatePresence mode="wait"` — no layout shifts between states
- Spring-physics slide-over modal (`damping: 28, stiffness: 280`)
- Email textbox animated `height: 0 → auto` reveal
- Backdrop blur `opacity: 0 → 1` for modal overlay

### 📱 Mobile-First Responsiveness
- Sidebar collapses to off-canvas drawer on `< lg` breakpoints with backdrop overlay
- Dashboard grid: `1 col → 2 col (md) → 3 col (lg)`
- Job card header uses `min-w-0 flex-1` + `line-clamp-2` to prevent overflow at any width

---

## 🏗️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Animations** | Framer Motion 11 |
| **Icons** | Lucide React |
| **Theme** | next-themes (Dark / Light / System) |
| **Notifications** | react-hot-toast |
| **HTTP Client** | Native `fetch` API |
| **Backend** | FastAPI + SQLite + ChromaDB (separate repo) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + Footer, hidden on /dashboard)
│   ├── page.tsx                # Landing page (Hero, Features, CTA)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   └── dashboard/
│       ├── layout.tsx          # Dashboard chrome: full-height flex, Sidebar + Topbar
│       └── page.tsx            # Job radar + search + modal
│
├── components/
│   ├── navbar.tsx              # Public navbar (returns null on /dashboard)
│   ├── footer.tsx              # Public footer (returns null on /dashboard)
│   ├── theme-toggle.tsx
│   └── dashboard/
│       ├── sidebar.tsx         # Fixed sidebar with quota widget
│       ├── topbar.tsx          # Sticky topbar with notifications
│       ├── job-card.tsx        # Animated card with circular AI match score
│       ├── job-skeleton.tsx    # Shimmer skeleton loaders (6-card grid)
│       ├── job-search-input.tsx# XSS-sanitized animated search input
│       ├── empty-state.tsx     # Illustrated empty state component
│       └── job-action-modal.tsx# Framer Motion slide-over with AI actions
│
└── services/
    └── api.ts                  # Centralized API service layer
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# URL of your FastAPI backend (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Yes | Base URL of the FastAPI backend |

> **Note**: The `NEXT_PUBLIC_` prefix exposes this variable to the browser bundle. Never store secrets here.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or `pnpm` / `yarn`)
- A running **FastAPI backend** at `http://127.0.0.1:8000`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-assistant-frontend.git
cd your-assistant-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_BASE_URL

# 4. Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Navigate to [/dashboard](http://localhost:3000/dashboard) for the live job intelligence dashboard.

### Production Build

```bash
npm run build
npm run start
```

---

## 🔌 API Endpoints

All API calls are centralized in `src/services/api.ts`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/jobs` | Fetch jobs (optional: `?job_keyword=&min_score=`) |
| `POST` | `/jobs` | Create a new job record |
| `POST` | `/generate-resume/{id}` | Generate tailored ATS resume markdown |
| `POST` | `/generate-email/{id}` | Generate personalized cold outreach email |
| `POST` | `/api/resume/generate-pdf` | Compile markdown → binary PDF via ReportLab |

### Error Handling Strategy
- `react-hot-toast` provides global toast notifications for API failures, successes, and rate-limit warnings
- Both `generateResume` and `generateEmail` have graceful local fallbacks if the LLM provider is unreachable

---

## 🎨 Design System

| Token | Light Mode | Dark Mode |
|---|---|---|
| Primary | Indigo-600 → Purple-600 | Same |
| Success | Emerald-500 | Emerald-400 |
| Card surface | `white` | `slate-900/90` |
| Page background | `slate-50/50` | `#070a12` |
| Border | `slate-200/90` | `slate-800/90` |
| Card radius | `rounded-2xl` (16px) | Same |
| Section radius | `rounded-3xl` (24px) | Same |
| Font (sans) | Geist Sans (next/font) | Same |
| Font (mono) | Geist Mono (next/font) | Same |

---

## 🔐 Security Practices

| Practice | Implementation |
|---|---|
| XSS Prevention | Allow-list regex sanitizes all user input before API calls or DOM rendering |
| External Links | All `target="_blank"` anchors include `rel="noopener noreferrer"` |
| No innerHTML | All dynamic content rendered via React text nodes — zero `dangerouslySetInnerHTML` |
| Env secrets | `.env.local` is gitignored; only `NEXT_PUBLIC_` variables are safe to expose |

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack HMR |
| `npm run build` | Type-check + build for production |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint on the entire codebase |

---

## 🗺️ Roadmap

- [ ] Authentication (NextAuth.js with Google OAuth)
- [ ] Persistent saved jobs (localStorage → backend sync)
- [ ] Resume profile upload for dynamic ATS tailoring
- [ ] Webhook integration for email job alerts
- [ ] Analytics dashboard (applications sent, reply rates)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">

Built with ❤️ using **Next.js 15** · **TypeScript** · **Framer Motion** · **FastAPI**

</div>
