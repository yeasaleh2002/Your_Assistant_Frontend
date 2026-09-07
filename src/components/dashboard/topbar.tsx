"use client";

import * as React from "react";
import { Menu, Bell, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopbarProps {
  onOpenSidebar: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Topbar({ onOpenSidebar, onRefresh, isRefreshing }: TopbarProps) {
  const [hasUnread, setHasUnread] = React.useState(true);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
      {/* Left side: Hamburger (mobile) & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-xl p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none lg:hidden"
          aria-label="Open sidebar"
          id="dashboard-mobile-sidebar-toggle"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Job Radar & Match Intelligence
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Real-Time Feed
            </span>
          </div>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            Automated multi-source scanner matching your tech stack & preferences.
          </p>
        </div>
      </div>

      {/* Right side: Quick Action, Notification Bell, ThemeToggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh / Scan button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-indigo-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Scanning..." : "Scan Now"}</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setHasUnread(false)}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-2 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}
        </button>

        {/* Theme Mode Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
