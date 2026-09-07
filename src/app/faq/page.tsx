import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/page-skeleton";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers regarding Your Assistant's architecture, security isolation, integration options, and pricing plans.",
};

const FAQContent = dynamic(() => import("@/components/pages/faq-content"), {
  loading: () => <PageSkeleton title="Loading FAQ..." />,
  ssr: true,
});

export default function FAQPage() {
  return <FAQContent />;
}
