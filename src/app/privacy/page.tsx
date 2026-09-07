import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/page-skeleton";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Your Assistant safeguards your enterprise data, codebase, and privacy with zero public model training.",
};

const PrivacyContent = dynamic(() => import("@/components/pages/privacy-content"), {
  loading: () => <PageSkeleton title="Loading Privacy Policy..." />,
  ssr: true,
});

export default function PrivacyPage() {
  return <PrivacyContent />;
}
