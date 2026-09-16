"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useJobMatches } from "@/hooks/use-job-matches";
import { ExpandableJobCard } from "./expandable-job-card";
import { staggerListVariants, staggerItemVariants, buttonInteractionVariants } from "@/lib/animations";

export function SmartJobMatchDashboard() {
  const {
    jobs,
    totalCount,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    minMatchScore,
    setMinMatchScore,
    selectedStatus,
    setSelectedStatus,
    expandedJobId,
    toggleExpand,
    handleUpdateStatus,
    refetch,
  } = useJobMatches();

  const [layoutMode, setLayoutMode] = React.useState<"grid" | "list">("grid");

  // Status counters
  const statusCounts = React.useMemo(() => {
    return {
      all: totalCount,
      pending: jobs.filter((j) => j.status === "Pending").length,
      applied: jobs.filter((j) => j.status === "Applied").length,
      interview: jobs.filter((j) => j.status === "Interview").length,
    };
  }, [jobs, totalCount]);

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Smart Job Matches
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              RAG Vector Matched
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time scraped roles evaluated against your target profile using semantic cosine embeddings.
          </p>
        </div>

        {/* Action button to AI Resume Builder */}
        <div className="flex items-center gap-3">
          <Link href="/builder">
            <motion.button
              variants={buttonInteractionVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20"
            >
              <FileCheck className="h-4 w-4" />
              <span>Open Resume Builder</span>
            </motion.button>
          </Link>

          <button
            type="button"
            onClick={refetch}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2.5 text-xs sm:text-sm font-medium transition"
            title="Refresh database jobs"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-indigo-500" : ""}`} />
            <span className="hidden sm:inline">Sync DB</span>
          </button>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, company, skill (e.g. Next.js, Python), or location..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          {/* Controls: Match Score Threshold + Layout Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Min Match Score Slider */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                Min Score:
              </span>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="h-1.5 w-20 sm:w-28 accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 min-w-[34px]">
                {minMatchScore}%
              </span>
            </div>

            {/* Layout Toggle (Grid vs List) */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setLayoutMode("grid")}
                className={`flex items-center justify-center h-8 w-8 rounded-lg transition ${
                  layoutMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("list")}
                className={`flex items-center justify-center h-8 w-8 rounded-lg transition ${
                  layoutMode === "list"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Layers className="h-3 w-3" /> Status:
          </span>
          {(["All", "Pending", "Applied", "Interview", "Rejected"] as const).map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`rounded-lg px-2.5 py-1 font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="pt-6 flex gap-2">
                <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white">
            No Matched Jobs Found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, lowering the match score slider, or trigger the live scraper to fetch new opportunities.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setMinMatchScore(0);
              setSelectedStatus("All");
            }}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={staggerListVariants}
          initial="hidden"
          animate="show"
          className={
            layoutMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col space-y-4"
          }
        >
          {jobs.map((job) => (
            <motion.div key={job.id} variants={staggerItemVariants}>
              <ExpandableJobCard
                job={job}
                isExpanded={expandedJobId === job.id}
                onToggleExpand={() => toggleExpand(job.id)}
                onStatusChange={handleUpdateStatus}
                layoutMode={layoutMode}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
