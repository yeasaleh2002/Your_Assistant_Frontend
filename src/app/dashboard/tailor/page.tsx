import { JobTailorStudio } from "@/components/dashboard/job-tailor-studio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direct Job Description Tailor Studio",
  description:
    "Paste any job description to compute Vector RAG cosine match, tailor ATS resume markdown, generate binary PDF, and craft cold outreach drafts.",
};

export default function TailorPage() {
  return <JobTailorStudio />;
}
