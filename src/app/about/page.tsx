import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/page-skeleton";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Your Assistant's mission, values, and engineering vision to build autonomous AI agents for modern teams.",
};

// Dynamic import with skeleton fallback for performance & code-splitting
const AboutContent = dynamic(() => import("@/components/pages/about-content"), {
  loading: () => <PageSkeleton title="Loading About Us..." />,
  ssr: true,
});

export default function AboutPage() {
  return <AboutContent />;
}
