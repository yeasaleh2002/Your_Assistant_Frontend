/**
 * Your Assistant - API Service Layer
 * Fully typed integration with FastAPI backend (http://127.0.0.1:8000).
 * Implements exact endpoints, headers, and payloads from Postman collection & README.
 */

import toast from "react-hot-toast";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

// ==========================================
// TYPES & SCHEMAS (matching FastAPI models)
// ==========================================

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
  job_link: string;
  career_page_link: string;
  match_score: number;
  recruiter_email: string | null;
  created_at: string;
}

export interface GetJobsParams {
  job_keyword?: string;
  min_score?: number;
  skip?: number;
  limit?: number;
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
}

export interface GenerateEmailResponse {
  email: string | null;
  subject: string;
  body: string;
}

export interface CreateJobPayload {
  title: string;
  company: string;
  job_link: string;
  career_page_link: string;
  match_score: number;
  recruiter_email?: string | null;
}

export interface ScrapedJob {
  title: string;
  company: string;
  description: string;
  job_link: string;
  career_page_link: string;
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
          // Pydantic validation errors format: [{ loc, msg, type }]
          detail = errorJson.detail.map((e: { msg: string }) => e.msg).join("; ");
        } else if (errorJson.message) {
          detail = errorJson.message;
        }
      } catch {
        const errorText = await response.text().catch(() => "");
        if (errorText) detail = errorText.slice(0, 200);
      }

      // Handle specific HTTP Status Codes with react-hot-toast
      if (!suppressToast) {
        if (response.status === 429) {
          toast.error("SlowAPI Rate Limit: Too many requests. Please wait a moment.", {
            id: "rate-limit-toast",
          });
        } else if (response.status === 422) {
          toast.error(`Validation Error: ${detail}`, {
            id: "validation-error-toast",
          });
        } else if (response.status === 404) {
          toast.error(detail || "Resource not found.", {
            id: "not-found-toast",
          });
        } else if (response.status === 503) {
          toast.error("AI Providers Exhausted: Multi-tier fallback failed. Check API keys.", {
            id: "llm-exhausted-toast",
          });
        } else if (response.status >= 500) {
          toast.error(`Server Error: ${detail}`, {
            id: "server-error-toast",
          });
        }
      }

      throw new ApiError(response.status, detail);
    }

    // Check if expected return is blob/file or JSON
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
      toast.error(`Network Error: Cannot reach backend at ${API_BASE_URL}. Ensure FastAPI is running.`, {
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
   * GET /jobs
   * Retrieve discovered jobs with optional keyword & score filtering.
   */
  async getJobs(params: GetJobsParams = {}): Promise<BackendJob[]> {
    const searchParams = new URLSearchParams();
    if (params.job_keyword?.trim()) {
      searchParams.set("job_keyword", params.job_keyword.trim());
    }
    if (params.min_score !== undefined && params.min_score !== null && params.min_score > 0) {
      searchParams.set("min_score", String(params.min_score));
    }
    if (params.skip !== undefined) {
      searchParams.set("skip", String(params.skip));
    }
    if (params.limit !== undefined) {
      searchParams.set("limit", String(params.limit));
    }

    const query = searchParams.toString();
    const endpoint = query ? `/jobs?${query}` : "/jobs";
    return request<BackendJob[]>(endpoint);
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
   * POST /api/jobs
   * Manually record a discovered job opportunity with strict Pydantic validation.
   */
  async createJob(payload: CreateJobPayload): Promise<BackendJob> {
    return request<BackendJob>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /api/jobs/scrape
   * On-demand scraping via SerpApi with 7-day deduplication.
   */
  async scrapeJobs(keyword?: string, limit = 10): Promise<ScrapedJob[]> {
    const searchParams = new URLSearchParams();
    if (keyword?.trim()) searchParams.set("keyword", keyword.trim());
    searchParams.set("limit", String(limit));
    return request<ScrapedJob[]>(`/api/jobs/scrape?${searchParams.toString()}`, {
      method: "POST",
    });
  },

  /**
   * POST /api/jobs/cleanup
   * Triggers manual 7-day retention worker.
   */
  async cleanupJobs(retentionDays = 7): Promise<{ status: string; records_deleted: number }> {
    return request<{ status: string; records_deleted: number }>(
      `/api/jobs/cleanup?retention_days=${retentionDays}`,
      { method: "POST" }
    );
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
};
