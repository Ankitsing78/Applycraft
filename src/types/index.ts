export type PortalId =
  | "linkedin"
  | "naukri"
  | "indeed"
  | "hirist"
  | "foundit"
  | "shine"
  | "greenhouse"
  | "workday"
  | "lever";

export type CandidateSkills = Record<string, string[]> & {
  languages?: string[];
  frameworks?: string[];
  cloudAndDevops?: string[];
  databases?: string[];
  tools?: string[];
  domainKnowledge?: string[];
};

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  isCurrent?: boolean;
  current?: boolean;
  technologies?: string[];
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  graduationYear?: string;
  gpa?: string;
  location?: string;
}

export interface ResumeItem {
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
  headline?: string;
  summary?: string;
  email: string;
  phone: string;
  location: string;
  currentRole?: string;
  totalExperienceYears?: number;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl?: string;
  skills: CandidateSkills;
  experience: ExperienceItem[];
  education: EducationItem[];
  questionnaire: {
    noticePeriod: string;
    expectedSalary: string;
    currentSalary: string;
    currency: string;
    willingToRelocate?: string | boolean;
    workAuthorization: string;
    requireVisaSponsorship: string;
    preferredWorkMode?: "Remote" | "Hybrid" | "On-site" | string;
    yearsOfExperience: number;
    gender?: string;
    veteranStatus?: string;
    disabilityStatus?: string;
    customAnswers: Record<string, string>;
  };
  resumes: ResumeItem[];
}

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

export interface EvidencePointer {
  id: string;
  sourceType: "experience" | "education" | "skill" | "questionnaire";
  sourceId: string;
  originalText: string;
  verified: boolean;
}

export interface GroundingAudit {
  totalClaims: number;
  groundedClaims: number;
  ungroundedClaims: number;
  groundingScore: number; // 0.0 to 1.0
  zeroHallucinationVerified: boolean;
  notes?: string[];
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
    evidencePointers?: string[];
    groundingScore?: number;
  }[];
  highlightedSkills: string[];
  customCoverLetter: string;
  screeningAnswers: Record<string, string>;
  atsScore: number;
  overallGroundingScore?: number;
  groundingAudit?: GroundingAudit;
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

export type SubmissionEvidenceType =
  | "dom_confirmation"
  | "http_receipt"
  | "user_manual_attestation"
  | "synthetic_demo";

export interface SubmissionConfirmation {
  confirmationId: string;
  timestamp: string;
  portalResponse: string;
  isSimulated: boolean;
  evidenceType: SubmissionEvidenceType;
  rawReceiptSnippet?: string;
  screenshotHash?: string;
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
  submissionConfirmation?: SubmissionConfirmation;
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
  status: "review_ready" | "ready_to_submit" | "demo_submitted" | "applied" | "screening" | "interview" | "offer" | "rejected";
  matchScore: number;
  appliedDate: string;
  tailoredResumeId?: string;
  reviewId?: string;
  confirmation?: SubmissionConfirmation;
  notes?: string;
}
