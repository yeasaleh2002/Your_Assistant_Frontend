"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  SlidersHorizontal,
  RotateCw,
} from "lucide-react";
import { JobSearchInput } from "@/components/dashboard/job-search-input";
import { JobCard, type JobItem } from "@/components/dashboard/job-card";
import { JobSkeletonGrid } from "@/components/dashboard/job-skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JobActionModal } from "@/components/dashboard/job-action-modal";

// Rich mock data representing realistic AI, Frontend, and Full Stack positions
const MOCK_JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Senior Autonomous Agent Engineer",
    company: "Anthropic",
    location: "Remote (US/EU)",
    type: "Remote",
    salary: "$210k - $275k",
    matchScore: 96,
    postedDate: "2 hours ago",
    careerUrl: "https://anthropic.com/careers",
    tags: ["Autonomous Agents", "Python", "Tool Calling", "Next.js"],
    descriptionSnippet:
      "Architect and scale autonomous reasoning runtimes with multi-modal tool calling and persistent memory graphs.",
  },
  {
    id: "job-2",
    title: "Staff Frontend Architect (Next.js)",
    company: "Vercel",
    location: "Remote (Global)",
    type: "Remote",
    salary: "$200k - $250k",
    matchScore: 94,
    postedDate: "4 hours ago",
    careerUrl: "https://vercel.com/careers",
    tags: ["Next.js 16", "React 19", "Turbopack", "Tailwind CSS"],
    descriptionSnippet:
      "Lead developer experience and rendering performance across the core Next.js App Router and server actions infrastructure.",
  },
  {
    id: "job-3",
    title: "Autonomous Evaluation Specialist",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Hybrid",
    salary: "$220k - $290k",
    matchScore: 92,
    postedDate: "6 hours ago",
    careerUrl: "https://openai.com/careers",
    tags: ["Agentic Evals", "Python", "FastAPI", "Sandbox Runtime"],
    descriptionSnippet:
      "Build rigorous automated benchmarks and safety evaluation harnesses for recursive coding agents.",
  },
  {
    id: "job-4",
    title: "Vector Search & Agent Systems Engineer",
    company: "Supabase",
    location: "Remote (Worldwide)",
    type: "Remote",
    salary: "$185k - $230k",
    matchScore: 89,
    postedDate: "12 hours ago",
    careerUrl: "https://supabase.com/careers",
    tags: ["PostgreSQL", "pgvector", "TypeScript", "Rust"],
    descriptionSnippet:
      "Engineer distributed vector indexing and real-time embedding pipelines for generative AI integrations.",
  },
  {
    id: "job-5",
    title: "Full Stack Product Engineer",
    company: "Linear",
    location: "Remote (US/Canada)",
    type: "Remote",
    salary: "$175k - $220k",
    matchScore: 86,
    postedDate: "1 day ago",
    careerUrl: "https://linear.app/careers",
    tags: ["TypeScript", "GraphQL", "React", "Sync Engine"],
    descriptionSnippet:
      "Craft high-performance, keyboard-first desktop and web interfaces powered by optimistic offline-first sync.",
  },
  {
    id: "job-6",
    title: "Developer Platform & API Integration Lead",
    company: "Stripe",
    location: "Seattle, WA / Remote",
    type: "Hybrid",
    salary: "$190k - $240k",
    matchScore: 79,
    postedDate: "1 day ago",
    careerUrl: "https://stripe.com/jobs",
    tags: ["API Architecture", "SDKs", "TypeScript", "Security"],
    descriptionSnippet:
      "Design developer primitives, webhooks, and client SDKs enabling millions of businesses to accept autonomous agent payments.",
  },
  {
    id: "job-7",
    title: "Generative Reasoning & Code Specialist",
    company: "Scale AI",
    location: "New York, NY",
    type: "On-site",
    salary: "$180k - $230k",
    matchScore: 84,
    postedDate: "2 days ago",
    careerUrl: "https://scale.com/careers",
    tags: ["Fine-tuning", "Python", "Agent Workflows", "RLHF"],
    descriptionSnippet:
      "Train and evaluate coding LLMs on complex full-stack repositories and automated debugging traces.",
  },
  {
    id: "job-8",
    title: "Enterprise Workflow Systems Engineer",
    company: "Retool",
    location: "Remote (US)",
    type: "Remote",
    salary: "$160k - $205k",
    matchScore: 72,
    postedDate: "3 days ago",
    careerUrl: "https://retool.com/careers",
    tags: ["Internal Tooling", "JavaScript", "React", "Docker"],
    descriptionSnippet:
      "Empower enterprise engineers to build mission-critical operations applications and custom API workflows with speed.",
  },
];

export default function DashboardPage() {
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("All");
  const [minScore, setMinScore] = React.useState<number>(0);
  const [selectedJob, setSelectedJob] = React.useState<JobItem | null>(null);

  // Visual simulation states for QA and inspection
  const [forceLoading, setForceLoading] = React.useState(false);
  const [forceEmpty, setForceEmpty] = React.useState(false);

  // Filter jobs based on keyword, type, and score
  const filteredJobs = React.useMemo(() => {
    if (forceEmpty) return [];

    return MOCK_JOBS.filter((job) => {
      // Keyword filter matching title, company, or tags
      const query = searchKeyword.toLowerCase().trim();
      const matchesKeyword =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        job.descriptionSnippet.toLowerCase().includes(query);

      // Work type filter
      const matchesType =
        selectedType === "All" || job.type === selectedType;

      // Minimum score filter
      const matchesScore = job.matchScore >= minScore;

      return matchesKeyword && matchesType && matchesScore;
    });
  }, [searchKeyword, selectedType, minScore, forceEmpty]);

  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedType("All");
    setMinScore(0);
    setForceEmpty(false);
    setForceLoading(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ================= HERO STATS BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Autonomous Match Radar Active
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Curated Roles Fitted to Your Tech Profile
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
              Your Assistant continuously indexes remote and engineering openings, scoring semantic fit based on your TypeScript, Next.js, and Agentic AI expertise.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">96%</div>
              <div className="text-[10px] sm:text-xs font-medium text-slate-300">Top Match</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-indigo-300">
                {filteredJobs.length}
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-slate-300">Openings</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-amber-400">4</div>
              <div className="text-[10px] sm:text-xs font-medium text-slate-300">Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & INTERACTIVE CONTROLS ================= */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm space-y-5">
        {/* Animated Job Search Input with XSS Validation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="job-keyword-search"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Search Openings
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Sanitized with strict client-side XSS protection
            </span>
          </div>

          <JobSearchInput
            value={searchKeyword}
            onChange={(val) => setSearchKeyword(val)}
            onClear={() => setSearchKeyword("")}
          />
        </div>

        {/* Filter Bar & Visual State Preview Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Work Type & Score Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              Filter:
            </span>

            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            {/* Minimum Match Score selector */}
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="0">All Match Scores</option>
              <option value="80">80%+ Match</option>
              <option value="90">90%+ Top Fit</option>
            </select>
          </div>

          {/* Developer QA State Preview Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              State Preview:
            </span>

            {/* Toggle Loading State */}
            <button
              type="button"
              onClick={() => setForceLoading(!forceLoading)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                forceLoading
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {forceLoading ? "Stop Skeletons" : "Simulate Loading"}
            </button>

            {/* Toggle Empty State */}
            <button
              type="button"
              onClick={() => setForceEmpty(!forceEmpty)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                forceEmpty
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {forceEmpty ? "Show Results" : "Force Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= JOBS GRID / SKELETON / EMPTY STATE ================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Available Openings
            </h3>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {forceLoading ? "Loading..." : `${filteredJobs.length} roles found`}
            </span>
          </div>

          {(searchKeyword || selectedType !== "All" || minScore > 0 || forceEmpty) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* State Conditional Rendering */}
        <AnimatePresence mode="wait">
          {forceLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <JobSkeletonGrid count={6} />
            </motion.div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                keyword={searchKeyword}
                onReset={handleResetFilters}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={(selected) => setSelectedJob(selected)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detailed Job Action Modal (Slide-over) */}
      <JobActionModal
        key={selectedJob?.id ?? "none"}
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
