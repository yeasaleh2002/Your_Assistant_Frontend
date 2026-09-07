"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Send,
  Calendar,
  XCircle,
  Clock3,
} from "lucide-react";
import { type JobStatus } from "@/services/api";

export interface JobItem {
  id: string;
  numericId: number;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
  salary: string;
  matchScore: number; // >= 65
  postedDate: string;
  careerUrl: string;
  tags: string[];
  descriptionSnippet: string;
  status: JobStatus;
  scrapedDate?: string;
  recruiterEmail?: string | null;
}

interface JobCardProps {
  job: JobItem;
  index?: number;
  onSelect?: (job: JobItem) => void;
  onStatusChange?: (jobId: number, newStatus: JobStatus) => void;
}

/**
 * Animated Circular Progress for AI Match Score (Only >= 65% will be shown)
 */
function CircularProgress({ score }: { score: number }) {
  const radius = 22;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color scheme based on match quality
  let strokeColor = "#10b981"; // emerald-500 (80%+)
  let textColor = "text-emerald-600 dark:text-emerald-400";
  let badgeBg = "bg-emerald-50 dark:bg-emerald-950/60";
  let badgeText = "Excellent Fit";

  if (score < 70) {
    strokeColor = "#f59e0b"; // amber-500 (65-69%)
    textColor = "text-amber-600 dark:text-amber-400";
    badgeBg = "bg-amber-50 dark:bg-amber-950/60";
    badgeText = "65%+ Match";
  } else if (score < 80) {
    strokeColor = "#6366f1"; // indigo-500 (70-79%)
    textColor = "text-indigo-600 dark:text-indigo-400";
    badgeBg = "bg-indigo-50 dark:bg-indigo-950/60";
    badgeText = "Strong Match";
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        <svg className="h-12 w-12 sm:h-14 sm:w-14 -rotate-90 transform" viewBox="0 0 56 56">
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
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          RAG Fit
        </div>
        <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold ${textColor} ${badgeBg}`}>
          {badgeText}
        </span>
      </div>
    </div>
  );
}

const STATUS_CONFIG: Record<JobStatus, { label: string; icon: React.ComponentType<{ className?: string }>; style: string }> = {
  Pending: {
    label: "Pending",
    icon: Clock3,
    style: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
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

export function JobCard({ job, index = 0, onSelect, onStatusChange }: JobCardProps) {
  const [currentStatus, setCurrentStatus] = React.useState<JobStatus>(job.status || "Pending");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCurrentStatus(job.status || "Pending");
  }, [job.status]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleStatusSelect = (newStatus: JobStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);
    if (onStatusChange) {
      onStatusChange(job.numericId, newStatus);
    }
  };

  const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Pending;
  const StatusIcon = statusInfo.icon;

  // Generate initials for company avatar
  const initials = (job.company || "Co")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4), ease: "easeOut" }}
      onClick={() => onSelect && onSelect(job)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/8 cursor-pointer"
    >
      <div>
        {/* Header: Company Monogram, Title, and Circular Score */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: avatar + text */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-inner border border-slate-200/60 dark:border-slate-700/60">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-xs text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                  {job.company}
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                  {job.type}
                </span>
              </div>
              <h3 className="mt-0.5 font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Match Score Circular Progress (>= 65% only) */}
          <div className="shrink-0">
            <CircularProgress score={job.matchScore} />
          </div>
        </div>

        {/* Status Tracker & Metadata Row */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-y border-slate-100 dark:border-slate-800/80 py-2.5">
          {/* Status Dropdown / Badge */}
          <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold shadow-sm transition hover:brightness-95 ${statusInfo.style}`}
              title="Click to update application status"
            >
              <StatusIcon className="h-3.5 w-3.5" />
              <span>Status: {statusInfo.label}</span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-20 w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xl">
                {(["Pending", "Applied", "Interview", "Rejected"] as JobStatus[]).map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const Icon = cfg.icon;
                  const isSelected = currentStatus === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={(e) => handleStatusSelect(st, e)}
                      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        isSelected
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

          {/* Location & Date */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {job.postedDate}
            </span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.descriptionSnippet}
        </p>

        {/* Tech Stack Tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions: AI Actions & Career Link */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(job);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 text-xs font-semibold transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Tailor Resume / Email</span>
        </button>

        <a
          href={job.careerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <span>Apply</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}
