"use client";

import * as React from "react";
import gsap from "gsap";
import { Sparkles, CheckCircle2, Cpu, FileText, Binary } from "lucide-react";
import { createRagLoadingTimeline } from "@/lib/animations";

interface RagLoadingAnimationProps {
  statusMessage?: string;
}

const RAG_MILESTONES = [
  { id: 1, label: "Parsing Target Job Description & Skill Taxonomy", icon: FileText },
  { id: 2, label: "Computing Cosine Semantic Embeddings in Vector Store", icon: Binary },
  { id: 3, label: "Synthesizing High-Impact ATS Metric Bullet Points", icon: Cpu },
  { id: 4, label: "Compiling Clean 1-Page Layout & ReportLab PDF Binary", icon: Sparkles },
];

export function RagLoadingAnimation({
  statusMessage = "AI Vector RAG Engine Synthesizing Resume...",
}: RagLoadingAnimationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scannerRef = React.useRef<HTMLDivElement>(null);
  const ring1Ref = React.useRef<HTMLDivElement>(null);
  const ring2Ref = React.useRef<HTMLDivElement>(null);
  const ring3Ref = React.useRef<HTMLDivElement>(null);
  const progressNumRef = React.useRef<HTMLSpanElement>(null);
  const stepItemsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    if (
      !containerRef.current ||
      !scannerRef.current ||
      !ring1Ref.current ||
      !ring2Ref.current ||
      !ring3Ref.current ||
      !progressNumRef.current
    ) {
      return;
    }

    const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current];
    const validStepItems = stepItemsRef.current.filter((item): item is HTMLDivElement => item !== null);

    const tl = createRagLoadingTimeline({
      container: containerRef.current,
      scannerBeam: scannerRef.current,
      pulseRings: rings,
      stepItems: validStepItems,
      progressNumber: progressNumRef.current,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-8 shadow-xl backdrop-blur-md overflow-hidden text-center"
    >
      {/* Background Neural Pulse Rings (GSAP animated) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          ref={ring1Ref}
          className="absolute h-48 w-48 rounded-full border border-indigo-500/20 dark:border-indigo-400/20"
        />
        <div
          ref={ring2Ref}
          className="absolute h-72 w-72 rounded-full border border-indigo-500/15 dark:border-indigo-400/15"
        />
        <div
          ref={ring3Ref}
          className="absolute h-96 w-96 rounded-full border border-purple-500/10 dark:border-purple-400/10"
        />
      </div>

      {/* Center Flat Vector Document Scanner Graphic */}
      <div className="relative mx-auto flex h-28 w-24 items-center justify-center rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-slate-800/80 shadow-inner overflow-hidden">
        {/* Document Skeleton Lines */}
        <div className="w-full px-3 space-y-2">
          <div className="h-2 w-3/4 rounded bg-indigo-200 dark:bg-indigo-900/70 mx-auto" />
          <div className="h-1.5 w-full rounded bg-indigo-100 dark:bg-indigo-950" />
          <div className="h-1.5 w-5/6 rounded bg-indigo-100 dark:bg-indigo-950" />
          <div className="h-1.5 w-4/5 rounded bg-indigo-100 dark:bg-indigo-950" />
          <div className="h-1.5 w-full rounded bg-indigo-100 dark:bg-indigo-950" />
        </div>

        {/* GSAP Laser Scanner Beam */}
        <div
          ref={scannerRef}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_#6366f1]"
        />
      </div>

      {/* Progress Counter & Main Header */}
      <div className="mt-5">
        <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          <span>GSAP Neural Engine</span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
          {statusMessage}
        </h3>

        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Synthesizing ATS artifacts:
          </span>
          <span
            ref={progressNumRef}
            className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums"
          >
            0%
          </span>
        </div>
      </div>

      {/* Step Milestone Sequence (GSAP Timeline orchestrated) */}
      <div className="mt-6 space-y-2.5 text-left max-w-md mx-auto">
        {RAG_MILESTONES.map((milestone, idx) => {
          const Icon = milestone.icon;
          return (
            <div
              key={milestone.id}
              ref={(el) => {
                stepItemsRef.current[idx] = el;
              }}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 px-3.5 py-2 transition-all"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1">
                {milestone.label}
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 opacity-80" />
            </div>
          );
        })}
      </div>

      {/* Subtext info */}
      <p className="mt-5 text-[11px] text-slate-400 dark:text-slate-500">
        Deterministic ReportLab formatting ensures 100% readability by Workday, Greenhouse, & Lever parsers.
      </p>
    </div>
  );
}
