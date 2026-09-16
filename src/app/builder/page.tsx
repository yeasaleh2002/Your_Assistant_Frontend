import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ResumeBuilderEngine } from "@/components/builder/resume-builder-engine";

export const metadata: Metadata = {
  title: "AI Resume & Cover Letter Engine",
  description:
    "Generate ATS-optimized resumes and personalized cover letters with RAG vector matching and live GSAP loading telemetry.",
};

function BuilderLoadingFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl py-16 text-center space-y-4">
      <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto animate-pulse" />
      <div className="h-96 w-full bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse" />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<BuilderLoadingFallback />}>
        <ResumeBuilderEngine />
      </Suspense>
    </div>
  );
}
