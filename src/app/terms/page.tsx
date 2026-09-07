import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/page-skeleton";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing the use of the Your Assistant platform and agentic runtime.",
};

const TermsContent = dynamic(() => import("@/components/pages/terms-content"), {
  loading: () => <PageSkeleton title="Loading Terms of Service..." />,
  ssr: true,
});

export default function TermsPage() {
  return <TermsContent />;
}
