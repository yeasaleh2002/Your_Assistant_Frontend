"use client";

import * as React from "react";
import { FileText, Calendar, Scale } from "lucide-react";

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "accounts", title: "2. Accounts and Authentication" },
  { id: "acceptable-use", title: "3. Acceptable Use and Restrictions" },
  { id: "ip-ownership", title: "4. Intellectual Property & AI Outputs" },
  { id: "availability", title: "5. Service Level & Uptime" },
  { id: "liability", title: "6. Limitation of Liability" },
  { id: "termination", title: "7. Termination of Service" },
  { id: "governing-law", title: "8. Governing Law & Dispute Resolution" },
];

export default function TermsContent() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <Scale className="h-3.5 w-3.5 text-indigo-500" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            <span>Last Updated: September 1, 2026 • Version 3.1</span>
          </div>
        </div>

        {/* Content layout with TOC */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Table of Contents (4 cols) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-6">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-3">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span>Table of Contents</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                {SECTIONS.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition block py-1"
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Text (8 cols) */}
          <div className="lg:col-span-8 space-y-10 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <section id="acceptance" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By creating an account, accessing, or utilizing the services provided by <strong>Your Assistant Technologies Inc.</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be legally bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you possess the authority to bind such entity.
              </p>
            </section>

            <section id="accounts" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                2. Accounts and Authentication
              </h2>
              <p className="mt-3">
                You must provide accurate, current, and complete registration information. You are responsible for safeguarding your authentication credentials, API keys, and session tokens. You must immediately notify our security incident desk of any unauthorized use or credential compromise.
              </p>
            </section>

            <section id="acceptable-use" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                3. Acceptable Use and Restrictions
              </h2>
              <p className="mt-3">
                You agree not to use Your Assistant to:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>Deploy malware, exploit vulnerabilities, or initiate unauthorized penetration attacks.</li>
                <li>Generate fraudulent, misleading, defamatory, or unlawful content.</li>
                <li>Attempt to reverse-engineer model weights, sandbox virtualization primitives, or security boundaries.</li>
                <li>Circumvent task rate limits or manipulate automated usage quotas.</li>
              </ul>
            </section>

            <section id="ip-ownership" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                4. Intellectual Property & AI Outputs
              </h2>
              <p className="mt-3">
                <strong>Your Ownership:</strong> As between you and Your Assistant, you retain all rights, title, and interest in and to your input code, schemas, and proprietary data. You own all output artifacts generated by the agent runtime on your behalf.
              </p>
              <p className="mt-2">
                <strong>No Public Model Training:</strong> We warrant that your customer inputs and output artifacts are never ingested into foundational AI model training sets without express written opt-in consent.
              </p>
            </section>

            <section id="availability" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                5. Service Level & Uptime
              </h2>
              <p className="mt-3">
                While we strive to maintain 99.98% operational uptime for enterprise tiers, services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. Scheduled maintenance windows will be communicated via status dashboards in advance.
              </p>
            </section>

            <section id="liability" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                6. Limitation of Liability
              </h2>
              <p className="mt-3">
                In no event will Your Assistant Technologies Inc. be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your access to or use of the services.
              </p>
            </section>

            <section id="termination" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                7. Termination of Service
              </h2>
              <p className="mt-3">
                You may terminate your account at any time via your organization settings. Upon termination, all stored agent memory, vector indexes, and active session states will be securely scrubbed according to our data retention schedule.
              </p>
            </section>

            <section id="governing-law" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                8. Governing Law & Dispute Resolution
              </h2>
              <p className="mt-3">
                These terms will be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law.
              </p>
            </section>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6 mt-8">
              <h3 className="font-bold text-slate-900 dark:text-white">Legal Questions?</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Contact our legal and compliance counsel at{" "}
                <a href="mailto:legal@yourassistant.ai" className="text-indigo-600 dark:text-indigo-400 underline">
                  legal@yourassistant.ai
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
