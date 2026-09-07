"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getAuthToken, removeAuthToken, apiService, type AuthUser } from "@/services/api";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please sign in to access the Dashboard.");
      router.replace("/login");
      return;
    }

    // Verify token with backend
    apiService
      .getMe()
      .then((user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsVerifying(false);
      })
      .catch(() => {
        removeAuthToken();
        toast.error("Session expired or unauthorized. Please sign in.");
        router.replace("/login");
      });
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    toast.success("Successfully logged out.");
    router.replace("/login");
  };

  // While checking auth, show an elegant full-screen loading state to avoid flash
  if (isVerifying || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
            <div className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Responsive Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area: offset by sidebar width on lg+ */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-72">
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
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
