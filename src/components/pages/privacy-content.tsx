"use client";

import * as React from "react";
import { ShieldCheck, Calendar, EyeOff } from "lucide-react";

export default function PrivacyContent() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            <span>Effective Date: September 1, 2026 • Compliant with GDPR, CCPA, & SOC2</span>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="mt-10 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 flex items-start gap-4">
          <EyeOff className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Zero Public Model Training Guarantee
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your Assistant does not use your code, database queries, prompts, or generated artifacts to train, retrain, or improve foundational AI models. Your workspace data remains exclusively yours.
            </p>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="mt-12 space-y-10 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <section id="collection">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p className="mt-3">
              We collect information to provide and operate the Your Assistant platform efficiently:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <strong>Account Information:</strong> Name, work email, organization details, and billing information.
              </li>
              <li>
                <strong>Session & Agent Inputs:</strong> Prompts, codebase links, repository AST metadata, and commands provided to orchestrate tasks.
              </li>
              <li>
                <strong>Telemetry & Logs:</strong> Execution runtimes, task success rates, error logs, and API latency for diagnostic optimization.
              </li>
            </ul>
          </section>

          <section id="usage">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="mt-3">
              We use collected information solely for:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>Executing and orchestrating agent workflows requested by you.</li>
              <li>Authenticating users and safeguarding workspace access permissions.</li>
              <li>Detecting, preventing, and addressing technical failures or security exploits.</li>
              <li>Fulfilling legal obligations and maintaining audit compliance logs.</li>
            </ul>
          </section>

          <section id="ai-isolation">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. AI Model Sandboxing & Data Isolation
            </h2>
            <p className="mt-3">
              Every customer organization operates within logically isolated virtual tenancies. Sandbox executions occur in ephemeral, memory-scrubbed microVMs destroyed immediately upon task termination. We enforce end-to-end TLS 1.3 encryption and AES-256 at rest.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Cookies and Local Storage
            </h2>
            <p className="mt-3">
              We use essential cookies and browser storage strictly required for authentication sessions, dark/light theme preferences, and CSRF protection. We do not use third-party advertising cookies or cross-site tracking trackers.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Your Rights (GDPR & CCPA)
            </h2>
            <p className="mt-3">
              Regardless of your geographic location, you retain the right to:
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/40">
                <span className="font-semibold text-slate-900 dark:text-white">Right of Access & Export:</span> Request a complete machine-readable copy of your workspace data.
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/40">
                <span className="font-semibold text-slate-900 dark:text-white">Right to Erasure:</span> Request immediate permanent scrubbing of your accounts and agent session records.
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/40">
                <span className="font-semibold text-slate-900 dark:text-white">Right to Rectification:</span> Update or correct inaccurate organization profiles.
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/40">
                <span className="font-semibold text-slate-900 dark:text-white">Opt-Out of Telemetry:</span> Disable anonymized diagnostic performance metrics via organization settings.
              </div>
            </div>
          </section>

          <section id="retention">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Data Retention & Deletion
            </h2>
            <p className="mt-3">
              We retain account data as long as your workspace remains active. When you delete a workspace, all associated vector indexes, task transcripts, and keys are permanently purged within 30 days.
            </p>
          </section>

          <section id="contact-privacy">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              7. Contact Our Data Protection Officer (DPO)
            </h2>
            <p className="mt-3">
              If you have any questions or data requests under GDPR or CCPA, please contact:
            </p>
            <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 text-sm">
              <p className="font-semibold text-slate-900 dark:text-white">Data Protection Office</p>
              <p className="text-slate-600 dark:text-slate-400">Your Assistant Technologies Inc.</p>
              <p className="text-slate-600 dark:text-slate-400">Email: privacy@yourassistant.ai</p>
              <p className="text-slate-600 dark:text-slate-400">Address: 548 Market St, Suite 89201, San Francisco, CA 94104</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
