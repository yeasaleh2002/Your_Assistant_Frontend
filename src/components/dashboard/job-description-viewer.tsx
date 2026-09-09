"use client";

import * as React from "react";
import {
  FileText,
  Copy,
  Check,
  Building2,
  Briefcase,
  ListChecks,
  GraduationCap,
  Sparkles,
  Gift,
  DollarSign,
  Info,
  Layers,
  Code2,
  Mail,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { type JobItem } from "./job-card";

interface JobDescriptionViewerProps {
  job: JobItem;
}

interface ParsedSection {
  title: string;
  iconType: "info" | "building" | "checks" | "academic" | "sparkles" | "gift" | "dollar" | "file";
  items?: string[];
  paragraphs?: string[];
}

function cleanText(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\uFFFD\u00A0\u202F]/g, " ")
    .replace(/\s*\?\?+\s*/g, " — ")
    .trim();
}

function parseJobDescription(raw?: string | null, company?: string): ParsedSection[] {
  const text = cleanText(raw);
  if (!text) return [];

  // Patterns for section breaks matching real database descriptions
  const headingPatterns: {
    label: string;
    icon: ParsedSection["iconType"];
    re: RegExp;
  }[] = [
    {
      label: "Job Summary",
      icon: "info",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:Job\s+Summary|Overview|Job\s+Description)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "About the Position",
      icon: "info",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:ABOUT\s+THIS\s+POSITION|About\s+the\s+Position|About\s+this\s+Position|About\s+the\s+Role|About\s+this\s+Role)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: company ? `About ${company}` : "About the Company",
      icon: "building",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:ABOUT\s+WAYSTAR|About\s+(?:the\s+Company|Waystar|micro1|Tilda|Illumix|Rula|Launchmetrics|Ten\s+Mile\s+Square|[A-Z][A-Za-z0-9\s]{2,20}))\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "Key Responsibilities",
      icon: "checks",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:WHAT\s+YOU['"]LL\s+DO|Key\s+Responsibilities|Responsibilities|What\s+You['"]ll\s+Do|What\s+You['"]ll\s+Be\s+Doing|What\s+We\s+Need\s+To\s+See|Core\s+Responsibilities)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "Requirements & Qualifications",
      icon: "academic",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:WHAT\s+YOU['"]LL\s+NEED|Required\s+Skills(?:\s+and\s+Qualifications)?|Minimum\s+Requirements|Requirements|Qualifications|What\s+You['"]ll\s+Need|Required\s+Experience)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "Preferred Qualifications",
      icon: "sparkles",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:Preferred\s+Qualifications|Preferred\s+Requirements|Ways\s+To\s+Stand\s+Out(?:\s+From\s+The\s+Crowd)?|Nice\s+to\s+Have|Bonus\s+Points)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "Benefits & Perks",
      icon: "gift",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:WAYSTAR\s+PERKS|Benefits(?:\s*&|\s*and)?\s*Perks|Perks|Benefits|Compensation\s*(?:&|and)\s*Benefits|What\s+We\s+Offer)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "Compensation & Salary",
      icon: "dollar",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:Salary|Compensation)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
    {
      label: "Additional Information",
      icon: "file",
      re: /(?:^|[.!?\n]|\s{2,}|\b)\s*(?:Contact\s+Info|How\s+To\s+Apply|Restrictions|Equal\s+Opportunity(?:\s+Workplace)?)\s*(?::|\n|\s+(?=[A-Z0-9]))/i,
    },
  ];

  interface MatchItem {
    index: number;
    label: string;
    icon: ParsedSection["iconType"];
    fullMatchLength: number;
  }

  const matches: MatchItem[] = [];
  headingPatterns.forEach((hp) => {
    let match: RegExpExecArray | null;
    const regex = new RegExp(hp.re.source, "gi");
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        label: hp.label,
        icon: hp.icon,
        fullMatchLength: match[0].length,
      });
    }
  });

  matches.sort((a, b) => a.index - b.index);

  // Filter overlapping matches
  const validMatches: MatchItem[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.index >= lastEnd) {
      validMatches.push(m);
      lastEnd = m.index + m.fullMatchLength;
    }
  }

  // If no known headings found, split by double newlines or large paragraph chunks
  if (validMatches.length === 0) {
    const rawParagraphs = text.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
    return [
      {
        title: "Role Overview",
        iconType: "info",
        paragraphs: rawParagraphs.length > 0 ? rawParagraphs : [text],
      },
    ];
  }

  const sections: ParsedSection[] = [];

  // Intro content before first header (if any)
  if (validMatches[0].index > 25) {
    const introText = text.substring(0, validMatches[0].index).trim();
    if (introText.length > 20) {
      sections.push({
        title: "About the Role",
        iconType: "info",
        paragraphs: introText.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean),
      });
    }
  }

  for (let i = 0; i < validMatches.length; i++) {
    const current = validMatches[i];
    const startIndex = current.index + current.fullMatchLength;
    const endIndex = i + 1 < validMatches.length ? validMatches[i + 1].index : text.length;
    const sectionContent = text.substring(startIndex, endIndex).trim();

    if (!sectionContent) continue;

    const isListType = /responsibilit|require|qualificat|perk|benefit|stand out|nice to have|do|need/i.test(
      current.label
    );
    const rawLines = sectionContent.split(/\n+/).map((l) => l.trim()).filter(Boolean);

    let items: string[] = [];
    let paragraphs: string[] = [];

    if (rawLines.length > 1) {
      if (isListType) {
        items = rawLines
          .map((l) => l.replace(/^[•\-\*–—\d\.\)]\s*/, "").trim())
          .filter(Boolean);
      } else {
        paragraphs = sectionContent.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
      }
    } else {
      if (isListType) {
        const sentenceSplits = sectionContent
          .split(/(?<=[.!?])\s+(?=[A-Z0-9\$\+])/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (sentenceSplits.length > 1) {
          items = sentenceSplits;
        } else {
          paragraphs = [sectionContent];
        }
      } else {
        paragraphs = [sectionContent];
      }
    }

    sections.push({
      title: current.label,
      iconType: current.icon,
      items: items.length > 0 ? items : undefined,
      paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
    });
  }

  return sections;
}

function SectionIcon({ type }: { type: ParsedSection["iconType"] }) {
  switch (type) {
    case "building":
      return <Building2 className="h-4 w-4 text-purple-500" />;
    case "checks":
      return <ListChecks className="h-4 w-4 text-indigo-500" />;
    case "academic":
      return <GraduationCap className="h-4 w-4 text-blue-500" />;
    case "sparkles":
      return <Sparkles className="h-4 w-4 text-amber-500" />;
    case "gift":
      return <Gift className="h-4 w-4 text-emerald-500" />;
    case "dollar":
      return <DollarSign className="h-4 w-4 text-emerald-600" />;
    case "info":
      return <Briefcase className="h-4 w-4 text-indigo-500" />;
    default:
      return <FileText className="h-4 w-4 text-slate-500" />;
  }
}

export function JobDescriptionViewer({ job }: JobDescriptionViewerProps) {
  const [viewMode, setViewMode] = React.useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = React.useState(false);

  // Raw description text from database
  const rawDescription = job.description || job.descriptionSnippet || "";
  const charCount = rawDescription.length;
  const wordCount = rawDescription.trim() ? rawDescription.trim().split(/\s+/).length : 0;

  const sections = React.useMemo(() => {
    return parseJobDescription(job.description || job.descriptionSnippet, job.company);
  }, [job.description, job.descriptionSnippet, job.company]);

  const handleCopy = () => {
    if (!rawDescription) return;
    navigator.clipboard.writeText(rawDescription);
    setCopied(true);
    toast.success("Job description copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>Full Job Description</span>
            </h3>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              Live DB Record
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {wordCount} words &bull; {charCount} characters from database
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("formatted")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                viewMode === "formatted"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Structured</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                viewMode === "raw"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Raw Text</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy full description"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tech Stack / Tags Banner */}
      {job.tags && job.tags.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Extracted Skills & Tech Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recruiter Email Banner if exists */}
      {job.recruiterEmail && (
        <div className="flex items-center justify-between rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-slate-700 dark:text-slate-300">
              Direct Recruiter Contact: <strong className="text-purple-700 dark:text-purple-300">{job.recruiterEmail}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(job.recruiterEmail!);
              toast.success("Recruiter email copied!");
            }}
            className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Copy Email
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === "raw" ? (
        /* RAW VIEW */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <span>Database Column: <code className="font-mono text-[11px] text-indigo-500">description</code></span>
            <span>UTF-8 Plain Text</span>
          </div>
          <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed overflow-x-auto max-h-[500px]">
            {rawDescription || "No description text available in database."}
          </pre>
        </div>
      ) : (
        /* STRUCTURED VIEW */
        <div className="space-y-6">
          {sections.length > 0 ? (
            sections.map((section, sIdx) => (
              <div
                key={`${section.title}-${sIdx}`}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 sm:p-6 shadow-sm space-y-3.5 transition-colors hover:border-indigo-200 dark:hover:border-indigo-900/50"
              >
                {/* Section Header */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <SectionIcon type={section.iconType} />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {section.title}
                  </h4>
                </div>

                {/* Section Paragraphs */}
                {section.paragraphs && section.paragraphs.length > 0 && (
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* Section Bullet Items */}
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-500 text-sm">
              <Info className="h-6 w-6 text-slate-400 mx-auto mb-2" />
              <p>No description content available for this position in the database.</p>
              {job.careerUrl && (
                <a
                  href={job.careerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <span>View Posting on Official Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
