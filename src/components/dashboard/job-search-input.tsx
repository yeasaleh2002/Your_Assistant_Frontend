"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShieldAlert, Sparkles } from "lucide-react";
import { sanitizeSearchKeyword } from "@/lib/xss-sanitizer";

interface JobSearchInputProps {
  value: string;
  onChange: (sanitizedValue: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

const QUICK_SUGGESTIONS = [
  "AI Engineer",
  "Next.js Developer",
  "Full Stack",
  "DevOps Specialist",
  "Python Agent Architect",
];

export function JobSearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search by job title, tech stack, or keywords (e.g. Next.js, AI Agent)...",
}: JobSearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [xssWarning, setXssWarning] = React.useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const result = sanitizeSearchKeyword(rawVal);

    if (result.warning) {
      setXssWarning(result.warning);
    } else {
      setXssWarning(null);
    }

    // Pass the sanitized value upstream
    onChange(result.sanitized);
  };

  const handleClear = () => {
    setXssWarning(null);
    onChange("");
    if (onClear) onClear();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setXssWarning(null);
    onChange(suggestion);
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input Container with Animated Border & Glow */}
      <motion.div
        animate={{
          scale: isFocused ? 1.005 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex items-center w-full rounded-2xl border transition-all duration-200 shadow-sm ${
          xssWarning
            ? "border-rose-400 dark:border-rose-600 bg-rose-50/30 dark:bg-rose-950/20 ring-2 ring-rose-500/20"
            : isFocused
            ? "border-indigo-500 dark:border-indigo-500 bg-white dark:bg-slate-900 ring-4 ring-indigo-500/15 dark:ring-indigo-500/20 shadow-md shadow-indigo-500/5"
            : "border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <div className="flex items-center pl-4 pr-2 text-slate-400 dark:text-slate-500">
          <motion.div
            animate={{ rotate: isFocused ? 90 : 0, scale: isFocused ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search className={`h-5 w-5 ${isFocused ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
          </motion.div>
        </div>

        <input
          type="text"
          id="job-keyword-search"
          name="job_keyword"
          autoComplete="off"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={100}
          className="w-full bg-transparent py-3.5 pr-10 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </motion.div>

      {/* XSS Warning Alert Banner */}
      <AnimatePresence>
        {xssWarning && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/60 px-3.5 py-2 text-xs font-medium text-rose-700 dark:text-rose-300 overflow-hidden"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{xssWarning}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Suggestion Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          Popular:
        </span>
        {QUICK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSelectSuggestion(suggestion)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition duration-150 ${
              value.toLowerCase() === suggestion.toLowerCase()
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
