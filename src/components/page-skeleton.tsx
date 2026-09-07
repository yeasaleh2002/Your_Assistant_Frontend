import * as React from "react";

export function PageSkeleton({ title = "Loading page..." }: { title?: string }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <div className="mx-auto h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mx-auto h-10 w-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="mx-auto h-5 w-96 max-w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
      </div>

      {/* Content Skeleton Cards */}
      <div className="mt-12 space-y-6">
        <div className="h-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6" />
          <div className="h-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6" />
        </div>
      </div>
      <p className="sr-only">{title}</p>
    </div>
  );
}
