"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "Architecture" | "Security" | "Integrations" | "Pricing";
}

const FAQS: FAQItem[] = [
  {
    category: "Architecture",
    question: "How is Your Assistant different from a standard ChatGPT or Claude session?",
    answer:
      "Unlike simple conversational chatbots, Your Assistant is an autonomous agentic runtime. It decomposes broad objectives into sequential actions, manages state across long sessions, interacts with live terminal sandboxes, executes code, and validates its work against real tests without requiring you to copy-paste code back and forth.",
  },
  {
    category: "Architecture",
    question: "Can Your Assistant work with private on-prem or VPC environments?",
    answer:
      "Yes. We offer Enterprise Self-Hosted Agent runners that deploy directly into your private AWS, GCP, or Azure VPC. Sensitive telemetry and codebase files never traverse public internet infrastructure.",
  },
  {
    category: "Security",
    question: "Does Your Assistant train public models on customer code or data?",
    answer:
      "No, absolutely not. We enforce strict contractual zero-data retention agreements with all model inference providers. Your intellectual property, proprietary codebase, and internal documents are never ingested into foundational training datasets.",
  },
  {
    category: "Security",
    question: "What security and compliance certifications do you hold?",
    answer:
      "We maintain SOC2 Type II certification, GDPR compliance, ISO 27001 readiness, and enforce AES-256 encryption at rest and TLS 1.3 in transit. Every sandbox action executes within short-lived microVMs with strict resource isolation.",
  },
  {
    category: "Integrations",
    question: "Which tools and developer platforms are supported out of the box?",
    answer:
      "Your Assistant integrates natively with GitHub, GitLab, Jira, Linear, Slack, PostgreSQL, Snowflake, Docker, and standard REST/GraphQL endpoints. You can also define custom tools using our lightweight MCP (Model Context Protocol) and OpenAPI specifications.",
  },
  {
    category: "Integrations",
    question: "Can I connect custom internal APIs and tools?",
    answer:
      "Yes! You can supply standard OpenAPI schemas or write lightweight TypeScript/Python functions that Your Assistant can invoke during task planning.",
  },
  {
    category: "Pricing",
    question: "How does the 14-day free trial work?",
    answer:
      "You receive full access to Pro features including 500 autonomous tasks, GitHub integration, and team workspaces with no credit card required. If you decide not to upgrade, your account gracefully transitions to our perpetual Free Community tier.",
  },
  {
    category: "Pricing",
    question: "Can I customize seat allocation and task quotas for large teams?",
    answer:
      "Yes. Our Enterprise tier offers pooled task credits, volume licensing, dedicated account managers, custom SLAs, and tailored invoices.",
  },
];

const CATEGORIES = ["All", "Architecture", "Security", "Integrations", "Pricing"] as const;

export default function FAQContent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Knowledge Base & Help Center</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about Your Assistant architecture, sandboxing, integrations, and enterprise security.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. security, pricing, github, vpc)..."
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-1.5 text-xs sm:text-sm font-medium transition duration-150 ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-12 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                No questions found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {faq.category}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions card */}
        <div className="mt-16 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-tr from-indigo-50/60 via-purple-50/40 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 p-8 text-center sm:flex sm:items-center sm:justify-between">
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Still have questions?</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Can&apos;t find the answer you&apos;re looking for? Chat directly with our engineering architects.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            <span>Contact Support</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
