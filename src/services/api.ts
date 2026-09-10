/**
 * Your Assistant - API Service Layer
 * Fully typed integration with FastAPI backend.
 * Supports authentication, multi-source scraping, date-filtered jobs,
 * application status tracking, and ATS resume generation.
 */

import toast from "react-hot-toast";
export * from "@/types/api";
import type {
  JobDescriptionTailorRequest,
  JobDescriptionTailorResponse,
  CompanyPaginationResponse,
  CompanyQueryParams,
  DedicatedCoverLetterResponse,
  EmailAndCoverLetterResponse,
} from "@/types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

const TOKEN_KEY = "your_assistant_jwt";

// ==========================================
// AUTH TOKEN HELPERS
// ==========================================

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// ==========================================
// TYPES & SCHEMAS (matching FastAPI models)
// ==========================================

export type JobStatus = "Pending" | "Applied" | "Interview" | "Rejected";

export interface HealthResponse {
  service: string;
  status: string;
  version: string;
  easter_egg: string;
}

export interface BackendJob {
  id: number;
  title: string;
  company: string;
  link: string;
  career_page_link?: string | null;
  match_score: number;
  location: string;
  status: JobStatus;
  scraped_date: string; // YYYY-MM-DD
  description?: string | null;
  recruiter_email?: string | null;
  created_at?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in_days?: number;
  user?: {
    email: string;
    role: string;
  };
}

export interface AuthUser {
  email: string;
  role: string;
  authenticated: boolean;
}

export interface ScrapeTriggerResponse {
  status: string;
  scraped_count: number;
  matched_count: number;
  saved_count: number;
  scraped_date?: string;
  message: string;
}

export interface GenerateResumeResponse {
  status: string;
  job_id: number;
  job_title: string;
  company: string;
  match_score: number;
  tailored_resume_markdown: string;
  pdf_filename: string;
  pdf_path: string;
  download_url?: string;
}

export interface GenerateEmailResponse {
  email: string | null;
  subject: string;
  body: string;
  cover_letter?: string;
}

export interface GeneratePdfPayload {
  markdown_text: string;
  filename: string;
}

// ==========================================
// CORE REQUEST HELPER WITH ERROR HANDLING
// ==========================================

class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  suppressToast = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getAuthToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && options.method && options.method !== "GET") {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      let detail = `Request failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (typeof errorJson.detail === "string") {
          detail = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          detail = errorJson.detail.map((e: { msg: string }) => e.msg).join("; ");
        } else if (errorJson.message) {
          detail = errorJson.message;
        }
      } catch {
        const errorText = await response.text().catch(() => "");
        if (errorText) detail = errorText.slice(0, 200);
      }

      if (!suppressToast) {
        if (response.status === 401) {
          // Unauthorized - clear token if invalid
          if (endpoint !== "/api/auth/login") {
            removeAuthToken();
            toast.error("Session expired. Please log in again.", { id: "auth-expired-toast" });
          }
        } else if (response.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment.", { id: "rate-limit-toast" });
        } else if (response.status === 422) {
          toast.error(`Validation Error: ${detail}`, { id: "validation-error-toast" });
        } else if (response.status === 404) {
          toast.error(detail || "Resource not found.", { id: "not-found-toast" });
        } else if (response.status >= 500) {
          toast.error(`Server Error: ${detail}`, { id: "server-error-toast" });
        }
      }

      throw new ApiError(response.status, detail);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/pdf") || contentType.includes("application/octet-stream")) {
      return (await response.blob()) as unknown as T;
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Network error";
    if (!suppressToast) {
      toast.error(`Network Error: Cannot reach backend at ${API_BASE_URL}. Ensure server is running.`, {
        id: "network-error-toast",
      });
    }
    throw new ApiError(0, message);
  }
}

// ==========================================
// SERVICE IMPLEMENTATION
// ==========================================

export const apiService = {
  /**
   * GET /
   * Health Check & Easter Egg
   */
  async getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>("/");
  },

  /**
   * POST /api/auth/login
   * Authenticate against backend ADMIN_EMAIL and ADMIN_PASSWORD
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * GET /api/auth/me
   * Retrieve current authenticated admin profile
   */
  async getMe(): Promise<AuthUser> {
    return request<AuthUser>("/api/auth/me", {}, true);
  },

  /**
   * POST /api/scrape
   * Triggers multi-source scraping for 12 keywords, filters 24h & geography,
   * computes RAG match against resume, and saves qualified jobs (>=65%) for today.
   */
  async triggerScraper(): Promise<ScrapeTriggerResponse> {
    return request<ScrapeTriggerResponse>("/api/scrape", {
      method: "POST",
    });
  },

  /**
   * POST /api/revalidate-jobs
   * Triggers Next.js on-demand ISR Cache Tag purging
   */
  async revalidateJobs(tag?: string): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        await fetch("/api/revalidate-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag }),
        });
      }
    } catch {
      // Best-effort client invalidation
    }
  },

  /**
   * GET /api/cached-jobs?date=YYYY-MM-DD
   * Leverages Next.js ISR with cache tags for instant sub-50ms responses.
   * Falls back to direct backend endpoint if needed.
   */
  async getJobs(params: { date?: string; skip?: number; limit?: number; bypassCache?: boolean } = {}): Promise<BackendJob[]> {
    const searchParams = new URLSearchParams();
    if (params.date?.trim()) {
      searchParams.set("date", params.date.trim());
    }
    if (params.skip !== undefined) {
      searchParams.set("skip", String(params.skip));
    }
    if (params.limit !== undefined) {
      searchParams.set("limit", String(params.limit));
    }

    const query = searchParams.toString();
    
    // In browser, hit Next.js ISR cached route handler
    if (typeof window !== "undefined" && !params.bypassCache) {
      const isrUrl = query ? `/api/cached-jobs?${query}` : "/api/cached-jobs";
      try {
        const res = await fetch(isrUrl, { cache: "default" });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Fallback to direct backend request
      }
    }

    const endpoint = query ? `/api/jobs?${query}` : "/api/jobs";
    return request<BackendJob[]>(endpoint);
  },

  /**
   * PATCH /api/jobs/{id}/status
   * Updates application status: 'Pending', 'Applied', 'Interview', 'Rejected'
   */
  async updateJobStatus(jobId: number, status: JobStatus): Promise<BackendJob> {
    const updated = await request<BackendJob>(`/api/jobs/${jobId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    this.revalidateJobs("jobs");
    return updated;
  },

  /**
   * DELETE /api/jobs/date/{date}
   * Deletes all scraped jobs for the specified date (YYYY-MM-DD).
   */
  async deleteJobsByDate(dateStr: string): Promise<{ status: string; date: string; deleted_count: number; message: string }> {
    const res = await request<{ status: string; date: string; deleted_count: number; message: string }>(
      `/api/jobs/date/${dateStr}`,
      {
        method: "DELETE",
      }
    );
    this.revalidateJobs(`jobs-${dateStr}`);
    this.revalidateJobs("jobs-today");
    return res;
  },

  /**
   * POST /generate-resume/{id}
   * Generate tailored ATS resume in Markdown and PDF path for target job ID.
   */
  async generateResume(jobId: number): Promise<GenerateResumeResponse> {
    return request<GenerateResumeResponse>(`/generate-resume/${jobId}`, {
      method: "POST",
    });
  },

  /**
   * POST /generate-email/{id}
   * Generate personalized recruiter cold outreach email for target job ID.
   */
  async generateEmail(jobId: number): Promise<GenerateEmailResponse> {
    return request<GenerateEmailResponse>(`/generate-email/${jobId}`, {
      method: "POST",
    });
  },

  /**
   * POST /api/jobs/{id}/cover-letter (or /generate-cover-letter/{id})
   * Dedicated endpoint for full formal ATS cover letter and email draft for target job ID.
   */
  async generateCoverLetter(jobId: number): Promise<DedicatedCoverLetterResponse> {
    return request<DedicatedCoverLetterResponse>(`/generate-cover-letter/${jobId}`, {
      method: "POST",
    });
  },

  /**
   * POST /api/resume/generate-pdf
   * Compiles customized Markdown resume text into a publication-quality, ATS-optimized PDF Blob.
   */
  async generatePdfBlob(payload: GeneratePdfPayload): Promise<Blob> {
    return request<Blob>("/api/resume/generate-pdf", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Utility to force-download a PDF Blob in the browser
   */
  downloadPdfBlob(blob: Blob, filename = "tailored_resume.pdf") {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },

  /**
   * POST /api/job-description/tailor
   * Dynamically tailors resume, matches RAG cosine score (%), and generates ATS PDF, cold email, & cover letter.
   */
  async tailorJobDescription(payload: JobDescriptionTailorRequest): Promise<JobDescriptionTailorResponse> {
    return request<JobDescriptionTailorResponse>("/api/job-description/tailor", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * GET /api/companies
   * Search and filter authentic software companies across Saudi Arabia, UAE, Malaysia, Egypt, 2026 AI startups, etc.
   */
  async getCompanies(params: CompanyQueryParams = {}): Promise<CompanyPaginationResponse> {
    const searchParams = new URLSearchParams();
    if (params.country?.trim()) searchParams.set("country", params.country.trim());
    if (params.year !== undefined && params.year !== null) searchParams.set("year", String(params.year));
    if (params.founded_year_min !== undefined) searchParams.set("founded_year_min", String(params.founded_year_min));
    if (params.founded_year_max !== undefined) searchParams.set("founded_year_max", String(params.founded_year_max));
    if (params.search?.trim()) searchParams.set("search", params.search.trim());
    if (params.remote_policy?.trim()) searchParams.set("remote_policy", params.remote_policy.trim());
    if (params.page !== undefined) searchParams.set("page", String(params.page));
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.sort?.trim()) searchParams.set("sort", params.sort.trim());

    const qs = searchParams.toString();
    const endpoint = qs ? `/api/companies?${qs}` : "/api/companies";
    return request<CompanyPaginationResponse>(endpoint);
  },

  /**
   * Download a generated tailored resume PDF from /api/resume/download/{filename}
   */
  downloadTailoredPdf(downloadUrl: string, filename?: string) {
    if (typeof window === "undefined") return;
    const fullUrl = downloadUrl.startsWith("http")
      ? downloadUrl
      : `${API_BASE_URL}${downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`}`;

    const link = document.createElement("a");
    link.href = fullUrl;
    if (filename) {
      link.setAttribute("download", filename);
    }
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
