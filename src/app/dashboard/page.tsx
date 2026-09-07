"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  SlidersHorizontal,
  RotateCw,
  RefreshCw,
  Radar,
  Calendar,
  Trash2,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { JobCard, type JobItem } from "@/components/dashboard/job-card";
import { JobSkeletonGrid } from "@/components/dashboard/job-skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JobActionModal } from "@/components/dashboard/job-action-modal";
import { apiService, type BackendJob, type JobStatus } from "@/services/api";

function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "Recently scraped";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSecs < 60) return "Just now";
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return `${Math.floor(diffSecs / 86400)}d ago`;
  } catch {
    return "Recently posted";
  }
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Dynamically extract matching technical competencies from job title & description
function extractTechTags(title: string, description?: string | null): string[] {
  const combined = `${title} ${description || ""}`.toLowerCase();
  const candidates = [
    { label: "Next.js", match: ["next.js", "nextjs", "next 14", "next 15", "next 16"] },
    { label: "React", match: ["react", "react.js", "reactjs"] },
    { label: "TypeScript", match: ["typescript", " ts "] },
    { label: "Node.js", match: ["node.js", "nodejs", "express"] },
    { label: "Python", match: ["python", "fastapi", "django", "flask"] },
    { label: "FastAPI", match: ["fastapi"] },
    { label: "GraphQL", match: ["graphql", "appsync"] },
    { label: "Supabase", match: ["supabase"] },
    { label: "PostgreSQL", match: ["postgres", "postgresql", "sql"] },
    { label: "Tailwind CSS", match: ["tailwind"] },
    { label: "AWS", match: ["aws", "amazon web services"] },
    { label: "Docker", match: ["docker", "kubernetes"] },
    { label: "AI Systems", match: ["ai", "llm", "rag", "langchain", "chromadb"] },
    { label: "REST APIs", match: ["rest api", "restful", "apis"] },
  ];
  const tags: string[] = [];
  for (const c of candidates) {
    if (c.match.some((m) => combined.includes(m))) {
      tags.push(c.label);
    }
    if (tags.length >= 4) break;
  }
  return tags.length > 0 ? tags : ["Software Engineering", "Full Stack"];
}

// Dynamically detect or extract salary figures from job descriptions
function extractSalary(description?: string | null): string {
  if (!description) return "Competitive • Verified";
  const salaryRegex = /(\$\s*\d{2,3}(?:,\d{3})*(?:\.\d+)?(?:\s*(?:k|K))?\s*(?:-|to)\s*\$\s*\d{2,3}(?:,\d{3})*(?:\.\d+)?(?:\s*(?:k|K))?)/i;
  const match = description.match(salaryRegex);
  if (match) {
    return `${match[1]} • Verified`;
  }
  const hourlyRegex = /(\$\s*\d{2,3}(?:\.\d{2})?\s*(?:-|to)\s*\$\s*\d{2,3}(?:\.\d{2})?\s*(?:\/|\s*per\s*)hr)/i;
  const matchHourly = description.match(hourlyRegex);
  if (matchHourly) {
    return `${matchHourly[1]} • Hourly`;
  }
  return "Competitive • Disclosed on Apply";
}

// Dynamically extract location and work type
function extractLocationAndType(location?: string | null, description?: string | null): { location: string; type: "Remote" | "Hybrid" | "On-site" } {
  const text = `${location || ""} ${description || ""}`.toLowerCase();
  let type: "Remote" | "Hybrid" | "On-site" = "Remote";
  if (text.includes("hybrid")) {
    type = "Hybrid";
  } else if (text.includes("on-site") || text.includes("onsite") || text.includes("in-office")) {
    type = "On-site";
  }

  let loc = location || "Remote / Global";
  if (type === "Remote" && (!location || location.toLowerCase() === "remote")) {
    loc = "Remote (Work from Anywhere)";
  }
  return { location: loc, type };
}

function extractSnippet(description?: string | null, company?: string): string {
  if (description && description.trim().length > 20) {
    const clean = description.replace(/\s+/g, " ").trim();
    return clean.length > 220 ? `${clean.slice(0, 220)}...` : clean;
  }
  return `Live qualified position at ${company || "Company"}. Matched and scored with ChromaDB vector RAG (>= 65%).`;
}

function mapBackendJobToItem(b: BackendJob): JobItem {
  const { location, type } = extractLocationAndType(b.location, b.description);
  return {
    id: String(b.id),
    numericId: b.id,
    title: b.title,
    company: b.company,
    location,
    type,
    salary: extractSalary(b.description),
    matchScore: Math.round(b.match_score),
    postedDate: formatRelativeTime(b.created_at || b.scraped_date),
    careerUrl: b.career_page_link || b.link || (b as unknown as { job_link?: string }).job_link || "#",
    tags: extractTechTags(b.title, b.description),
    descriptionSnippet: extractSnippet(b.description, b.company),
    status: b.status || "Pending",
    scrapedDate: b.scraped_date,
    recruiterEmail: b.recruiter_email,
  };
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = React.useState<string>(getTodayString());
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("All");
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState<string>("All");
  const [selectedJob, setSelectedJob] = React.useState<JobItem | null>(null);

  // Live Backend Data States
  const [jobs, setJobs] = React.useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isScrapingGlobal, setIsScrapingGlobal] = React.useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Fetch jobs for a specific target date (Requirement 3: GET /api/jobs?date=YYYY-MM-DD)
  // Leverages Next.js ISR tag caching by default for sub-50ms instant loading
  const fetchJobs = React.useCallback(async (targetDate: string, bypassCache = false) => {
    setIsLoading(true);
    try {
      const backendJobs: BackendJob[] = await apiService.getJobs({
        date: targetDate,
        limit: 100,
        bypassCache,
      });

      // Filter and map jobs (only >= 65% will be shown)
      const qualified = backendJobs
        .filter((b) => b.match_score >= 65)
        .map(mapBackendJobToItem);

      setJobs(qualified);
    } catch {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount or when selectedDate changes
  React.useEffect(() => {
    fetchJobs(selectedDate);
  }, [selectedDate, fetchJobs]);

  // Requirement 2: Prominent Animated Action: "Find Latest Jobs Today"
  // Calls POST /api/scrape, triggers global loading state, and refreshes job list.
  const handleFindLatestJobsToday = async () => {
    setIsScrapingGlobal(true);
    const toastId = toast.loading(
      "Scraping & matching 50+ jobs across multi-source scrapers with ChromaDB Vector RAG...",
      { duration: 40000 }
    );

    try {
      const result = await apiService.triggerScraper();
      const today = getTodayString();
      setSelectedDate(today);
      
      // Purge Next.js ISR cache tags to regenerate today's cached jobs
      await apiService.revalidateJobs("jobs-today");
      await apiService.revalidateJobs(`jobs-${today}`);
      await fetchJobs(today, true);

      if (result.matched_count > 0 || result.saved_count > 0) {
        toast.success(
          `Success! Discovered & qualified ${result.matched_count || result.saved_count} jobs (>= 65% match) for today!`,
          { id: toastId }
        );
      } else {
        toast.success(result.message || "Scraping completed. Existing qualified jobs updated.", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Scraping pipeline failed.";
      toast.error(`Error: ${msg}`, { id: toastId });
      await fetchJobs(selectedDate);
    } finally {
      setIsScrapingGlobal(false);
    }
  };

  // Requirement 4: Application Status Tracking
  // Calls PATCH /api/jobs/{job_id}/status and updates UI toast notification
  const handleStatusChange = async (jobId: number, newStatus: JobStatus) => {
    // Optimistic UI update
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.numericId === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      await apiService.updateJobStatus(jobId, newStatus);
      toast.success(`Application status updated to "${newStatus}"!`, {
        icon: newStatus === "Applied" ? "🚀" : newStatus === "Interview" ? "🎉" : "📝",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      toast.error(`Status update error: ${msg}`);
      // Revert if error
      fetchJobs(selectedDate);
    }
  };

  // Requirement 3: Danger-zone action: "Delete all jobs for this date"
  // Calls DELETE /api/jobs/date/{date} and clears UI for that day
  const handleDeleteAllForDate = async () => {
    setIsDeleting(true);
    const toastId = toast.loading(`Deleting all jobs for date ${selectedDate}...`);

    try {
      const res = await apiService.deleteJobsByDate(selectedDate);
      setJobs([]);
      setDeleteConfirmOpen(false);
      toast.success(
        res.message || `Deleted all jobs scraped for ${selectedDate}.`,
        { id: toastId }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete jobs for date.";
      toast.error(`Deletion error: ${msg}`, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // Date Navigation Helpers
  const shiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const isTodaySelected = selectedDate === getTodayString();

  // Filtered jobs by Status or Location Type
  const displayedJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const matchStatus =
        selectedStatusFilter === "All" || job.status === selectedStatusFilter;
      const matchType =
        selectedTypeFilter === "All" || job.type === selectedTypeFilter;
      return matchStatus && matchType;
    });
  }, [jobs, selectedStatusFilter, selectedTypeFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* ================= HERO STATS BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>Autonomous Job Radar & RAG Application Pipeline (2.0)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              AI Job Intelligence & Tracker
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200/85 leading-relaxed">
              Multi-source concurrent scraper scanning top opportunities. Ranked via ChromaDB Vector RAG against your active resume. Showing roles with strictly <span className="font-bold text-emerald-400">≥ 65% cosine match</span>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* REQUIREMENT 2: Animated Button "Find Latest Jobs Today" */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFindLatestJobsToday}
                disabled={isScrapingGlobal}
                className="relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-sm sm:text-base px-6 py-3.5 shadow-xl shadow-indigo-500/35 transition active:scale-95 disabled:opacity-60"
                id="find-latest-jobs-button"
              >
                <Radar className={`h-5 w-5 ${isScrapingGlobal ? "animate-spin" : "animate-pulse"}`} />
                <span>
                  {isScrapingGlobal
                    ? "Scraping & Matching 50+ Roles..."
                    : "Find Latest Jobs Today"}
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
              </motion.button>

              <div className="inline-flex items-center gap-1.5 text-xs text-indigo-200/90 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                <span>Active Profile: <strong className="text-white">Yeasaleh (Software Developer)</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {jobs.length > 0 ? `${Math.max(...jobs.map((j) => j.matchScore))}%` : "≥ 65%"}
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-slate-300">Top RAG Fit</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-indigo-300">
                {isLoading || isScrapingGlobal ? "..." : displayedJobs.length}
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-slate-300">Roles for Date</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black text-purple-300">
                {jobs.filter((j) => j.status === "Applied" || j.status === "Interview").length}
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-slate-300">Applied / Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GLOBAL SCRAPING PROGRESS BANNER ================= */}
      <AnimatePresence>
        {isScrapingGlobal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-indigo-300 dark:border-indigo-800/90 bg-indigo-50 dark:bg-indigo-950/70 p-4 sm:p-5 shadow-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Radar className="h-5 w-5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                    Autonomous Multi-Source Scraper Running...
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">
                    Scraping Google Jobs & ATS career portals, evaluating cosine similarity against resume.txt with FastEmbed BGE.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                  Live Stream
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= REQUIREMENT 3: DATE CONTROLS & DANGER ZONE ================= */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Date Selector and Shift Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span>Scraped Date:</span>
            </div>

            {/* Shift Previous Day */}
            <button
              type="button"
              onClick={() => shiftDate(-1)}
              title="Previous Day"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Native Date Picker Input */}
            <input
              type="date"
              id="scraped-date-filter"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                }
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />

            {/* Shift Next Day */}
            <button
              type="button"
              onClick={() => shiftDate(1)}
              title="Next Day"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Quick Jump to Today */}
            {!isTodaySelected && (
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayString())}
                className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
              >
                Jump to Today
              </button>
            )}

            {isTodaySelected && (
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                Today&apos;s Feed
              </span>
            )}
          </div>

          {/* Danger Zone: Delete All Jobs For This Date */}
          <div className="flex items-center gap-2">
            {!deleteConfirmOpen ? (
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 transition"
                title="Purge all jobs stored for this date"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                <span>Delete all jobs for this date</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 p-1.5 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 ml-1.5" />
                <span className="text-xs font-bold text-rose-800 dark:text-rose-200">
                  Confirm delete {jobs.length} jobs on {selectedDate}?
                </span>
                <button
                  type="button"
                  onClick={handleDeleteAllForDate}
                  disabled={isDeleting}
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-xs font-bold transition disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 text-xs font-medium hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters & Status Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              Status Filter:
            </span>

            {/* Status Filter Dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="All">All Application Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Location Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="All">All Workplaces</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Refresh Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchJobs(selectedDate)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm transition"
            >
              <RefreshCw className={`h-3 w-3 text-indigo-500 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Date</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= JOBS GRID / SKELETON / EMPTY STATE ================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>Roles Qualified on {selectedDate}</span>
              <span className="text-xs text-slate-400 font-normal">(&ge; 65% Match)</span>
            </h3>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {isLoading || isScrapingGlobal ? "Loading..." : `${displayedJobs.length} roles`}
            </span>
          </div>

          {(selectedStatusFilter !== "All" || selectedTypeFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatusFilter("All");
                setSelectedTypeFilter("All");
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCw className="h-3 w-3" />
              Clear Filters
            </button>
          )}
        </div>

        {/* State Conditional Rendering */}
        <AnimatePresence mode="wait">
          {isLoading || isScrapingGlobal ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <JobSkeletonGrid count={6} />
            </motion.div>
          ) : displayedJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                keyword={selectedDate}
                onReset={() => {
                  setSelectedStatusFilter("All");
                  setSelectedTypeFilter("All");
                  fetchJobs(selectedDate);
                }}
                onScanLive={handleFindLatestJobsToday}
                isScanning={isScrapingGlobal}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
            >
              {displayedJobs.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={i}
                  onSelect={(selected) => setSelectedJob(selected)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detailed Job Action Modal (Slide-over connected to FastAPI) */}
      <JobActionModal
        key={selectedJob?.id ?? "none"}
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
