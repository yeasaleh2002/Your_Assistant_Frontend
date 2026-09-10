"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  Mail,
  FileCheck2,
  Download,
  Copy,
  Check,
  Send,
  Loader2,
  Building2,
  Briefcase,
  AtSign,
  ArrowRight,
  RotateCcw,
  Sliders,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  apiService,
  type JobDescriptionTailorRequest,
  type JobDescriptionTailorResponse,
} from "@/services/api";

const SAMPLE_JD = {
  job_title: "Senior Full Stack Engineer",
  company: "TechNova Solutions",
  recruiter_email: "careers@technova.io",
  job_description: `TechNova Solutions is seeking an experienced Senior Full Stack Engineer to lead the architecture and implementation of our next-generation cloud collaboration platform.

Responsibilities:
- Architect, build, and maintain scalable web applications using Next.js, React, TypeScript, and Node.js.
- Design and integrate high-throughput RESTful and GraphQL APIs with PostgreSQL and Supabase.
- Optimize web application performance, core web vitals, and backend latency.
- Collaborate with product designers and AI engineers to deliver intuitive, responsive user experiences.
- Implement automated testing, CI/CD pipelines, and cloud deployments on AWS/Vercel.

Requirements:
- 4+ years of professional full-stack software development experience.
- Deep expertise in TypeScript, React, Next.js, and modern CSS/Tailwind.
- Proven experience with backend services (Node.js/FastAPI) and relational databases (PostgreSQL).
- Strong understanding of state management, async patterns, and caching strategies.
- Excellent communication skills and passion for building high-quality software.

To apply, submit your resume or reach out to our talent team at careers@technova.io.`,
};

export function JobTailorStudio() {
  // Input states
  const [jobDescription, setJobDescription] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [recruiterEmail, setRecruiterEmail] = React.useState("");
  const [baseResumeText, setBaseResumeText] = React.useState("");
  const [showAdvancedResume, setShowAdvancedResume] = React.useState(false);

  // Processing & result states
  const [isTailoring, setIsTailoring] = React.useState(false);
  const [tailorStep, setTailorStep] = React.useState("");
  const [result, setResult] = React.useState<JobDescriptionTailorResponse | null>(null);

  // Active tab state in result view
  const [activeTab, setActiveTab] = React.useState<"resume" | "email" | "cover_letter">("resume");

  // Editable email body state
  const [editableEmailBody, setEditableEmailBody] = React.useState("");

  // Copy indicator states
  const [copiedResume, setCopiedResume] = React.useState(false);
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedSubject, setCopiedSubject] = React.useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = React.useState(false);

  const handleFillSample = () => {
    setJobDescription(SAMPLE_JD.job_description);
    setJobTitle(SAMPLE_JD.job_title);
    setCompany(SAMPLE_JD.company);
    setRecruiterEmail(SAMPLE_JD.recruiter_email);
    toast.success("Sample Job Description populated!");
  };

  const handleClear = () => {
    setJobDescription("");
    setJobTitle("");
    setCompany("");
    setRecruiterEmail("");
    setBaseResumeText("");
    setEditableEmailBody("");
    setResult(null);
  };

  const handleTailor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 15) {
      toast.error("Please provide a job description (minimum 15 characters).");
      return;
    }

    setIsTailoring(true);
    setResult(null);
    setTailorStep("Running Vector RAG cosine match against base resume...");

    const payload: JobDescriptionTailorRequest = {
      job_description: jobDescription.trim(),
      job_title: jobTitle.trim() || null,
      company: company.trim() || null,
      recruiter_email: recruiterEmail.trim() || null,
      base_resume_text: baseResumeText.trim() || null,
    };

    try {
      setTimeout(() => {
        setTailorStep("Generating 100% ATS-friendly PDF with ReportLab...");
      }, 2500);

      setTimeout(() => {
        setTailorStep("Crafting personalized recruiter cold email & cover letter...");
      }, 5000);

      const data = await apiService.tailorJobDescription(payload);
      setResult(data);
      if (data.cold_email?.body) {
        setEditableEmailBody(data.cold_email.body);
      }
      toast.success(
        `Tailored successfully! Match Score: ${data.match_score.toFixed(1)}%`,
        { icon: "🎯" }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to tailor job description.";
      toast.error(`Tailoring error: ${msg}`);
    } finally {
      setIsTailoring(false);
      setTailorStep("");
    }
  };

  const handleDownloadPdf = () => {
    if (!result?.download_url) return;
    apiService.downloadTailoredPdf(result.download_url, result.pdf_filename);
    toast.success(`Downloading ${result.pdf_filename || "tailored_resume.pdf"}...`);
  };

  const copyToClipboard = async (text: string, type: "resume" | "email" | "subject" | "cover") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "resume") {
        setCopiedResume(true);
        setTimeout(() => setCopiedResume(false), 2000);
      } else if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === "subject") {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else if (type === "cover") {
        setCopiedCoverLetter(true);
        setTimeout(() => setCopiedCoverLetter(false), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  // Build mailto URL for cold email
  const mailtoUrl = React.useMemo(() => {
    if (!result?.cold_email) return "#";
    const recipient = result.cold_email.recruiter_email || recruiterEmail || "";
    const subject = encodeURIComponent(result.cold_email.subject || "");
    const body = encodeURIComponent(editableEmailBody || result.cold_email.body || "");
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  }, [result, recruiterEmail, editableEmailBody]);

  return (
    <div className="space-y-8 pb-16">
      {/* ================= HEADER HERO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>Direct Job Description Tailoring Studio</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Instant ATS Resume & Outreach Package
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200/85 leading-relaxed">
              Paste any raw job description from LinkedIn, Indeed, or career portals. The AI computes vector RAG cosine similarity, replaces your target title dynamically, generates a 100% ATS-friendly PDF, and writes cold outreach drafts ready to send.
            </p>
          </div>

          {/* Quick Helper Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/30 bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-200 backdrop-blur-md transition active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Load Sample Job</span>
            </button>
            {(jobDescription || result) && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 hover:bg-slate-850 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 transition active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= INPUT FORM ================= */}
      <form onSubmit={handleTailor} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Job Description & Target Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste the full posting. Optional fields will be auto-inferred by the backend if omitted.
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {jobDescription.length} characters
          </span>
        </div>

        {/* Textarea for Job Description */}
        <div className="space-y-2">
          <label
            htmlFor="job-description-input"
            className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Raw Job Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="job-description-input"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste raw job description here (responsibilities, technical requirements, tech stack, recruiter contact details)..."
            required
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition resize-y font-mono leading-relaxed"
          />
        </div>

        {/* Optional Metadata Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Target Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
              <span>Target Job Title (Optional)</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior React Engineer"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Target Company */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-purple-500" />
              <span>Company Name (Optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechNova Corp"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Recruiter Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AtSign className="h-3.5 w-3.5 text-emerald-500" />
              <span>Recruiter Email (Optional)</span>
            </label>
            <input
              type="email"
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              placeholder="e.g. careers@technova.io"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        {/* Optional Custom Base Resume Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowAdvancedResume(!showAdvancedResume)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>
              {showAdvancedResume
                ? "Hide custom base resume override"
                : "Override server default resume.txt (Advanced)"}
            </span>
          </button>

          {showAdvancedResume && (
            <div className="mt-3 space-y-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Leave empty to automatically use your default profile resume (`data/resume.txt`).
              </p>
              <textarea
                value={baseResumeText}
                onChange={(e) => setBaseResumeText(e.target.value)}
                rows={4}
                placeholder="Optional: Paste custom plain-text base resume..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}
        </div>

        {/* Submission Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>FastAPI Vector RAG Engine • ReportLab PDF Compiler Active</span>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isTailoring || jobDescription.trim().length < 15}
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base px-7 py-3.5 shadow-xl shadow-indigo-600/30 transition disabled:opacity-50 disabled:pointer-events-none"
            id="tailor-submit-button"
          >
            {isTailoring ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Tailoring Package...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Tailor Resume & Outreach Package</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>

        {/* Live Step Progress Indicator */}
        <AnimatePresence>
          {isTailoring && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/50 p-4 text-xs font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-3"
            >
              <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
              <span>{tailorStep || "Processing your job description..."}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* ================= RESULTS VIEW ================= */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Match Score & Summary Hero Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Score & Job Info */}
              <div className="flex items-start sm:items-center gap-5">
                {/* Circular Score Badge */}
                <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 flex-col items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/15 to-emerald-500/10 border-2 border-indigo-500/30 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {result.match_score.toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                    RAG Match
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-3 py-1 text-xs font-bold flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800/80">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      100% ATS-Friendly PDF Ready
                    </span>
                    {result.company && (
                      <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-semibold">
                        {result.company}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {result.job_title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Target title dynamically substituted across professional summary, technical competencies, and outreach letters.
                  </p>
                </div>
              </div>

              {/* PDF Download Trigger Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 shadow-lg shadow-emerald-600/25 transition active:scale-95"
                  id="download-pdf-button"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Tailored PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive 3-Tab Container */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-2 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("resume")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === "resume"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>1. Tailored Resume</span>
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] px-2 py-0.5 font-mono">
                  ATS PDF
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === "email"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>2. Cold Outreach Email</span>
                <span className="rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-0.5 font-mono">
                  mailto: ready
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("cover_letter")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === "cover_letter"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileCheck2 className="h-4 w-4" />
                <span>3. Formal Cover Letter</span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 font-mono">
                  Formatted
                </span>
              </button>
            </div>

            {/* Tab 1 Content: Tailored Resume */}
            {activeTab === "resume" && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Compiled Markdown Preview & ReportLab ATS PDF Source
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(result.tailored_resume_markdown, "resume")
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                    >
                      {copiedResume ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Copied Markdown</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-semibold shadow transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-5 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">
                  {result.tailored_resume_markdown}
                </div>
              </div>
            )}

            {/* Tab 2 Content: Cold Email Draft */}
            {activeTab === "email" && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Personalized Outreach Email Pitch
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(editableEmailBody, "email")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Copied Email</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-1.5 text-xs font-bold shadow transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Open in Mail Client (mailto:)</span>
                    </a>
                  </div>
                </div>

                {/* Recruiter Email & Subject Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3.5 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      To (Recruiter Email)
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {result.cold_email.recruiter_email || recruiterEmail || "recruiter@company.com"}
                      </span>
                      {result.cold_email.recruiter_email && (
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(result.cold_email.recruiter_email, "subject")
                          }
                          className="text-slate-400 hover:text-indigo-500 p-1"
                          title="Copy email"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3.5 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Subject Line
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                        {result.cold_email.subject}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.cold_email.subject, "subject")}
                        className="text-slate-400 hover:text-indigo-500 p-1 shrink-0"
                        title="Copy subject"
                      >
                        {copiedSubject ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editable Body Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Body (Fully Editable)
                  </label>
                  <textarea
                    rows={10}
                    value={editableEmailBody}
                    onChange={(e) => setEditableEmailBody(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
                  />
                </div>

                {/* Supplementary Metadata */}
                {(result.cold_email.portfolio_link || result.cold_email.call_to_action) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {result.cold_email.portfolio_link && (
                      <a
                        href={result.cold_email.portfolio_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-3 py-1 text-xs font-semibold hover:underline"
                      >
                        <span>Portfolio: {result.cold_email.portfolio_link}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {result.cold_email.call_to_action && (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-xs font-medium">
                        CTA: &quot;{result.cold_email.call_to_action}&quot;
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3 Content: Formal Cover Letter */}
            {activeTab === "cover_letter" && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Formal Cover Letter Document
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(result.cover_letter, "cover")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                  >
                    {copiedCoverLetter ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Copied Cover Letter</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Cover Letter</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-6 sm:p-8 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-serif max-h-[600px] overflow-y-auto">
                  {result.cover_letter}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
