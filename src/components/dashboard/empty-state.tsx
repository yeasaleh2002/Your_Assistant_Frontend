"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RotateCcw, Lightbulb } from "lucide-react";

interface EmptyStateProps {
  keyword?: string;
  onReset?: () => void;
}

export function EmptyState({ keyword, onReset }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8 sm:p-14 text-center"
    >
      {/* Custom Radar & Search Illustration */}
      <div className="relative flex h-36 w-36 items-center justify-center">
        {/* Animated radar scanning rings */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping opacity-75" />
        <div className="absolute h-28 w-28 rounded-full border border-indigo-500/30 dark:border-indigo-400/20" />
        <div className="absolute h-20 w-20 rounded-full border border-dashed border-indigo-500/40 dark:border-indigo-400/30 animate-[spin_10s_linear_infinite]" />

        {/* Central glowing icon container */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Decorative floating dots */}
        <div className="absolute top-2 right-4 h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
        <div className="absolute bottom-3 left-3 h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse" />
      </div>

      {/* Main Text */}
      <h3 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {keyword ? (
          <>
            No matching jobs found for &ldquo;<span className="text-indigo-600 dark:text-indigo-400">{keyword}</span>&rdquo;
          </>
        ) : (
          "No job listings available"
        )}
      </h3>

      <p className="mt-2.5 max-w-md text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Our autonomous radar scanned current openings but found no active listings meeting all your exact filters.
      </p>

      {/* Suggestion box */}
      <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4 text-left max-w-md text-xs text-slate-600 dark:text-slate-400">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-200">Tips to broaden your radar:</span>
          <ul className="mt-1 list-disc pl-4 space-y-0.5">
            <li>Try broader keywords like &ldquo;Engineer&rdquo;, &ldquo;Full Stack&rdquo;, or &ldquo;Python&rdquo;</li>
            <li>Double-check spelling or clear specialized filters</li>
          </ul>
        </div>
      </div>

      {/* Reset button */}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-white dark:text-slate-900 shadow transition hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Search & Filters</span>
        </button>
      )}
    </motion.div>
  );
}
