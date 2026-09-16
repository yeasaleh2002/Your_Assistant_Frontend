"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Radar,
  Bookmark,
  Sparkles,
  Briefcase,
  Sliders,
  X,
  Zap,
  LogOut,
  Building2,
  FileCheck,
} from "lucide-react";

import { type AuthUser } from "@/services/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

const DASHBOARD_NAV = [
  {
    href: "/dashboard",
    label: "Job Radar",
    icon: Radar,
    badge: "Live",
    badgeType: "live",
  },
  {
    href: "/builder",
    label: "Resume & Cover Engine",
    icon: FileCheck,
    badge: "New",
    badgeType: "new",
  },
  {
    href: "/dashboard/tailor",
    label: "JD Tailor Studio",
    icon: Sparkles,
    badge: "AI RAG",
    badgeType: "new",
  },
  {
    href: "/dashboard/companies",
    label: "Company Directory",
    icon: Building2,
    badge: "100+",
  },
  {
    href: "/dashboard#saved",
    label: "Saved Roles",
    icon: Bookmark,
    badge: "4",
  },
  {
    href: "/dashboard#applications",
    label: "Applications",
    icon: Briefcase,
    badge: "12",
  },
  {
    href: "/dashboard#settings",
    label: "Radar Settings",
    icon: Sliders,
  },
];

export function Sidebar({ isOpen, onClose, currentUser, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Brand Header & Mobile Close — scrollable nav area */}
        <div className="overflow-y-auto flex-1">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-none">
                  Your Assistant
                </span>
                <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Job Intelligence
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </div>
            {DASHBOARD_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || (pathname?.startsWith(item.href) && !item.href.includes("#"));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition duration-150 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {/* Badges */}
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.badgeType === "live"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
                          : item.badgeType === "new"
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.badgeType === "live" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Quota & User Profile */}
        <div className="p-4 space-y-4">
          {/* Radar Quota Widget */}
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-tr from-indigo-50/70 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/20 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                Autonomous Scans
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">38 / 100</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-600" style={{ width: "38%" }} />
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              62 scans remaining today.
            </p>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/70 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs">
                {currentUser?.email ? currentUser.email.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser?.role === "admin" ? "Administrator" : "User"}
                </p>
                <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {currentUser?.email || "admin@yourassistant.com"}
                </p>
              </div>
            </div>

            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/login"
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
