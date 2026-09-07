import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Your Assistant - Autonomous AI Agent Platform",
    template: "%s | Your Assistant",
  },
  description:
    "Next-generation autonomous AI assistant platform designed for modern engineering teams, operators, and enterprises. Streamline workflows, automate coding tasks, and synthesize knowledge effortlessly.",
  keywords: [
    "AI Assistant",
    "Autonomous Agents",
    "Workflow Automation",
    "Next.js App Router",
    "Productivity AI",
    "Developer Tooling",
  ],
  authors: [{ name: "Your Assistant Team" }],
  creator: "Your Assistant Technologies Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourassistant.ai",
    title: "Your Assistant - Autonomous AI Agent Platform",
    description:
      "Boost workflow efficiency with intelligent agentic orchestration, real-time context memory, and secure integrations.",
    siteName: "Your Assistant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Assistant - Autonomous AI Agent Platform",
    description: "Next-generation autonomous AI assistant for modern teams.",
    creator: "@yourassistant_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
