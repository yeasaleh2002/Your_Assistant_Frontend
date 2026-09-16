"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Mail,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileCheck2,
  Send,
  Loader2,
  FileSpreadsheet,
  ExternalLink,
} from "lucide-react";
import { useResumeGenerator, type BuilderStep } from "@/hooks/use-resume-generator";
import { RagLoadingAnimation } from "./rag-loading-animation";
import { MatchScoreRing } from "../dashboard/match-score-ring";
import {
  stepSlideVariants,
  buttonInteractionVariants,
} from "@/lib/animations";

export function ResumeBuilderEngine() {
  const searchParams = useSearchParams();
  const {
    currentStep,
    stepDirection,
    formState,
    updateField,
    loadSampleData,
    goToStep,
    generateTailoredResume,
    downloadAtsPdf,
    generateCoverLetter,
    resetBuilder,
    isGenerating,
    isDownloadingPdf,
    isGeneratingCoverLetter,
    tailorResult,
    coverLetterResult,
  } = useResumeGenerator();

  // Populate from URL params if arrived from a dashboard job card
  React.useEffect(() => {
    const titleParam = searchParams.get("title");
    const companyParam = searchParams.get("company");
    const emailParam = searchParams.get("email");

    if (titleParam) updateField("jobTitle", titleParam);
    if (companyParam) updateField("company", companyParam);
    if (emailParam) updateField("recruiterEmail", emailParam);
  }, [searchParams, updateField]);

  // Tab state in Step 4
  const [outputTab, setOutputTab] = React.useState<"resume" | "cover_letter" | "cold_email">("resume");
  const [copiedResume, setCopiedResume] = React.useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = React.useState(false);

  const handleCopy = (text: string, type: "resume" | "cover") => {
    navigator.clipboard.writeText(text);
    if (type === "resume") {
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    } else {
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-3 w-3" /> AI Tailoring Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ATS-Optimized & 100% Vector Matched
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Resume & Cover Letter Engine
          </h1>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { num: 1, label: "Role" },
            { num: 2, label: "Context" },
            { num: 3, label: "RAG Engine" },
            { num: 4, label: "Output" },
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <span>{s.num}</span>
                <span className="hidden md:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Multi-step Form Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <AnimatePresence mode="wait" custom={stepDirection}>
          {/* ========================================================================= */}
          {/* STEP 1: Target Role & Recruiter Metadata                                  */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={stepDirection}
              variants={stepSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Step 1: Specify Target Role & Employer
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Provide context so our AI agent can customize the professional summary, header, and outreach draft.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Job Title *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formState.jobTitle}
                      onChange={(e) => updateField("jobTitle", e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formState.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="e.g. Stripe or OpenAI"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hiring Manager or Recruiter Email (Optional for Cold Outreach)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={formState.recruiterEmail}
                      onChange={(e) => updateField("recruiterEmail", e.target.value)}
                      placeholder="e.g. talent@company.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick load sample button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={loadSampleData}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ⚡ Populate with Realistic Sample Data
                </button>

                <motion.button
                  variants={buttonInteractionVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="button"
                  onClick={() => goToStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-indigo-500/20"
                >
                  <span>Next: Input Job Description</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Input Job Description & Base Resume                               */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={stepDirection}
              variants={stepSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Step 2: Target Job Description & Base Context
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Paste the requirements from LinkedIn, Indeed, or the career page. The Vector RAG engine will extract keywords and align your experience.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Job Description * (Minimum 20 characters)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formState.jobDescription.length} characters
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={formState.jobDescription}
                  onChange={(e) => updateField("jobDescription", e.target.value)}
                  placeholder="Paste the full job description here (responsibilities, required tech stack, qualifications)..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Base Resume or Past Highlights (Optional - Defaults to your registered profile)
                </label>
                <textarea
                  rows={4}
                  value={formState.baseResumeText}
                  onChange={(e) => updateField("baseResumeText", e.target.value)}
                  placeholder="Paste any custom background, metrics, projects, or certifications you want highlighted..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-y"
                />
              </div>

              {/* Navigation buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Role</span>
                </button>

                <motion.button
                  variants={buttonInteractionVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="button"
                  disabled={!formState.jobDescription.trim() || isGenerating}
                  onClick={generateTailoredResume}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 text-sm font-semibold shadow-md shadow-indigo-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Tailored Resume (RAG)</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: Dedicated GSAP Loading State                                      */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={stepDirection}
              variants={stepSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="py-6"
            >
              <RagLoadingAnimation />
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: Output Studio & ATS Action Buttons                                */}
          {/* ========================================================================= */}
          {currentStep === 4 && tailorResult && (
            <motion.div
              key="step-4"
              custom={stepDirection}
              variants={stepSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              {/* Result Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <MatchScoreRing score={tailorResult.match_score} size={64} strokeWidth={5} />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {tailorResult.job_title || formState.jobTitle || "Tailored Position"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Target: {tailorResult.company || formState.company || "Target Company"}
                    </p>
                  </div>
                </div>

                {/* Primary Action Buttons (with Framer Motion tap & hover) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <motion.button
                    variants={buttonInteractionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    disabled={isDownloadingPdf}
                    onClick={downloadAtsPdf}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>Download ATS-Friendly PDF</span>
                  </motion.button>

                  <motion.button
                    variants={buttonInteractionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    disabled={isGeneratingCoverLetter}
                    onClick={() => {
                      generateCoverLetter();
                      setOutputTab("cover_letter");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50"
                  >
                    {isGeneratingCoverLetter ? (
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <span>Generate Cover Letter</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetBuilder}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="Start new tailoring session"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tabs: Tailored Resume vs Cover Letter vs Cold Email */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setOutputTab("resume")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    outputTab === "resume"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Tailored Resume (Markdown)
                </button>
                <button
                  type="button"
                  onClick={() => setOutputTab("cover_letter")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    outputTab === "cover_letter"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Formal Cover Letter
                </button>
                <button
                  type="button"
                  onClick={() => setOutputTab("cold_email")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    outputTab === "cold_email"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Cold Recruiter Email
                </button>
              </div>

              {/* Tab Content 1: Resume Markdown */}
              {outputTab === "resume" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Full Markdown source code ready for ATS compilation:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(tailorResult.tailored_resume_markdown, "resume")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {copiedResume ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 p-5 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {tailorResult.tailored_resume_markdown}
                  </div>
                </div>
              )}

              {/* Tab Content 2: Cover Letter */}
              {outputTab === "cover_letter" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Personalized ATS Cover Letter:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          coverLetterResult?.cover_letter || tailorResult.cover_letter || "",
                          "cover"
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {copiedCoverLetter ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Letter</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-6 text-sm text-slate-800 dark:text-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {coverLetterResult?.cover_letter ||
                      tailorResult.cover_letter ||
                      "Click 'Generate Cover Letter' above to generate."}
                  </div>
                </div>
              )}

              {/* Tab Content 3: Cold Recruiter Email */}
              {outputTab === "cold_email" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-400">Recipient:</span>{" "}
                      <span className="text-slate-900 dark:text-white font-medium">
                        {tailorResult.cold_email?.recruiter_email || formState.recruiterEmail || "Hiring Team"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Subject:</span>{" "}
                      <span className="text-slate-900 dark:text-white font-medium">
                        {tailorResult.cold_email?.subject || `Application for ${formState.jobTitle || "Role"}`}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm text-slate-800 dark:text-slate-200 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {tailorResult.cold_email?.body || "Email draft unavailable."}
                  </div>
                </div>
              )}

              {/* Return to dashboard link */}
              <div className="pt-4 flex justify-between items-center text-xs">
                <Link
                  href="/dashboard"
                  className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Matched Jobs
                </Link>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Modify Inputs & Re-run
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
