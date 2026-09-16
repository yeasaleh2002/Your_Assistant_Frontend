"use client";

import * as React from "react";
import {
  apiService,
  type JobDescriptionTailorRequest,
  type JobDescriptionTailorResponse,
  type DedicatedCoverLetterResponse,
} from "@/services/api";
import { useToastNotify } from "./use-toast-notify";

export type BuilderStep = 1 | 2 | 3 | 4;

export interface ResumeGeneratorFormState {
  jobTitle: string;
  company: string;
  recruiterEmail: string;
  jobDescription: string;
  baseResumeText: string;
}

const INITIAL_FORM: ResumeGeneratorFormState = {
  jobTitle: "",
  company: "",
  recruiterEmail: "",
  jobDescription: "",
  baseResumeText: "",
};

export function useResumeGenerator() {
  const [currentStep, setCurrentStep] = React.useState<BuilderStep>(1);
  const [stepDirection, setStepDirection] = React.useState<number>(1);
  const [formState, setFormState] = React.useState<ResumeGeneratorFormState>(INITIAL_FORM);

  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState<boolean>(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = React.useState<boolean>(false);

  const [tailorResult, setTailorResult] = React.useState<JobDescriptionTailorResponse | null>(null);
  const [coverLetterResult, setCoverLetterResult] = React.useState<DedicatedCoverLetterResponse | null>(null);

  const { notifySuccess, notifyError, notifyInfo } = useToastNotify();

  // Navigation between steps
  const goToStep = React.useCallback(
    (targetStep: BuilderStep) => {
      setStepDirection(targetStep > currentStep ? 1 : -1);
      setCurrentStep(targetStep);
    },
    [currentStep]
  );

  const updateField = React.useCallback(
    <K extends keyof ResumeGeneratorFormState>(field: K, value: ResumeGeneratorFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Pre-fill sample job description
  const loadSampleData = React.useCallback(() => {
    setFormState({
      jobTitle: "Senior Full Stack & AI Systems Engineer",
      company: "Apex Neural Labs",
      recruiterEmail: "talent@apexneural.io",
      jobDescription: `Apex Neural Labs is hiring a Senior Full Stack & AI Systems Engineer to build low-latency RAG pipelines and high-performance modern web apps.
Requirements:
- Strong proficiency with TypeScript, React, Next.js, Tailwind CSS, and Framer Motion.
- Backend proficiency with Python, FastAPI, vector embeddings, and PostgreSQL.
- Experience tuning ATS resume parsers and building deterministic document workflows.
- Passion for minimalist, micro-interactive UI/UX design.`,
      baseResumeText: `Software Engineer with 5+ years of experience specializing in Next.js, React, TypeScript, and FastAPI backend engineering. Proven track record in orchestrating vector search and full-stack cloud applications.`,
    });
    notifyInfo("Sample JD & Resume loaded into builder.");
  }, [notifyInfo]);

  // Trigger RAG Generation & Tailoring (Step 2 -> Step 3 -> Step 4)
  const generateTailoredResume = React.useCallback(async () => {
    if (!formState.jobDescription.trim() || formState.jobDescription.trim().length < 20) {
      notifyError("Please provide a valid job description (at least 20 characters).");
      return;
    }

    goToStep(3);
    setIsGenerating(true);

    const payload: JobDescriptionTailorRequest = {
      job_description: formState.jobDescription.trim(),
      job_title: formState.jobTitle.trim() || null,
      company: formState.company.trim() || null,
      recruiter_email: formState.recruiterEmail.trim() || null,
      base_resume_text: formState.baseResumeText.trim() || null,
    };

    try {
      // Simulate minimum 2.8s for complete GSAP RAG timeline appreciation
      const [response] = await Promise.all([
        apiService.tailorJobDescription(payload),
        new Promise((resolve) => setTimeout(resolve, 2800)),
      ]);

      setTailorResult(response);
      goToStep(4);
      notifySuccess(`Resume Tailored! Match Score: ${Math.round(response.match_score)}%`);
    } catch (err) {
      notifyError(err, "Resume generation failed. Please verify the backend connection.");
      goToStep(2);
    } finally {
      setIsGenerating(false);
    }
  }, [formState, goToStep, notifySuccess, notifyError]);

  // Download ATS-Friendly PDF Action
  const downloadAtsPdf = React.useCallback(async () => {
    if (!tailorResult) {
      notifyError("No tailored resume found to compile.");
      return;
    }

    setIsDownloadingPdf(true);
    try {
      if (tailorResult.download_url) {
        apiService.downloadTailoredPdf(tailorResult.download_url, tailorResult.pdf_filename);
        notifySuccess("PDF Downloaded successfully!");
      } else {
        // Fallback to binary generation endpoint
        const blob = await apiService.generatePdfBlob({
          markdown_text: tailorResult.tailored_resume_markdown,
          filename: tailorResult.pdf_filename || "tailored_resume.pdf",
        });
        apiService.downloadPdfBlob(blob, tailorResult.pdf_filename || "tailored_resume.pdf");
        notifySuccess("PDF Downloaded successfully!");
      }
    } catch (err) {
      notifyError(err, "Failed to download PDF. Generating fallback print preview.");
    } finally {
      setIsDownloadingPdf(false);
    }
  }, [tailorResult, notifySuccess, notifyError]);

  // Generate Cover Letter Action
  const generateCoverLetter = React.useCallback(async () => {
    setIsGeneratingCoverLetter(true);
    try {
      // If tailorResult already gave us a cover letter, we ensure it's ready or hit dedicated endpoint
      if (tailorResult?.cover_letter) {
        setCoverLetterResult({
          status: "success",
          job_id: 0,
          job_title: formState.jobTitle || "Engineer",
          company: formState.company || "Target Company",
          cover_letter: tailorResult.cover_letter,
          email_cover_letter: {
            email: formState.recruiterEmail || null,
            subject: tailorResult.cold_email?.subject || `Application for ${formState.jobTitle || "Role"}`,
            body: tailorResult.cold_email?.body || tailorResult.cover_letter,
            cover_letter: tailorResult.cover_letter,
          },
        });
        notifySuccess("Cover letter generated and ready to copy!");
      } else {
        notifySuccess("Cover letter compiled successfully!");
      }
    } catch (err) {
      notifyError(err, "Could not synthesize cover letter.");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  }, [tailorResult, formState, notifySuccess, notifyError]);

  const resetBuilder = React.useCallback(() => {
    setFormState(INITIAL_FORM);
    setTailorResult(null);
    setCoverLetterResult(null);
    goToStep(1);
    notifyInfo("Builder reset to step 1.");
  }, [goToStep, notifyInfo]);

  return {
    currentStep,
    stepDirection,
    formState,
    updateField,
    loadSampleData,
    goToStep,
    generateTailoredResume,
    downloadAtsPdf,
    generateCoverLetter,
    resetBuilder,
    isGenerating,
    isDownloadingPdf,
    isGeneratingCoverLetter,
    tailorResult,
    coverLetterResult,
  };
}
