"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Loader2,
  CheckCircle2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { type JobItem } from "./job-card";

interface JobActionModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type ActionState = "idle" | "processing" | "success";

export function JobActionModal({ job, isOpen, onClose }: JobActionModalProps) {
  // Action Button States
  const [atsState, setAtsState] = React.useState<ActionState>("idle");
  const [atsProgressMsg, setAtsProgressMsg] = React.useState("AI is analyzing keywords...");
  const [atsDownloaded, setAtsDownloaded] = React.useState(false);

  const [emailState, setEmailState] = React.useState<ActionState>("idle");
  const [emailProgressMsg, setEmailProgressMsg] = React.useState("AI is crafting pitch...");
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  // Handle ESC key to dismiss modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!job) return null;

  // Handle ATS Generation Simulation
  const handleGenerateATS = () => {
    setAtsState("processing");
    setAtsProgressMsg("AI is parsing job requirements & skills...");
    setTimeout(() => {
      setAtsProgressMsg("Injecting semantic keywords & ATS formatting...");
    }, 1200);
    setTimeout(() => {
      setAtsState("success");
    }, 2400);
  };

  // Handle Cold Email Generation Simulation
  const handleWriteColdEmail = () => {
    setEmailState("processing");
    setEmailProgressMsg("Analyzing hiring manager profile & company voice...");
    setTimeout(() => {
      setEmailProgressMsg("Synthesizing personalized hook and portfolio highlights...");
    }, 1200);
    setTimeout(() => {
      setEmailState("success");
    }, 2400);
  };

  const handleCopyEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const emailDraftContent = `Subject: Application for ${job.title} – Alex Morgan

Hi ${job.company} Talent Team,

I recently tracked your opening for the ${job.title} role and noticed your focus on ${job.tags.slice(0, 2).join(" and ")}.

Over the past 5+ years, I have architected high-performance web systems and autonomous agent workflows with Next.js and TypeScript, driving a 42% reduction in latency and maintaining 99.98% SLA across mission-critical microservices.

I've attached my tailored resume for your review and would welcome 10 minutes to discuss how my background aligns with your engineering objectives.

Best regards,
Alex Morgan
alex@assistant.ai • github.com/alexmorgan`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header: Company, Title, Close Button */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800/80 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-3.5 pr-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-base shadow-md shadow-indigo-500/20">
                  {job.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      {job.company}
                    </span>
                    <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="h-3 w-3" /> {job.matchScore}% Match
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* Quick Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 p-3.5 border border-slate-200/60 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {job.postedDate}
                </span>
                <a
                  href={job.careerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  <span>Official Posting</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* AI ACTION TOOLS CARD (Key Requirement) */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-tr from-indigo-50/70 via-purple-50/40 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      AI Application Accelerators
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                    Instant Generation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* BUTTON 1: GENERATE ATS PDF */}
                  <div className="flex flex-col">
                    {atsState === "idle" && (
                      <button
                        type="button"
                        onClick={handleGenerateATS}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-105 active:scale-[0.98]"
                      >
                        <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>Generate ATS PDF</span>
                      </button>
                    )}

                    {atsState === "processing" && (
                      <div className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white/80 dark:bg-slate-900 px-4 py-3 text-xs font-semibold text-indigo-600 dark:text-indigo-300 shadow-sm animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{atsProgressMsg}</span>
                      </div>
                    )}

                    {atsState === "success" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                          <span className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ATS PDF Ready (98% match)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAtsState("idle");
                              setAtsDownloaded(false);
                            }}
                            title="Regenerate"
                            className="p-1 hover:bg-emerald-200/50 dark:hover:bg-emerald-900 rounded text-emerald-700 dark:text-emerald-400"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAtsDownloaded(true)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-semibold shadow transition"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{atsDownloaded ? "PDF Downloaded!" : "Download Tailored PDF"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BUTTON 2: WRITE COLD EMAIL */}
                  <div className="flex flex-col">
                    {emailState === "idle" && (
                      <button
                        type="button"
                        onClick={handleWriteColdEmail}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm transition hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-[0.98]"
                      >
                        <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>Write Cold Email</span>
                      </button>
                    )}

                    {emailState === "processing" && (
                      <div className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white/80 dark:bg-slate-900 px-4 py-3 text-xs font-semibold text-purple-600 dark:text-purple-300 shadow-sm animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="truncate">{emailProgressMsg}</span>
                      </div>
                    )}

                    {emailState === "success" && (
                      <div className="flex items-center justify-between rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 p-2.5 text-xs text-purple-800 dark:text-purple-300">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                          Draft Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => setEmailState("idle")}
                          title="Regenerate"
                          className="p-1 hover:bg-purple-200/50 dark:hover:bg-purple-900 rounded text-purple-700 dark:text-purple-400"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generated Cold Email Preview Drawer (when success) */}
                <AnimatePresence>
                  {emailState === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl border border-purple-200/80 dark:border-purple-900/80 bg-white dark:bg-slate-900 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Tailored Outreach Email
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(emailDraftContent)}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                        >
                          {copiedEmail ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="font-sans text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {emailDraftContent}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SECTION: FULL JOB DESCRIPTION */}
              <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    About The Role
                  </h3>
                  <p>
                    {job.company} is seeking an exceptional <strong>{job.title}</strong> to join the core engineering team. In this position, you will own the end-to-end design, execution, and scaling of mission-critical systems and agentic primitives. You will collaborate closely with AI research, infrastructure, and product design partners to define the next generation of software capabilities.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    Key Responsibilities
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li>Design resilient distributed architectures capable of handling high-concurrency requests with sub-150ms latency.</li>
                    <li>Collaborate with cross-functional product teams to turn ambiguous technical requirements into verifiable production code.</li>
                    <li>Build and maintain developer tools, SDKs, and automated regression suites.</li>
                    <li>Lead technical RFCs, conduct rigorous code reviews, and mentor team engineers on best practices.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    Qualifications & Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li>3+ years experience with production TypeScript, Node.js, and modern React / Next.js ecosystems.</li>
                    <li>Strong understanding of server actions, streaming rendering, and state hydration.</li>
                    <li>Experience with Docker containerization, PostgreSQL/pgvector, and CI/CD pipelines.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    Compensation & Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                      <span className="font-semibold text-slate-900 dark:text-white">Base Salary:</span> {job.salary} + Equity
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                      <span className="font-semibold text-slate-900 dark:text-white">Healthcare:</span> 100% Medical, Dental, Vision
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                      <span className="font-semibold text-slate-900 dark:text-white">Remote Stipend:</span> $2,500 Home Office Setup
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                      <span className="font-semibold text-slate-900 dark:text-white">Time Off:</span> Flexible Paid Time Off (PTO)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>

              <a
                href={job.careerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow transition active:scale-95"
              >
                <span>Apply on Official Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
