import test from "node:test";
import assert from "node:assert/strict";
import { CandidateEvidenceGraph } from "../src/lib/ai/evidenceGraph.ts";

const mockProfile = {
  id: "test-candidate-1",
  fullName: "Ankit Sharma",
  email: "ankit.dev@example.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  currentRole: "Senior Full Stack Engineer",
  totalExperienceYears: 6,
  linkedinUrl: "https://linkedin.com/in/ankit-dev-profile",
  githubUrl: "https://github.com/Ankitsing78",
  skills: [
    { name: "TypeScript", category: "frontend", proficiency: "expert", verifiedInResume: true },
    { name: "React.js", category: "frontend", proficiency: "expert", verifiedInResume: true },
    { name: "Node.js", category: "backend", proficiency: "expert", verifiedInResume: true },
    { name: "PostgreSQL", category: "database", proficiency: "advanced", verifiedInResume: true },
    { name: "AWS", category: "devops", proficiency: "advanced", verifiedInResume: true }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Nexus Cloud Technologies",
      role: "Senior Full Stack Engineer",
      location: "Bengaluru",
      startDate: "2022-03",
      endDate: "Present",
      isCurrent: true,
      bullets: [
        "Architected core dashboard handling 120,000+ daily active users with Next.js and TypeScript.",
        "Engineered real-time notification engine with Redis and WebSocket reducing latency by 45%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science & Engineering",
      institution: "National Institute of Technology",
      graduationYear: "2020",
      location: "India"
    }
  ],
  questionnaire: {
    noticePeriod: "30 Days",
    expectedSalary: "40,00,000",
    currentSalary: "28,00,000",
    currency: "INR",
    willingToRelocate: true,
    workAuthorization: "Citizen (No visa sponsorship required)",
    requireVisaSponsorship: "No",
    preferredWorkMode: "Hybrid",
    yearsOfExperience: 6,
    customAnswers: {}
  },
  resumes: []
};

test("CandidateEvidenceGraph builds facts and verifies candidate skills", () => {
  const graph = new CandidateEvidenceGraph(mockProfile);

  assert.equal(graph.hasVerifiedSkill("TypeScript"), true);
  assert.equal(graph.hasVerifiedSkill("React.js"), true);
  assert.equal(graph.hasVerifiedSkill("Node.js"), true);
  assert.equal(graph.hasVerifiedSkill("PostgreSQL"), true);

  // Skill candidate does NOT have
  assert.equal(graph.hasVerifiedSkill("Cobol"), false);
  assert.equal(graph.hasVerifiedSkill("Rust"), false);
});

test("CandidateEvidenceGraph finds supporting evidence for resume bullets", () => {
  const graph = new CandidateEvidenceGraph(mockProfile);
  const evidence = graph.findSupportingEvidence("Architected core dashboard with Next.js and high concurrency");

  assert.ok(evidence.length > 0, "Should find supporting evidence for dashboard bullet");
  assert.equal(evidence[0].sourceType, "experience");
});

test("CandidateEvidenceGraph audits resume and verifies zero hallucinations", () => {
  const graph = new CandidateEvidenceGraph(mockProfile);

  const mockJob = {
    id: "job-101",
    title: "Senior Full Stack Engineer",
    company: "Acme Cloud",
    location: "Remote",
    workMode: "Remote",
    experienceRequired: "5+ years",
    rawJd: "Looking for TypeScript and React developer",
    extractedRequirements: ["Build resilient web apps"],
    extractedSkills: ["TypeScript", "React.js", "Node.js"],
    atsScore: 92,
    matchingSkills: ["TypeScript", "React.js", "Node.js"],
    missingSkills: ["Rust"],
    tailoringRecommendations: []
  };

  const validTailoredResume = {
    id: "tailored-1",
    jobId: "job-101",
    jobTitle: "Senior Full Stack Engineer",
    company: "Acme Cloud",
    tailoredHeadline: "Ankit Sharma | Senior Full Stack Engineer (TypeScript • React.js • Node.js)",
    tailoredSummary: "Results-driven Senior Full Stack Engineer with 6+ years experience. Proven expertise in TypeScript, React.js, Node.js.",
    tailoredBullets: [
      {
        experienceId: "exp-1",
        company: "Nexus Cloud Technologies",
        role: "Senior Full Stack Engineer",
        originalBullets: ["Architected core dashboard handling 120,000+ daily active users with Next.js and TypeScript."],
        tailoredBullets: ["Architected core dashboard handling 120,000+ daily active users with Next.js, TypeScript, and microservices."],
        rationale: "Grounded in verified experience."
      }
    ],
    highlightedSkills: ["TypeScript", "React.js", "Node.js"],
    customCoverLetter: "Cover letter text",
    screeningAnswers: {},
    atsScore: 95,
    createdAt: new Date().toISOString()
  };

  const audit = graph.auditTailoredResume(validTailoredResume, mockJob);
  assert.equal(audit.zeroHallucinationVerified, true, "Valid resume must pass zero hallucination audit");
  assert.ok(audit.groundingScore >= 0.9, `Grounding score should be >= 0.9, got ${audit.groundingScore}`);
  assert.equal(audit.ungroundedClaims, 0);
});

test("CandidateEvidenceGraph catches fabricated unverified skill claims", () => {
  const graph = new CandidateEvidenceGraph(mockProfile);

  const mockJob = {
    id: "job-102",
    title: "Rust Platform Lead",
    company: "Systems Inc",
    location: "Remote",
    workMode: "Remote",
    experienceRequired: "5+ years",
    rawJd: "Looking for Rust expert",
    extractedRequirements: ["Build high-performance engines"],
    extractedSkills: ["Rust"],
    atsScore: 70,
    matchingSkills: [],
    missingSkills: ["Rust"],
    tailoringRecommendations: []
  };

  const hallucinatedResume = {
    id: "tailored-2",
    jobId: "job-102",
    jobTitle: "Rust Platform Lead",
    company: "Systems Inc",
    tailoredHeadline: "Ankit Sharma | Rust Expert",
    tailoredSummary: "Engineer with 6 years experience in Rust and memory-safe systems.", // False claim!
    tailoredBullets: [
      {
        experienceId: "exp-1",
        company: "Nexus Cloud Technologies",
        role: "Senior Full Stack Engineer",
        originalBullets: ["Architected core dashboard"],
        tailoredBullets: ["Wrote Linux kernel modules entirely in Rust."], // Ungrounded invention!
        rationale: "Fabricated"
      }
    ],
    highlightedSkills: ["Rust"],
    customCoverLetter: "Text",
    screeningAnswers: {},
    atsScore: 80,
    createdAt: new Date().toISOString()
  };

  const audit = graph.auditTailoredResume(hallucinatedResume, mockJob);
  assert.equal(audit.zeroHallucinationVerified, false, "Audit must fail when unverified claims are made");
  assert.ok(audit.ungroundedClaims > 0, "Must flag ungrounded claims");
});
