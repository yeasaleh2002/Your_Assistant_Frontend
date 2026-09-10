"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Globe,
  MapPin,
  Briefcase,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiService, type Company, type CompanyQueryParams } from "@/services/api";

const PRESET_COUNTRIES = [
  "All Countries",
  "Saudi Arabia",
  "UAE",
  "Malaysia",
  "Egypt",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Jordan",
  "United States",
  "United Kingdom",
];

const QUICK_FILTERS = [
  { id: "all", label: "All Companies", icon: Building2 },
  { id: "2026_ai", label: "2026 AI Startups", icon: Zap, year: 2026 },
  { id: "saudi", label: "Saudi Arabia", icon: MapPin, country: "Saudi Arabia" },
  { id: "uae", label: "UAE / Dubai", icon: MapPin, country: "UAE" },
  { id: "malaysia", label: "Malaysia", icon: MapPin, country: "Malaysia" },
  { id: "remote", label: "Worldwide Remote", icon: Globe, remote_policy: "Remote" },
];

export function CompanyDirectory() {
  // Query parameters state
  const [search, setSearch] = React.useState("");
  const [country, setCountry] = React.useState("All Countries");
  const [yearFilter, setYearFilter] = React.useState<number | null>(null);
  const [remotePolicy, setRemotePolicy] = React.useState("All");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(12);

  // Active quick filter ID
  const [activeQuickFilter, setActiveQuickFilter] = React.useState<string>("all");

  // View state: grid vs table
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

  // Data states
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch companies whenever filters or page change
  React.useEffect(() => {
    let active = true;
    async function loadCompanies() {
      setIsLoading(true);
      try {
        const query: CompanyQueryParams = {
          page,
          limit,
          sort: sortOrder,
        };

        if (search.trim()) query.search = search.trim();
        if (country !== "All Countries") query.country = country;
        if (yearFilter !== null) query.year = yearFilter;
        if (remotePolicy !== "All") query.remote_policy = remotePolicy;

        const res = await apiService.getCompanies(query);
        if (active) {
          setCompanies(res.items || []);
          setTotal(res.total || 0);
          setTotalPages(res.total_pages || 1);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "Failed to load company directory.";
          toast.error(`Directory error: ${msg}`);
          setCompanies([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCompanies();
    return () => {
      active = false;
    };
  }, [page, limit, sortOrder, search, country, yearFilter, remotePolicy]);

  // Search input handler with submit on Enter or button
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleQuickFilterSelect = (filter: (typeof QUICK_FILTERS)[number]) => {
    setActiveQuickFilter(filter.id);
    setPage(1);
    if (filter.id === "all") {
      setCountry("All Countries");
      setYearFilter(null);
      setRemotePolicy("All");
    } else if (filter.id === "2026_ai") {
      setCountry("All Countries");
      setYearFilter(2026);
      setRemotePolicy("All");
    } else if (filter.country) {
      setCountry(filter.country);
      setYearFilter(null);
      setRemotePolicy("All");
    } else if (filter.remote_policy) {
      setCountry("All Countries");
      setYearFilter(null);
      setRemotePolicy(filter.remote_policy);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCountry("All Countries");
    setYearFilter(null);
    setRemotePolicy("All");
    setSortOrder("newest");
    setActiveQuickFilter("all");
    setPage(1);
  };

  const parseTechStack = (techStackStr?: string): string[] => {
    if (!techStackStr) return [];
    return techStackStr
      .split(/[,|•]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length < 30);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ================= HEADER HERO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5 text-indigo-300" />
              <span>Verified Real Companies & AI Startups Directory</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Target Company Intelligence & Careers
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200/85 leading-relaxed">
              Explore 100+ verified software companies actively hiring across Saudi Arabia, UAE, Malaysia, Egypt, Qatar, Kuwait, Jordan, and 2026 Autonomous AI startups. Connect directly with career portals or tailor your resume in 1 click.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md min-w-[110px]">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {total > 0 ? total : "100+"}
              </div>
              <div className="text-[11px] font-medium text-slate-300">Verified Companies</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md min-w-[110px]">
              <div className="text-2xl sm:text-3xl font-black text-indigo-300">
                2026
              </div>
              <div className="text-[11px] font-medium text-slate-300">AI Startups Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUICK FILTER PILLS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {QUICK_FILTERS.map((qf) => {
          const Icon = qf.icon;
          const isActive = activeQuickFilter === qf.id;
          return (
            <button
              key={qf.id}
              type="button"
              onClick={() => handleQuickFilterSelect(qf)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition whitespace-nowrap shadow-sm ${
                isActive
                  ? "bg-indigo-600 text-white shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{qf.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SEARCH & ADVANCED FILTERS BAR ================= */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
        >
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, tech stack (FastAPI, React, Python), or keywords..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Dropdowns Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            {/* Country Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                Country:
              </span>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setActiveQuickFilter("custom");
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {PRESET_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Founded Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-purple-500" />
                Year:
              </span>
              <select
                value={yearFilter === null ? "All" : String(yearFilter)}
                onChange={(e) => {
                  const val = e.target.value;
                  setYearFilter(val === "All" ? null : parseInt(val, 10));
                  setActiveQuickFilter("custom");
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="All">All Years</option>
                <option value="2026">2026 AI Startups</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2020">2020</option>
              </select>
            </div>

            {/* Remote Policy Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-emerald-500" />
                Policy:
              </span>
              <select
                value={remotePolicy}
                onChange={(e) => {
                  setRemotePolicy(e.target.value);
                  setActiveQuickFilter("custom");
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="All">All Work Policies</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Reset Filters & View Switcher */}
          <div className="flex items-center gap-3">
            {(search || country !== "All Countries" || yearFilter !== null || remotePolicy !== "All") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear Filters</span>
              </button>
            )}

            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table view"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOTAL & RESULTS COUNT ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Target Companies
          </h3>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {isLoading ? "Loading..." : `${total} companies found`}
          </span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Page {page} of {totalPages}
        </div>
      </div>

      {/* ================= MAIN CONTENT (GRID OR TABLE) ================= */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 p-6 animate-pulse space-y-4"
              >
                <div className="h-6 w-1/2 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-850" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <Building2 className="h-7 w-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              No companies match your filters
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search keywords, country selection, or work policy filters to find more target companies.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-semibold shadow hover:bg-indigo-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {companies.map((co) => {
              const techChips = parseTechStack(co.tech_stack);
              const careerLink = co.careers_page || co.career_page || co.website;
              const is2026 = co.founded_year === 2026;

              return (
                <div
                  key={co.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Name & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                          {co.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                          <span>
                            {co.city ? `${co.city}, ` : ""}
                            {co.country}
                          </span>
                        </div>
                      </div>

                      {/* Founded Year Badge */}
                      <span
                        className={`rounded-xl px-2.5 py-1 text-[11px] font-bold shrink-0 ${
                          is2026
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-1"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {is2026 && <Zap className="h-3 w-3 text-purple-500" />}
                        {co.founded_year}
                      </span>
                    </div>

                    {/* Industry & Remote Policy */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 text-[11px] font-semibold">
                        {co.industry}
                      </span>
                      {co.remote_policy && (
                        <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold">
                          {co.remote_policy}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {co.description}
                    </p>

                    {/* Tech Stack Chips */}
                    {techChips.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Tech Stack
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {techChips.slice(0, 5).map((chip, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:text-slate-300"
                            >
                              {chip}
                            </span>
                          ))}
                          {techChips.length > 5 && (
                            <span className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-500">
                              +{techChips.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {co.website && (
                        <a
                          href={co.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                          title="Visit official website"
                        >
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          <span>Website</span>
                        </a>
                      )}

                      {careerLink && (
                        <a
                          href={careerLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                          title="View open positions"
                        >
                          <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                          <span>Careers</span>
                        </a>
                      )}
                    </div>

                    {/* Direct 1-Click Jump to Tailor Studio */}
                    <Link
                      href={`/dashboard/tailor?company=${encodeURIComponent(co.name)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Tailor Resume</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          /* ================= TABLE VIEW ================= */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Industry</th>
                    <th className="px-6 py-4">Founded</th>
                    <th className="px-6 py-4">Remote Policy</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {companies.map((co) => {
                    const careerLink = co.careers_page || co.career_page || co.website;
                    return (
                      <tr
                        key={co.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          <div>{co.name}</div>
                          <div className="text-[11px] font-normal text-slate-500 truncate max-w-xs">
                            {co.tech_stack}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {co.city ? `${co.city}, ` : ""}
                          {co.country}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {co.industry}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                              co.founded_year === 2026
                                ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {co.founded_year}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-xs font-semibold">
                            {co.remote_policy || "Flexible"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {careerLink && (
                              <a
                                href={careerLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Briefcase className="h-3 w-3" />
                                <span>Careers</span>
                              </a>
                            )}
                            <Link
                              href={`/dashboard/tailor?company=${encodeURIComponent(co.name)}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 text-xs font-semibold shadow"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>Tailor</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PAGINATION CONTROLS ================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
