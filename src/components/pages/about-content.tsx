"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  HeartHandshake,
  ShieldCheck,
  Cpu,
  ArrowRight,
} from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Relentless Pragmatism",
    description:
      "We design AI that doesn't just chat—it acts. Every capability is focused on producing verifiable, tangible real-world outcomes.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Security First",
    description:
      "Your intellectual property is sacred. We enforce cryptographic isolation, strict tenancy boundaries, and zero data training policies.",
  },
  {
    icon: HeartHandshake,
    title: "Human-in-the-Loop Synergy",
    description:
      "We believe AI should elevate human capability, removing mundane toil so engineers and creators can focus on breakthrough innovation.",
  },
  {
    icon: Cpu,
    title: "Engineering Rigor",
    description:
      "Reliability is not an afterthought. We build resilient architectures that tolerate edge-case failures with proactive self-healing.",
  },
];

const MILESTONES = [
  {
    year: "2024",
    title: "Founded & Inception",
    desc: "Created the initial prototype of autonomous multi-tool agent runtime.",
  },
  {
    year: "2025",
    title: "Enterprise Launch & SOC2",
    desc: "Scaled to 500+ tech organizations; achieved SOC2 Type II certification.",
  },
  {
    year: "2026",
    title: "Your Assistant 2.5",
    desc: "Introduced multimodal deep memory, continuous subagent orchestration, and edge execution.",
  },
];

export default function AboutContent() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Our Mission & Story</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Empowering Builders With{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Autonomous Intelligence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            At <strong>Your Assistant</strong>, we are building the cognitive layer for modern software and business operations. Our mission is to liberate knowledge workers from repetitive digital toil.
          </motion.p>
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-8 sm:p-12 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                The Inception
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Moving Beyond Generic Chatboxes
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                We observed that standard conversational models were brilliant at answering questions, but incapable of taking real actions without extensive human intervention. Developers were stuck copying code back and forth, diagnosing errors manually, and gluing APIs together.
              </p>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                We engineered <strong>Your Assistant</strong> as an agentic partner: capable of reading environments, executing sandbox commands, synthesizing context across repos, and validating outputs with real automated tests.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">45+</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Global Contributors</div>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">14M+</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Automated Actions</div>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">99.98%</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">SLA Reliability</div>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">100%</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Customer Data Isolated</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Principles That Guide Us
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              The foundational values that drive how we build, deploy, and safeguard our technology.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 sm:p-8"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{val.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Milestones */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Our Journey
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {MILESTONES.map((m) => (
              <div
                key={m.year}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
              >
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                  {m.year}
                </span>
                <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white">{m.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 rounded-3xl bg-indigo-600 dark:bg-indigo-950/80 p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to meet your autonomous AI assistant?</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-indigo-100">
            Get started with our free tier or talk with an enterprise solution architect today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-slate-100 transition shadow"
            >
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
