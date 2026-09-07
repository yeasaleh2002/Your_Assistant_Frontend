"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  Shield,
  Cpu,
  CheckCircle2,
  Play,
  Terminal,
  Database,
  GitBranch,
  Check,
  ChevronRight,
  Star,
} from "lucide-react";

// Interactive Prompt Simulation Data
const DEMO_PRESETS = [
  {
    id: "code",
    title: "Code Refactoring",
    prompt: "Scan our Next.js codebase for memory leaks and optimize server component bundles.",
    steps: [
      "Analyzing AST of 142 route files...",
      "Identified unmemoized callback in DashboardLayout.",
      "Replaced heavy client bundle with dynamic import.",
    ],
    result: "Bundle size reduced by 42%. Zero hydration mismatches detected.",
    metric: "-42% bundle size",
  },
  {
    id: "analytics",
    title: "SQL & Analytics",
    prompt: "Identify top churn indicators for enterprise accounts in Q3 and generate a summary.",
    steps: [
      "Querying PostgreSQL read replica...",
      "Correlating API usage drop with support ticket latency.",
      "Generating automated executive brief.",
    ],
    result: "Found correlation (r=0.87): Accounts waiting >4h for ticket responses churned 3x faster.",
    metric: "3x churn risk flag",
  },
  {
    id: "ops",
    title: "DevOps & Cron",
    prompt: "Run health probe on European edge servers, purge CDN cache if response > 250ms.",
    steps: [
      "Pinging FRA, LHR, AMS regions (Avg: 184ms)...",
      "FRA spike at 292ms; triggering Cloudflare cache invalidation.",
      "Latency normalized to 48ms across all nodes.",
    ],
    result: "All 18 edge clusters healthy. Health status webhook dispatched.",
    metric: "100% uptime sustained",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "Autonomous Agent Execution",
    description:
      "Deploy self-directed agents that break high-level goals into executable sub-tasks, recursively self-correcting errors.",
    tag: "Autonomous Core",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Database,
    title: "Persistent Context Memory",
    description:
      "Retain project history, conventions, schemas, and user preferences across days and sessions with zero context drift.",
    tag: "Knowledge Graph",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Cpu,
    title: "Multi-Tool Native Calling",
    description:
      "Execute browser interactions, terminal bash commands, SQL migrations, and external APIs in isolated sandboxes.",
    tag: "Tool Ecosystem",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Enterprise Sandboxing",
    description:
      "SOC2 Type II compliant execution with zero-trust role-based access control, cryptographic logs, and private VPC deployment.",
    tag: "SOC2 Certified",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Zap,
    title: "Sub-Second Latency",
    description:
      "Optimized streaming inference engine engineered for real-time collaboration with instant progressive token delivery.",
    tag: "<120ms Latency",
    gradient: "from-indigo-500 to-cyan-500",
  },
  {
    icon: GitBranch,
    title: "Continuous CI/CD Sync",
    description:
      "Seamlessly integrates with GitHub, GitLab, and Jira to automatically triage pull requests, review diffs, and generate tests.",
    tag: "DevOps Native",
    gradient: "from-rose-500 to-red-600",
  },
];

const STATS = [
  { value: "99.98%", label: "Uptime SLA", sub: "Enterprise Grade" },
  { value: "14M+", label: "Tasks Orchestrated", sub: "Global Workflows" },
  { value: "<120ms", label: "Token Response Time", sub: "Optimized Edge" },
  { value: "4.95 / 5", label: "Customer Satisfaction", sub: "From 2,400+ Teams" },
];

export default function HomePage() {
  const [activePreset, setActivePreset] = React.useState(DEMO_PRESETS[0]);

  const handleSelectPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setActivePreset(preset);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-3xl dark:from-indigo-600/15 dark:via-purple-600/15 dark:to-transparent" />
      <div className="pointer-events-none absolute top-[600px] -left-40 -z-10 h-[400px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/15 blur-3xl" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span>Introducing Your Assistant 2.5 — Autonomous Agent Workflows</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl"
          >
            The Autonomous AI Assistant <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Engineered For Action
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Stop copying and pasting prompts. <strong>Your Assistant</strong> reasons through complex goals, runs code, queries live databases, and executes multi-step workflows with zero human supervision.
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
              id="hero-get-started-cta"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-7 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md transition duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              id="hero-watch-demo-button"
            >
              <Play className="h-4 w-4 text-indigo-500 fill-indigo-500" />
              <span>Explore Architecture</span>
            </Link>
          </motion.div>

          {/* Trust Guarantees */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 14-day full enterprise trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime in 1-click
            </span>
          </motion.div>

          {/* ================= INTERACTIVE DEMO PREVIEW ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 p-3 sm:p-5 shadow-2xl backdrop-blur-xl"
          >
            {/* Window chrome header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  agent://runtime.session/autonomous-thread-01
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Agent Ready
                </span>
              </div>
            </div>

            {/* Scenario Preset Selector Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 self-center mr-1">
                Sample Workflows:
              </span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition duration-150 ${
                    activePreset.id === preset.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* Prompt input simulation box */}
            <div className="mt-4 text-left rounded-xl bg-slate-50 dark:bg-slate-900/90 p-4 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                  YOU
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Task Objective</p>
                  <p className="mt-0.5 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {activePreset.prompt}
                  </p>
                </div>
              </div>

              {/* Execution Steps */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-indigo-500" />
                    Agent Orchestration Log
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                    {activePreset.metric}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePreset.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 font-mono text-xs"
                  >
                    {activePreset.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}

                    <div className="mt-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 p-3 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-200 font-sans text-xs sm:text-sm">
                      <span className="font-semibold">Execution Output: </span>
                      {activePreset.result}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="border-y border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </div>
                <div className="mt-1 font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION (Bento Grid) ================= */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Architecture & Capabilities
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Engineered Beyond Standard Chatbots
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Designed specifically for high-velocity software engineering, operations, and analytical workflows where precision and follow-through are paramount.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${feat.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {feat.tag}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Seamless Workflow
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Three Simple Steps to Autonomous Execution
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Environment",
                desc: "Securely link your repositories, cloud credentials, databases, or communication channels via our zero-trust vault.",
              },
              {
                step: "02",
                title: "Define Objectives",
                desc: "Assign high-level goals in natural language or configure automated cron triggers and webhook event listeners.",
              },
              {
                step: "03",
                title: "Receive Verified Results",
                desc: "Your Assistant plans, executes, validates against test suites, and presents comprehensive artifacts ready for production.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8"
              >
                <div className="text-4xl font-extrabold text-indigo-600/30 dark:text-indigo-400/20">
                  {item.step}
                </div>
                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trusted by Fast-Moving Teams Worldwide
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Hear how modern technology organizations scale engineering capacity with Your Assistant.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "Your Assistant halved our sprint turnaround time. It handled boilerplate migrations, refactored TypeScript types, and wrote tests reliably without hand-holding.",
                author: "Elena Rostova",
                role: "VP of Engineering at CloudScale",
              },
              {
                quote:
                  "The persistent context memory is a game-changer. It remembers our internal conventions, styling rules, and API schemas across weeks of ongoing releases.",
                author: "Marcus Vance",
                role: "Lead Architect at FintechFlow",
              },
              {
                quote:
                  "Our on-call engineers sleep soundly now. When alerts fire, Your Assistant triages logs, pinpoints root causes, and proposes validated fixes automatically.",
                author: "Aria Chen",
                role: "Head of Infrastructure at Datastream",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
              >
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">{t.author}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 px-6 py-16 text-center text-white shadow-2xl sm:px-12 sm:py-20">
            {/* Background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> Ready in 60 seconds
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Supercharge Your Productivity Today
              </h2>
              <p className="mt-4 text-base sm:text-lg text-indigo-100 leading-relaxed">
                Join thousands of engineers and product teams accelerating their workflows with Your Assistant. Start free, no credit card required.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-md transition duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95"
                  id="final-cta-start-free"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/faq"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-md transition duration-200 hover:bg-white/20"
                >
                  <span>View FAQ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
