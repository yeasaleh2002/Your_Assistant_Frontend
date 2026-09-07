import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/page-skeleton";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Your Assistant engineering and sales teams. Schedule a demo or get technical support.",
};

const ContactContent = dynamic(() => import("@/components/pages/contact-content"), {
  loading: () => <PageSkeleton title="Loading Contact Us..." />,
  ssr: true,
});

export default function ContactPage() {
  return <ContactContent />;
}
