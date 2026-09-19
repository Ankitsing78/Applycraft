import fs from "fs";
import path from "path";
import {
  CandidateProfile,
  PortalConnection,
  JobApplicationItem,
  ApplicationReviewData,
  TailoredResumeResult,
} from "@/types";

interface DatabaseSchema {
  profile: CandidateProfile;
  portals: PortalConnection[];
  applications: JobApplicationItem[];
  reviews: Record<string, ApplicationReviewData>;
  tailoredResumes: Record<string, TailoredResumeResult>;
  extensionBridgeState: {
    lastPing: string;
    extensionInstalled: boolean;
    activeTabPortal: string | null;
    currentJobUrl: string | null;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store.json");

const DEFAULT_PROFILE: CandidateProfile = {
  id: "candidate-001",
  fullName: "Ankit Sharma",
  headline: "Senior Full Stack Engineer | Next.js, Node.js, Distributed Systems & AI Integrations",
  email: "ankit.dev@example.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, India (Open to Remote / Hybrid)",
  portfolioUrl: "https://ankit-sharma.dev",
  linkedinUrl: "https://linkedin.com/in/ankit-dev-profile",
  githubUrl: "https://github.com/ankit-fullstack",
  summary:
    "Senior Full Stack Engineer with 6+ years of experience architecting high-throughput distributed web applications, modern React/Next.js micro-frontends, scalable Node.js/Python microservices, and AI-assisted workflow engines. Proven track record of improving latency by 45% and leading cross-functional engineering teams.",
  experience: [
    {
      id: "exp-1",
      company: "Nexus Cloud Technologies",
      role: "Lead Full Stack Engineer",
      location: "Bengaluru, India",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      technologies: ["Next.js", "TypeScript", "Node.js", "AWS", "PostgreSQL", "Docker", "Redis"],
      bullets: [
        "Architected and deployed a multi-tenant enterprise dashboard serving 120,000+ daily active users with 99.98% uptime.",
        "Engineered an automated data extraction and enrichment pipeline reducing API response latency from 1.8s to 320ms.",
        "Spearheaded the migration of legacy monolith to microservices using Next.js App Router and NestJS, accelerating release cycles by 40%.",
        "Mentored a team of 7 frontend and backend engineers, conducting code reviews and instituting CI/CD quality gates."
      ]
    },
    {
      id: "exp-2",
      company: "Apex Fintech Labs",
      role: "Senior Software Engineer",
      location: "Pune, India",
      startDate: "2019-08",
      endDate: "2022-02",
      current: false,
      technologies: ["React", "Express.js", "Python", "MongoDB", "Kafka", "Kubernetes"],
      bullets: [
        "Built resilient real-time payment gateway connectors handling 15M+ monthly transactions with zero data loss.",
        "Integrated automated KYC document verification using OCR and asynchronous job queues with RabbitMQ.",
        "Optimized database indices and aggregation queries in MongoDB, decreasing slow queries by 60%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology (B.Tech)",
      institution: "National Institute of Technology (NIT)",
      fieldOfStudy: "Computer Science & Engineering",
      startYear: "2015",
      endYear: "2019",
      gpa: "8.8 / 10"
    }
  ],
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "SQL", "Go (Basics)"],
    frameworks: ["React.js", "Next.js", "Node.js", "Express", "Tailwind CSS", "FastAPI"],
    cloudAndDevops: ["AWS (ECS, Lambda, S3, RDS)", "Docker", "Kubernetes", "GitHub Actions", "CI/CD"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    tools: ["Git", "Playwright", "Puppeteer", "Postman", "Linux", "Webpack/Vite"],
    domainKnowledge: ["Full Stack Architecture", "Microservices", "REST & GraphQL", "ATS Keyword Optimization", "Web Scraping & Automation"]
  },
  questionnaire: {
    workAuthorization: "Authorized to work in India (Citizen) / Open to Remote Global or Sponsored Relocation",
    requireVisaSponsorship: "No",
    noticePeriod: "30 Days (Negotiable to 15 Days)",
    currentSalary: "28,00,000",
    expectedSalary: "38,00,000",
    currency: "INR (₹)",
    willingToRelocate: "Yes",
    preferredWorkMode: "Hybrid",
    yearsOfExperience: 6,
    gender: "Male",
    veteranStatus: "Not a Veteran",
    disabilityStatus: "No Disability",
    customAnswers: {
      "Why are you interested in our company?":
        "I am passionate about building scalable, high-impact products that solve core operational friction. My background in distributed microservices and modern frontend architectures directly aligns with your tech stack.",
      "Describe a challenging technical problem you solved":
        "At Nexus Cloud, our analytics engine suffered latency spikes under heavy concurrent writes. I re-architected the ingest pipeline with Redis stream buffering and batched PostgreSQL inserts, slashing peak write latency by 72%."
    }
  },
  resumes: [
    {
      id: "res-master-1",
      title: "Senior Full Stack Engineer (Master Resume 2026)",
      fileName: "Ankit_Sharma_Senior_FullStack.pdf",
      lastUpdated: "2026-09-18",
      content: "Ankit Sharma - Senior Full Stack Engineer. 6+ years experience in Next.js, Node.js, AWS, PostgreSQL, Distributed Systems.",
      isDefault: true
    }
  ]
};

const DEFAULT_CAPABILITIES = {
  jobDetection: true,
  formDetection: true,
  resumeUpload: true,
  questionAutofill: true
};

const DEFAULT_PORTALS: PortalConnection[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Major Job Board",
    logoColor: "#0A66C2",
    url: "https://www.linkedin.com/jobs",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    profileUrl: "https://linkedin.com/in/ankit-dev-profile",
    lastChecked: "12:32 AM",
    lastSynced: "2026-09-19T22:30:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Easy Apply automation enabled via Companion Extension bridge. Active session verified."
  },
  {
    id: "naukri",
    name: "Naukri.com",
    category: "Major Job Board",
    logoColor: "#0047AB",
    url: "https://www.naukri.com",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    profileUrl: "https://my.naukri.com/HomePage/view",
    lastChecked: "12:30 AM",
    lastSynced: "2026-09-19T21:45:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Naukri fast apply & recruiter questionnaire prefill supported."
  },
  {
    id: "indeed",
    name: "Indeed",
    category: "Major Job Board",
    logoColor: "#2164f3",
    url: "https://www.indeed.com",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    lastChecked: "12:15 AM",
    lastSynced: "2026-09-19T18:10:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Indeed Apply modal detection & automatic profile sync."
  },
  {
    id: "hirist",
    name: "Hirist.tech",
    category: "Tech Portal",
    logoColor: "#F36F21",
    url: "https://www.hirist.tech",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    lastChecked: "11:55 PM",
    lastSynced: "2026-09-19T19:00:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Specialized tech portal auto-fill for high-growth tech roles."
  },
  {
    id: "foundit",
    name: "Foundit (Monster)",
    category: "Major Job Board",
    logoColor: "#6c2eb9",
    url: "https://www.foundit.in",
    status: "disconnected",
    statusText: "Disconnected",
    lastChecked: "10:20 PM",
    activeSessionDetected: false,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Click 'Connect Portal' or open Foundit in your browser with extension active."
  },
  {
    id: "shine",
    name: "Shine.com",
    category: "Major Job Board",
    logoColor: "#118076",
    url: "https://www.shine.com",
    status: "disconnected",
    statusText: "Disconnected",
    lastChecked: "09:40 PM",
    activeSessionDetected: false,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Ready for pairing via Companion Extension."
  },
  {
    id: "greenhouse",
    name: "Greenhouse ATS",
    category: "Enterprise ATS",
    logoColor: "#2A7B4C",
    url: "https://boards.greenhouse.io",
    status: "connected",
    statusText: "Browser Session Detected",
    lastChecked: "12:28 AM",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: false,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Direct career portal autofill. Detects custom screening questionnaires & resumes."
  },
  {
    id: "workday",
    name: "Workday Career Portal",
    category: "Enterprise ATS",
    logoColor: "#e26616",
    url: "https://myworkdayjobs.com",
    status: "connected",
    statusText: "Browser Session Detected",
    lastChecked: "12:25 AM",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: false,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Multi-page enterprise job portal flow mapper with Human-in-the-Loop review at each step."
  },
  {
    id: "lever",
    name: "Lever ATS",
    category: "Enterprise ATS",
    logoColor: "#4B4453",
    url: "https://jobs.lever.co",
    status: "connected",
    statusText: "Browser Session Detected",
    lastChecked: "12:10 AM",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Standard 1-page application autofill supported."
  }
];

const DEFAULT_APPLICATIONS: JobApplicationItem[] = [
  {
    id: "app-101",
    jobTitle: "Senior Staff Full Stack Engineer",
    company: "Stripe",
    portal: "greenhouse",
    jobUrl: "https://boards.greenhouse.io/stripe/jobs/5482910",
    status: "interview",
    matchScore: 94,
    appliedDate: "2026-09-16",
    notes: "System Design interview scheduled for Tuesday."
  },
  {
    id: "app-102",
    jobTitle: "Principal Web Platform Engineer",
    company: "Coinbase",
    portal: "lever",
    jobUrl: "https://jobs.lever.co/coinbase/a918f-2849",
    status: "screening",
    matchScore: 89,
    appliedDate: "2026-09-17",
    notes: "Recruiter screened via email. Reviewing portfolio."
  },
  {
    id: "app-103",
    jobTitle: "Lead Frontend / Full Stack Architect",
    company: "Razorpay",
    portal: "naukri",
    jobUrl: "https://www.naukri.com/job-listings-lead-frontend-architect-razorpay-29401",
    status: "applied",
    matchScore: 92,
    appliedDate: "2026-09-18",
    notes: "Submitted via Naukri Fast Apply with tailored resume."
  },
  {
    id: "app-104",
    jobTitle: "Senior Full Stack Engineer (Cloud & AI)",
    company: "Swiggy Tech",
    portal: "hirist",
    jobUrl: "https://www.hirist.tech/j/swiggy-senior-full-stack-engineer-184920.html",
    status: "review_ready",
    matchScore: 96,
    appliedDate: "2026-09-19",
    notes: "Form review completed. Waiting for candidate final 1-click submission."
  }
];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDB(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initialDB: DatabaseSchema = {
      profile: DEFAULT_PROFILE,
      portals: DEFAULT_PORTALS,
      applications: DEFAULT_APPLICATIONS,
      reviews: {},
      tailoredResumes: {},
      extensionBridgeState: {
        lastPing: new Date().toISOString(),
        extensionInstalled: true,
        activeTabPortal: "linkedin",
        currentJobUrl: "https://www.linkedin.com/jobs/view/senior-full-stack-engineer-41092837"
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), "utf-8");
    return initialDB;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (parsed && Array.isArray(parsed.portals)) {
      parsed.portals = parsed.portals.map((p) => ({
        ...p,
        statusText: p.statusText || (p.status === "connected" ? "Browser Session Detected" : "Disconnected"),
        lastChecked: p.lastChecked || "12:32 AM",
        capabilities: p.capabilities || DEFAULT_CAPABILITIES
      }));
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database file, returning fallback defaults:", error);
    return {
      profile: DEFAULT_PROFILE,
      portals: DEFAULT_PORTALS,
      applications: DEFAULT_APPLICATIONS,
      reviews: {},
      tailoredResumes: {},
      extensionBridgeState: {
        lastPing: new Date().toISOString(),
        extensionInstalled: true,
        activeTabPortal: null,
        currentJobUrl: null
      }
    };
  }
}

function writeDB(data: DatabaseSchema): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const Storage = {
  getProfile(): CandidateProfile {
    return readDB().profile;
  },

  updateProfile(profile: CandidateProfile): CandidateProfile {
    const db = readDB();
    db.profile = profile;
    writeDB(db);
    return db.profile;
  },

  getPortals(): PortalConnection[] {
    return readDB().portals;
  },

  updatePortal(id: string, updates: Partial<PortalConnection>): PortalConnection | null {
    const db = readDB();
    const index = db.portals.findIndex((p) => p.id === id);
    if (index === -1) return null;
    db.portals[index] = { ...db.portals[index], ...updates };
    writeDB(db);
    return db.portals[index];
  },

  connectPortal(id: string): PortalConnection | null {
    const db = readDB();
    const index = db.portals.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    db.portals[index] = {
      ...db.portals[index],
      status: "connected",
      statusText: "Browser Session Detected",
      activeSessionDetected: true,
      lastChecked: timeStr,
      lastSynced: now.toISOString(),
      capabilities: db.portals[index].capabilities || DEFAULT_CAPABILITIES
    };
    writeDB(db);
    return db.portals[index];
  },

  disconnectPortal(id: string): PortalConnection | null {
    const db = readDB();
    const index = db.portals.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    db.portals[index] = {
      ...db.portals[index],
      status: "disconnected",
      statusText: "Disconnected",
      activeSessionDetected: false,
      lastChecked: timeStr
    };
    writeDB(db);
    return db.portals[index];
  },

  togglePortal(id: string): PortalConnection | null {
    const db = readDB();
    const index = db.portals.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const current = db.portals[index];
    const newStatus = current.status === "connected" ? "disconnected" : "connected";
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    db.portals[index] = {
      ...current,
      status: newStatus,
      statusText: newStatus === "connected" ? "Browser Session Detected" : "Disconnected",
      activeSessionDetected: newStatus === "connected",
      lastChecked: timeStr,
      lastSynced: newStatus === "connected" ? now.toISOString() : current.lastSynced
    };
    writeDB(db);
    return db.portals[index];
  },

  getApplications(): JobApplicationItem[] {
    return readDB().applications;
  },

  addApplication(app: JobApplicationItem): JobApplicationItem {
    const db = readDB();
    db.applications.unshift(app);
    writeDB(db);
    return app;
  },

  updateApplication(id: string, updates: Partial<JobApplicationItem>): JobApplicationItem | null {
    const db = readDB();
    const index = db.applications.findIndex((a) => a.id === id);
    if (index === -1) return null;
    db.applications[index] = { ...db.applications[index], ...updates };
    writeDB(db);
    return db.applications[index];
  },

  deleteApplication(id: string): boolean {
    const db = readDB();
    const initialLen = db.applications.length;
    db.applications = db.applications.filter((a) => a.id !== id);
    if (db.applications.length !== initialLen) {
      writeDB(db);
      return true;
    }
    return false;
  },

  saveTailoredResume(resume: TailoredResumeResult): TailoredResumeResult {
    const db = readDB();
    db.tailoredResumes[resume.id] = resume;
    writeDB(db);
    return resume;
  },

  getTailoredResume(id: string): TailoredResumeResult | null {
    const db = readDB();
    return db.tailoredResumes[id] || null;
  },

  saveReview(review: ApplicationReviewData): ApplicationReviewData {
    const db = readDB();
    db.reviews[review.id] = review;
    writeDB(db);
    return review;
  },

  getReview(id: string): ApplicationReviewData | null {
    const db = readDB();
    return db.reviews[id] || null;
  },

  getRecentReview(): ApplicationReviewData | null {
    const db = readDB();
    const keys = Object.keys(db.reviews);
    if (keys.length === 0) return null;
    return db.reviews[keys[keys.length - 1]];
  },

  getExtensionBridgeState() {
    return readDB().extensionBridgeState;
  },

  updateExtensionBridgeState(updates: Partial<DatabaseSchema["extensionBridgeState"]>) {
    const db = readDB();
    db.extensionBridgeState = {
      ...db.extensionBridgeState,
      ...updates,
      lastPing: new Date().toISOString()
    };
    writeDB(db);
    return db.extensionBridgeState;
  }
};
