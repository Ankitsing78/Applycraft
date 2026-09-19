export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface MasterResume {
  id: string;
  title: string;
  fileName: string;
  lastUpdated: string;
  content: string;
  isDefault: boolean;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: {
    languages: string[];
    frameworks: string[];
    cloudAndDevops: string[];
    databases: string[];
    tools: string[];
    domainKnowledge: string[];
  };
  questionnaire: {
    workAuthorization: string;
    requireVisaSponsorship: "Yes" | "No";
    noticePeriod: string; // e.g. "Immediate", "15 days", "30 days"
    currentSalary: string;
    expectedSalary: string;
    currency: string;
    willingToRelocate: "Yes" | "No" | "Remote Only";
    preferredWorkMode: "Remote" | "Hybrid" | "On-site" | "Any";
    yearsOfExperience: number;
    gender: string;
    veteranStatus: string;
    disabilityStatus: string;
    customAnswers: Record<string, string>;
  };
  resumes: MasterResume[];
}

export type PortalId =
  | "linkedin"
  | "naukri"
  | "indeed"
  | "hirist"
  | "foundit"
  | "shine"
  | "greenhouse"
  | "lever"
  | "workday";

export interface PortalCapabilities {
  jobDetection: boolean;
  formDetection: boolean;
  resumeUpload: boolean;
  questionAutofill: boolean;
}

export interface PortalConnection {
  id: PortalId;
  name: string;
  category: "Major Job Board" | "Tech Portal" | "Enterprise ATS";
  logoColor: string;
  url: string;
  status: "connected" | "disconnected" | "syncing" | "session_expired";
  statusText?: string;
  username?: string;
  profileUrl?: string;
  lastChecked?: string;
  lastSynced?: string;
  activeSessionDetected: boolean;
  capabilities: PortalCapabilities;
  supportedFeatures: {
    oneClickApply: boolean;
    tailoredResumeUpload: boolean;
    questionnaireAutofill: boolean;
  };
  notes: string;
}

export interface JobDetails {
  id: string;
  url?: string;
  portal?: PortalId | "direct";
  title: string;
  company: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  experienceRequired: string;
  salaryRange?: string;
  rawJd: string;
  extractedRequirements: string[];
  extractedSkills: string[];
  atsScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  tailoringRecommendations: string[];
}

export interface TailoredResumeResult {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  tailoredHeadline: string;
  tailoredSummary: string;
  tailoredBullets: {
    experienceId: string;
    company: string;
    role: string;
    originalBullets: string[];
    tailoredBullets: string[];
    rationale: string;
  }[];
  highlightedSkills: string[];
  customCoverLetter: string;
  screeningAnswers: Record<string, string>;
  atsScore: number;
  createdAt: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "radio" | "file" | "checkbox";
  value: string;
  originalValue?: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
  category: "personal" | "experience" | "education" | "screening" | "legal" | "document";
  confidence: number; // 0 to 100%
  sourceField: string;
  isUserEdited: boolean;
}

export interface ApplicationReviewData {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  portal: PortalId | "direct";
  portalJobUrl: string;
  fields: FormField[];
  tailoredResumeId: string;
  tailoredResumeName: string;
  coverLetter: string;
  status: "ready_for_review" | "confirmed" | "submitting" | "submitted" | "failed";
  submissionConfirmation?: {
    confirmationId: string;
    timestamp: string;
    portalResponse: string;
  };
  notes: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface JobApplicationItem {
  id: string;
  jobTitle: string;
  company: string;
  portal: PortalId | "direct";
  jobUrl: string;
  status: "review_ready" | "applied" | "screening" | "interview" | "offer" | "rejected";
  matchScore: number;
  appliedDate: string;
  tailoredResumeId?: string;
  reviewId?: string;
  notes?: string;
}
