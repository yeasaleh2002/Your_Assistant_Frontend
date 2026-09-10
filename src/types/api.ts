// ==========================================
// Custom Job Description Tailoring Types
// ==========================================

export interface JobDescriptionTailorRequest {
  job_description: string;
  job_title?: string | null;
  company?: string | null;
  recruiter_email?: string | null;
  base_resume_text?: string | null;
}

export interface ColdEmailDraft {
  recruiter_email: string;
  subject: string;
  body: string;
  candidate_name?: string;
  portfolio_link?: string;
  call_to_action?: string;
}

export interface JobDescriptionTailorResponse {
  status: "success" | "error";
  job_title: string;
  company: string | null;
  match_score: number; // e.g. 84.5 (percentage 0.0 to 100.0)
  pdf_filename: string; // e.g. "Yeasaleh_Resume_TechNova_Corp_Senior_React_Engineer.pdf"
  pdf_path: string;
  download_url: string; // e.g. "/api/resume/download/Yeasaleh_Resume_..."
  tailored_resume_markdown: string;
  cold_email: ColdEmailDraft;
  cover_letter: string;
}

// ==========================================
// Company Directory Types
// ==========================================

export interface Company {
  id: number;
  name: string;
  website: string;
  career_page?: string;
  careers_page?: string;
  contact_email?: string | null;
  country: string;
  city: string;
  region?: string;
  industry: string;
  tech_stack: string;
  remote_policy: string;
  founded_year: number;
  employee_count?: string;
  description: string;
  created_at?: string;
}

export interface CompanyPaginationResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  items: Company[];
}

export interface CompanyQueryParams {
  country?: string;
  year?: number;
  founded_year_min?: number;
  founded_year_max?: number;
  search?: string;
  remote_policy?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
}

// ==========================================
// Email & Cover Letter Response Types
// ==========================================

export interface EmailAndCoverLetterResponse {
  email: string | null;
  subject: string;
  body: string;         // The email-formatted cover letter
  cover_letter: string; // The full formal ATS cover letter
}

export interface DedicatedCoverLetterResponse {
  status: string;
  job_id: number;
  job_title: string;
  company: string;
  cover_letter: string;
  email_cover_letter: EmailAndCoverLetterResponse;
}

