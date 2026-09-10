import { CompanyDirectory } from "@/components/dashboard/company-directory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Real Companies & AI Startups Directory",
  description:
    "Explore 100+ verified software companies actively hiring across Saudi Arabia, UAE, Malaysia, Egypt, and 2026 Autonomous AI startups.",
};

export default function CompaniesPage() {
  return <CompanyDirectory />;
}
