"use client";

import * as React from "react";
import { apiService, type BackendJob, type JobStatus } from "@/services/api";
import { useToastNotify } from "./use-toast-notify";

export interface MatchedJobDetail extends BackendJob {
  matchingSkills: string[];
  missingSkills: string[];
  matchSummary: string;
  recommendation: string;
}

// Utility: parse job details into matching vs missing skills based on title and description
function deriveJobSkillsAnalysis(job: BackendJob): {
  matchingSkills: string[];
  missingSkills: string[];
  matchSummary: string;
  recommendation: string;
} {
  const content = `${job.title} ${job.description || ""}`.toLowerCase();

  const skillTaxonomy = [
    { name: "React / Next.js", key: ["react", "next.js", "nextjs"] },
    { name: "TypeScript", key: ["typescript", " ts "] },
    { name: "Tailwind CSS", key: ["tailwind", "css"] },
    { name: "FastAPI / Python", key: ["python", "fastapi"] },
    { name: "REST / GraphQL", key: ["rest", "api", "graphql"] },
    { name: "PostgreSQL", key: ["postgres", "postgresql", "sql"] },
    { name: "Docker / Cloud", key: ["docker", "aws", "gcp", "cloud"] },
    { name: "Vector RAG / AI", key: ["rag", "ai", "llm", "embeddings"] },
    { name: "CI/CD Pipelines", key: ["ci/cd", "github actions", "pipeline"] },
    { name: "Microservices", key: ["microservices", "distributed", "kubernetes"] },
  ];

  const matching: string[] = [];
  const missing: string[] = [];

  skillTaxonomy.forEach((skill) => {
    const isPresent = skill.key.some((k) => content.includes(k));
    if (isPresent) {
      matching.push(skill.name);
    } else {
      missing.push(skill.name);
    }
  });

  // Guarantee realistic distribution
  const finalMatching = matching.length > 0 ? matching.slice(0, 5) : ["TypeScript", "React", "REST APIs"];
  const finalMissing = missing.slice(0, 3);

  const score = job.match_score || 75;
  const matchSummary =
    score >= 85
      ? `Exceptional alignment with core engineering stack. Your background directly matches ${finalMatching.slice(0, 3).join(", ")} requirements.`
      : score >= 70
      ? `Strong alignment with the primary technical requirements. Minor gap in ${finalMissing[0] || "specialized domain tooling"}.`
      : `Moderate fit. Role prioritizes ${finalMissing.join(" and ")}, but core software competencies transfer cleanly.`;

  const recommendation =
    score >= 80
      ? "Direct apply recommended. Generate a customized cover letter highlighting recent full-stack accomplishments."
      : "Tailor resume summary with ATS keywords to bridge missing domain competencies.";

  return {
    matchingSkills: finalMatching,
    missingSkills: finalMissing,
    matchSummary,
    recommendation,
  };
}

export function useJobMatches() {
  const [jobs, setJobs] = React.useState<MatchedJobDetail[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [minMatchScore, setMinMatchScore] = React.useState<number>(60);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [expandedJobId, setExpandedJobId] = React.useState<number | null>(null);

  const { notifySuccess, notifyError } = useToastNotify();

  const fetchJobs = React.useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const rawJobs = await apiService.getJobs({ bypassCache: isManualRefresh });

        const enrichedJobs: MatchedJobDetail[] = (rawJobs || []).map((j) => {
          const analysis = deriveJobSkillsAnalysis(j);
          return {
            ...j,
            ...analysis,
          };
        });

        // Sort by match score descending
        enrichedJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

        setJobs(enrichedJobs);

        if (isManualRefresh) {
          notifySuccess(`Refreshed ${enrichedJobs.length} live matched jobs`, "refresh-jobs");
        }
      } catch (err) {
        notifyError(err, "Failed to retrieve job matches from backend database.", "job-fetch-err");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [notifySuccess, notifyError]
  );

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Toggle card accordion
  const toggleExpand = React.useCallback((jobId: number) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  }, []);

  // Update status handler
  const handleUpdateStatus = React.useCallback(
    async (jobId: number, newStatus: JobStatus) => {
      // Optimistic update
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
      );

      try {
        await apiService.updateJobStatus(jobId, newStatus);
        notifySuccess(`Status updated to "${newStatus}"`, `status-${jobId}`);
      } catch (err) {
        notifyError(err, "Could not update status on backend.");
        // Revert on failure
        fetchJobs();
      }
    },
    [notifySuccess, notifyError, fetchJobs]
  );

  // Filtered jobs memo
  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesScore = (job.match_score || 0) >= minMatchScore;

      const matchesStatus =
        selectedStatus === "All" || job.status === selectedStatus;

      return matchesSearch && matchesScore && matchesStatus;
    });
  }, [jobs, searchQuery, minMatchScore, selectedStatus]);

  return {
    jobs: filteredJobs,
    totalCount: jobs.length,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    minMatchScore,
    setMinMatchScore,
    selectedStatus,
    setSelectedStatus,
    expandedJobId,
    toggleExpand,
    handleUpdateStatus,
    refetch: () => fetchJobs(true),
  };
}
