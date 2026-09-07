"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Radar,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  ChevronRight,
  Target,
  FileCheck,
  Mail,
  Zap,
  Clock,
  ShieldCheck,
  Database,
  RefreshCw,
  Terminal,
} from "lucide-react";

// Real interactive showcases demonstrating the AI Job Search & Tracking Platform
const REAL_SHOWCASES = [
  {
    id: "rag",
    title: "ChromaDB Vector RAG Matching",
    heading: "Semantic Cosine Scoring Against Your Resume",
    description:
      "Every discovered job posting is vectorized with FastEmbed BGE (384-dimensional dense vectors) and matched against data/resume.txt. Only opportunities with match scores >= 65% are qualified.",
    badge: "BAAI/bge-small-en-v1.5",
    metrics: [
      { label: "Cosine Cutoff", val: "≥ 65.0%" },
      { label: "Embedding Latency", val: "< 35ms" },
      { label: "Vector DB", val: "ChromaDB Persistent" },
    ],
    codeSnippet: `// ChromaDB Cosine Similarity Matching
const matchedJobs = await ragEngine.matchJobs(scrapedCandidates, {
  minScore: 65.0, // Strict qualified threshold
  resumeSource: "data/resume.txt"
});
// Result: Qualified roles saved to SQLite / NeonDB PostgreSQL`,
  },
  {
    id: "scraper",
    title: "Multi-Source 24h Scraping Engine",
    heading: "Automated Search Across Google Jobs & ATS Portals",
    description:
      "Targeted multi-source ingestion for 12 high-demand tech roles. Filters 24-hour recency, deduplicates against 7-day history, and predicts official company career URLs.",
    badge: "SerpApi + Multi-ATS",
    metrics: [
      { label: "Keywords Scanned", val: "12 Roles" },
      { label: "Recency Window", val: "Past 24h" },
      { label: "Deduplication", val: "7-Day Hash" },
    ],
    codeSnippet: `// Multi-Source Scraper Trigger
POST /api/scrape
Response: {
  "status": "success",
  "scraped_count": 48,
  "matched_count": 16,
  "saved_count": 12,
  "scraped_date": "2026-09-08"
}`,
  },
  {
    id: "ats",
    title: "Zero-Hallucination ATS Resume Builder",
    heading: "Instant ReportLab ATS PDF Generation",
    description:
      "Tailors your real verified skills and experience for the specific role without hallucinating fake technologies. Automatically compiles publication-ready, ATS-compliant binary PDFs.",
    badge: "ReportLab Engine",
    metrics: [
      { label: "Hallucination Risk", val: "0% Verified" },
      { label: "Format", val: "ATS Black-Text PDF" },
      { label: "Compiler", val: "Python ReportLab" },
    ],
    codeSnippet: `// Generate Tailored ATS Resume
POST /generate-resume/{job_id}
-> Tailored Markdown generated from verified skills
POST /api/resume/generate-pdf
-> Downloads ATS-compliant binary PDF blob directly`,
  },
  {
    id: "pipeline",
    title: "Application Status Tracker",
    heading: "Real-Time Pipeline from Discovery to Interview",
    description:
      "Organize every qualified role with interactive status toggles: Pending, Applied, Interview, or Rejected. Filter by scraped date with danger-zone cleanup controls.",
    badge: "Interactive Kanban Pipeline",
    metrics: [
      { label: "Statuses", val: "4 Stages" },
      { label: "Date Archiving", val: "YYYY-MM-DD" },
      { label: "Tracking API", val: "PATCH /api/jobs/{id}/status" },
    ],
    codeSnippet: `// Update Application Status
PATCH /api/jobs/14/status
Payload: { "status": "Applied" }
Response: { "id": 14, "status": "Applied", "updated_at": "2026-09-08" }`,
  },
];

// Exact 6 platform features specified with clear category tags, titles, and descriptions
const PLATFORM_FEATURES = [
  {
    icon: Radar,
    tag: "Multi-Source Scraper",
    title: "24-Hour Autonomous Scraper",
    description:
      "Scrapes fresh roles published within the last 24 hours across top ATS platforms and Google Jobs, eliminating expired postings.",
    gradient: "from-blue-600 to-indigo-600",
    badgeColor: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
    highlight: "Zero Expired Postings",
  },
  {
    icon: Target,
    tag: "FastEmbed BGE",
    title: "ChromaDB Vector RAG",
    description:
      "Calculates dense semantic cosine similarity against your active resume. Only roles exceeding 65% match are stored in your database.",
    gradient: "from-purple-600 to-pink-600",
    badgeColor: "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
    highlight: "Strict ≥ 65% Match Cutoff",
  },
  {
    icon: FileCheck,
    tag: "ATS PDF Engine",
    title: "Zero-Hallucination ATS Resumes",
    description:
      "Strict prompt constraints prevent fake skill hallucination. Exports clean, ATS-optimized ReportLab PDFs in seconds.",
    gradient: "from-emerald-600 to-teal-600",
    badgeColor: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    highlight: "Python ReportLab Direct Binary",
  },
  {
    icon: Mail,
    tag: "Email Drafter",
    title: "Recruiter Cold Outreach Drafter",
    description:
      "Automatically extracts recruiter contact emails and generates compelling, personalized outreach pitches ready to send.",
    gradient: "from-amber-500 to-orange-600",
    badgeColor: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    highlight: "1-Click Email Extraction",
  },
  {
    icon: Calendar,
    tag: "Date Management",
    title: "Date-Based Ingestion & Purging",
    description:
      "Filter opportunities by date (YYYY-MM-DD) with full archive history and single-click date cleanup to maintain database hygiene.",
    gradient: "from-indigo-600 to-cyan-600",
    badgeColor: "text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800",
    highlight: "Single-Click Date Purging",
  },
  {
    icon: Layers,
    tag: "Pipeline Tracker",
    title: "Application Status Pipeline",
    description:
      "Track roles through Pending, Applied, Interview, and Rejected states with live status updates and instant toast alerts.",
    gradient: "from-rose-600 to-red-600",
    badgeColor: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
    highlight: "Live Kanban Status Sync",
  },
];

const METRICS_PROOF = [
  { value: "≥ 65.0%", label: "Strict Match Threshold", sub: "Cosine Semantic Cutoff" },
  { value: "24 Hours", label: "Scraping Recency", sub: "Fresh Daily Postings" },
  { value: "100%", label: "Zero Hallucination", sub: "Verified Skills Only" },
  { value: "< 50ms", label: "Next.js ISR Loading", sub: "Tag-Cached Delivery" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Autonomous 24h Scraping",
    description:
      "Runs multi-source ingestion across Google Jobs and ATS systems, discarding roles older than 24 hours to guarantee absolute freshness.",
    icon: Radar,
  },
  {
    step: "02",
    title: "ChromaDB Vector RAG Scoring",
    description:
      "Embeds your verified resume and calculates 384-dimensional semantic cosine similarity. Roles under 65% match are discarded automatically.",
    icon: Target,
  },
  {
    step: "03",
    title: "ATS Resume & Outreach Drafter",
    description:
      "Generates tailored ATS ReportLab PDFs with zero fake skill hallucination and extracts recruiter contact emails for instant outreach.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Next.js ISR Caching & Pipeline",
    description:
      "Jobs are served instantly with Next.js ISR cache tags (jobs-today). Track applications through Pending, Applied, Interview, and Rejected.",
    icon: Zap,
  },
];

export default function HomePage() {
  const [activeShowcase, setActiveShowcase] = React.useState(REAL_SHOWCASES[0]);

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-3xl dark:from-indigo-600/15 dark:via-purple-600/15 dark:to-transparent" />
      <div className="pointer-events-none absolute top-[600px] -left-40 -z-10 h-[400px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/15 blur-3xl" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement Badges */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              <span>Your Assistant 2.5 — Autonomous AI Job Intelligence</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span>Next.js ISR Cache Tags Active</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl leading-tight"
          >
            Your Autonomous AI <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Job Intelligence Radar
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Continuously scrapes real-world openings, computes <strong>ChromaDB Vector RAG match scores</strong> against your active resume, compiles zero-hallucination ATS PDFs, drafts recruiter emails, and caches today's jobs with <strong>Next.js ISR tags</strong> for instant loading.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
              id="hero-dashboard-cta"
            >
              <Radar className="h-5 w-5" />
              <span>Launch Job Radar Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md transition duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              id="hero-login-cta"
            >
              <span>Admin Portal Login</span>
            </Link>
          </motion.div>

          {/* Platform Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Strict ≥ 65% cosine threshold
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero skill hallucination guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 24-Hour fresh autonomous scraping
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Next.js ISR tag caching enabled
            </span>
          </motion.div>

          {/* ================= INTERACTIVE ARCHITECTURE SHOWCASE ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mx-auto mt-14 max-w-5xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-left"
          >
            {/* Window chrome header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  engine://backend.core/rag_pipeline.py
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  NeonDB PostgreSQL + ChromaDB Active
                </span>
              </div>
            </div>

            {/* Showcase Selector Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {REAL_SHOWCASES.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveShowcase(sc)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition duration-150 ${
                    activeShowcase.id === sc.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>

            {/* Active Showcase Content Body */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Description & Metrics */}
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-block rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {activeShowcase.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activeShowcase.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeShowcase.description}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {activeShowcase.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-2.5 text-center"
                    >
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {m.val}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Code snippet box */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-xl overflow-x-auto">
                  <div className="text-slate-500 mb-2">// Executing live pipeline</div>
                  <pre className="text-indigo-300 whitespace-pre-wrap leading-relaxed">
                    {activeShowcase.codeSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF STATS ================= */}
      <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {METRICS_PROOF.map((st) => (
              <div key={st.label} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {st.value}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {st.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES GRID ================= */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Cpu className="h-3.5 w-3.5" />
            <span>Autonomous Intelligence Suite</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Everything Needed to Land Top Roles Fast
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            A unified autonomous operating system connecting scraping, vector matching, ATS generation, and status tracking.
          </p>

          {/* 6 Feature Cards with generous spacing and distinct separation between icon, tag, and title */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {PLATFORM_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1"
                >
                  {/* Card Content Top Container */}
                  <div>
                    {/* Header Row: Generous Icon Container and Distinct Category Tag */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${f.gradient} text-white shadow-lg shadow-indigo-500/20 ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${f.badgeColor}`}
                      >
                        {f.tag}
                      </span>
                    </div>

                    {/* Title with distinct margin and clear typography */}
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {f.title}
                    </h3>

                    {/* Feature Description */}
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {f.description}
                    </p>
                  </div>

                  {/* Bottom Pill Indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {f.highlight}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform">
                      Active →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS WORKFLOW ================= */}
      <section className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Clock className="h-3.5 w-3.5" />
            <span>Autonomous Pipeline Lifecycle</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How Your Autonomous Assistant Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            From discovering roles published within the last 24 hours to instant Next.js ISR cached delivery.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {step.step}
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <StepIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= NEXT.JS ISR PERFORMANCE ARCHITECTURE ================= */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-purple-950/50 p-8 sm:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                  <Zap className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Next.js ISR Tag Cache Engine</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Instant Loading with On-Demand ISR Tags
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  When you click <strong>&quot;Find Latest Jobs Today&quot;</strong>, the backend scraper runs multi-source ingestion and computes vector cosine similarities. Upon completion, Next.js ISR tags (<code>jobs-today</code>, <code>jobs-[date]</code>) are revalidated on-demand.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 border border-white/10">
                    <RefreshCw className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Sub-50ms Dashboard Response</strong>
                      ISR serves cached JSON responses immediately without waiting for scrapers.
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 border border-white/10">
                    <Database className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">On-Demand Tag Purging</strong>
                      Revalidates cache tags the instant fresh daily jobs are generated.
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-800 bg-black/70 p-5 font-mono text-xs text-slate-300 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-500">
                    <Terminal className="h-4 w-4 text-indigo-400" />
                    <span>Next.js ISR Cache Route</span>
                  </div>
                  <pre className="mt-3 text-emerald-400 whitespace-pre-wrap leading-relaxed text-[11px]">
{`// GET /api/cached-jobs?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  return fetch(backendUrl, {
    next: {
      tags: ['jobs', 'jobs-today', \`jobs-\${date}\`],
      revalidate: 3600 // 1-hour ISR cache
    }
  });
}

// On-Demand Invalidation
revalidateTag('jobs-today', { expire: 0 });`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-tr from-indigo-950 via-slate-950 to-purple-950 p-8 sm:p-14 text-center text-white shadow-2xl">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                <span>Ready to Automate Your Career Search?</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Launch Your Autonomous Job Assistant
              </h2>

              <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
                Connect directly to your active resume, scrape fresh postings today, and track all applications in a single high-performance dashboard with instant ISR cached delivery.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-400 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/30 transition active:scale-95"
                >
                  <Radar className="h-5 w-5" />
                  <span>Open Job Radar Dashboard</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition"
                >
                  <span>Admin Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
