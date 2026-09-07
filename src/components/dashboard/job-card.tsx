"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  Sparkles,
} from "lucide-react";

export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
  salary: string;
  matchScore: number; // 0 - 100
  postedDate: string;
  careerUrl: string;
  tags: string[];
  descriptionSnippet: string;
}

interface JobCardProps {
  job: JobItem;
  onSaveToggle?: (jobId: string, isSaved: boolean) => void;
  onSelect?: (job: JobItem) => void;
}

/**
 * Animated Circular Progress for AI Match Score
 */
function CircularProgress({ score }: { score: number }) {
  const radius = 22;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color scheme based on match quality
  let strokeColor = "#10b981"; // emerald-500 (90%+)
  let textColor = "text-emerald-600 dark:text-emerald-400";
  let badgeBg = "bg-emerald-50 dark:bg-emerald-950/60";

  if (score < 75) {
    strokeColor = "#f59e0b"; // amber-500
    textColor = "text-amber-600 dark:text-amber-400";
    badgeBg = "bg-amber-50 dark:bg-amber-950/60";
  } else if (score < 90) {
    strokeColor = "#6366f1"; // indigo-500
    textColor = "text-indigo-600 dark:text-indigo-400";
    badgeBg = "bg-indigo-50 dark:bg-indigo-950/60";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 56 56">
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated score circle */}
          <motion.circle
            cx="28"
            cy="28"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Score label in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xs font-extrabold ${textColor} leading-none`}>
            {score}%
          </span>
        </div>
      </div>

      <div className="hidden sm:block text-left">
        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          AI Match
        </div>
        <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold ${textColor} ${badgeBg}`}>
          {score >= 90 ? "Excellent Fit" : score >= 75 ? "Strong Match" : "Moderate Fit"}
        </span>
      </div>
    </div>
  );
}

export function JobCard({ job, onSaveToggle, onSelect }: JobCardProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (onSaveToggle) onSaveToggle(job.id, nextSaved);
  };

  // Generate initials for company monogram
  const initials = job.company
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect && onSelect(job)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
    >
      <div>
        {/* Header: Company Monogram, Title, and Circular Score */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Company Avatar / Monogram */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-inner border border-slate-200/60 dark:border-slate-700/60">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {job.company}
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  {job.type}
                </span>
              </div>
              <h3 className="mt-0.5 font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Match Score Circular Progress */}
          <div className="shrink-0">
            <CircularProgress score={job.matchScore} />
          </div>
        </div>

        {/* Metadata Details Row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <DollarSign className="h-3.5 w-3.5" />
            {job.salary}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {job.postedDate}
          </span>
        </div>

        {/* Snippet / Summary */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.descriptionSnippet}
        </p>

        {/* Tech Stack Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions: Bookmark, Inspect & Career Link */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleSave}
          aria-label={isSaved ? "Remove from saved" : "Save job"}
          className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
            isSaved
              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="h-4 w-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(job);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 text-xs font-semibold transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI Actions</span>
          </button>

          <a
            href={job.careerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <span>Career</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
