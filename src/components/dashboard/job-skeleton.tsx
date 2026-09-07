import * as React from "react";

export function JobCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm animate-pulse">
      <div>
        {/* Header row skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Monogram avatar */}
            <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-12 rounded-full bg-slate-100 dark:bg-slate-800/80" />
              </div>
              <div className="h-5 w-48 sm:w-56 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Circular Score placeholder */}
          <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        </div>

        {/* Metadata row */}
        <div className="mt-5 flex items-center gap-4">
          <div className="h-3.5 w-24 rounded bg-slate-100 dark:bg-slate-800/70" />
          <div className="h-3.5 w-20 rounded bg-slate-100 dark:bg-slate-800/70" />
          <div className="h-3.5 w-16 rounded bg-slate-100 dark:bg-slate-800/70" />
        </div>

        {/* Description snippet lines */}
        <div className="mt-4 space-y-2">
          <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-3.5 w-4/5 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>

        {/* Tags pills */}
        <div className="mt-4 flex gap-2">
          <div className="h-5 w-14 rounded-md bg-slate-100 dark:bg-slate-800/80" />
          <div className="h-5 w-16 rounded-md bg-slate-100 dark:bg-slate-800/80" />
          <div className="h-5 w-12 rounded-md bg-slate-100 dark:bg-slate-800/80" />
        </div>
      </div>

      {/* Footer action bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <div className="h-7 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export function JobSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
