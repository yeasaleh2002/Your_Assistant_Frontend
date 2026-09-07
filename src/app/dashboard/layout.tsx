"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Responsive Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area: offset by sidebar width on lg+ */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-72">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
