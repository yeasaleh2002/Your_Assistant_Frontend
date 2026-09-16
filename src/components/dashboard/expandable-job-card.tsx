"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Send,
  Calendar,
  XCircle,
  Clock3,
} from "lucide-react";
import { MatchScoreRing } from "./match-score-ring";
import { type MatchedJobDetail } from "@/hooks/use-job-matches";
import { type JobStatus } from "@/services/api";
import { accordionVariants, cardHoverVariants, buttonInteractionVariants } from "@/lib/animations";

interface ExpandableJobCardProps {
  job: MatchedJobDetail;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (jobId: number, status: JobStatus) => void;
  layoutMode?: "grid" | "list";
}

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; style: string }
> = {
  Pending: {
    label: "Pending",
    icon: Clock3,
    style: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
  Applied: {
    label: "Applied",
    icon: Send,
    style: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  },
  Interview: {
    label: "Interview",
    icon: Calendar,
    style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircle,
    style: "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
};

export function ExpandableJobCard({
  job,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  layoutMode = "grid",
}: ExpandableJobCardProps) {
  const [statusMenuOpen, setStatusMenuOpen] = React.useState(false);
  const statusRef = React.useRef<HTMLDivElement>(null);

  // Close status dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusMenuOpen(false);
      }
    }
    if (statusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusMenuOpen]);

  const initials = (job.company || "Co")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statusInfo = STATUS_CONFIG[job.status] || STATUS_CONFIG.Pending;
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      layout
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 transition-colors ${
        isExpanded
          ? "ring-2 ring-indigo-500/30 border-indigo-300 dark:border-indigo-700 shadow-md"
          : ""
      }`}
    >
      {/* Top Main Card Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Company Avatar & Role Info */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200/80 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200 select-none shadow-sm">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-xs text-slate-600 dark:text-slate-400 truncate max-w-[160px]">
                  {job.company}
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  {job.location?.toLowerCase().includes("remote") ? "Remote" : "On-site / Hybrid"}
                </span>
              </div>

              <h3 className="mt-1 font-bold text-base text-slate-900 dark:text-white leading-snug truncate">
                {job.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{job.location || "Remote"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{job.scraped_date || "Today"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Indicator Ring */}
          <div className="shrink-0">
            <MatchScoreRing score={job.match_score} />
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 items-center">
          {job.matchingSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              {skill}
            </span>
          ))}
          {job.missingSkills.slice(0, 1).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300"
            >
              <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
              Missing: {skill}
            </span>
          ))}
        </div>

        {/* Action Toolbar & Accordion Toggle */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          {/* Application Status Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-xs transition hover:brightness-95 ${statusInfo.style}`}
              title="Change application status"
            >
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{statusInfo.label}</span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </button>

            {statusMenuOpen && (
              <div className="absolute left-0 bottom-full mb-1.5 z-30 w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xl">
                {(["Pending", "Applied", "Interview", "Rejected"] as JobStatus[]).map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onStatusChange(job.id, st);
                        setStatusMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        job.status === st
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Accordion Expand Trigger */}
          <button
            type="button"
            onClick={onToggleExpand}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span>{isExpanded ? "Hide Breakdown" : "View Match Breakdown"}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Accordion Expandable Content Section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="accordion-content"
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 rounded-b-2xl"
          >
            <div className="p-5 sm:p-6 space-y-4">
              {/* 1. Matching Skills */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Matching Skills ({job.matchingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Missing Skills */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Skills To Emphasize / Missing ({job.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-1 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Match Summary */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Match Summary</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {job.matchSummary}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                  💡 Strategy: {job.recommendation}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                <Link
                  href={`/builder?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(
                    job.company
                  )}&email=${encodeURIComponent(job.recruiter_email || "")}`}
                >
                  <motion.button
                    variants={buttonInteractionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-3.5 py-2 text-xs font-semibold shadow-xs"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Open in AI Resume Builder</span>
                  </motion.button>
                </Link>

                <motion.a
                  variants={buttonInteractionVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  href={job.career_page_link || job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3.5 py-2 text-xs font-semibold shadow-xs"
                >
                  <span>Apply on Company Site</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
