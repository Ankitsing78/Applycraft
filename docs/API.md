# ApplyCraft AI — REST & Extension Bridge API Reference

Version: `1.0.0`  
Protocol: `HTTPS / JSON`  
Base URL (Local): `http://localhost:3000`  
Base URL (Production Backend): Configurable via `NEXT_PUBLIC_API_BASE_URL`

---

## 1. Overview & Architecture

ApplyCraft AI provides a decoupled API architecture:
- **Client Frontend**: Next.js 14 App Router, deployed statically to GitHub Pages or Node runtime.
- **Companion Extension Bridge**: Chrome Manifest V3 extension facilitating authenticated DOM execution on portal tabs without credential leakage.
- **AI Tailoring Engine**: Google Gemini 1.5 Flash + Candidate Evidence Graph for 0-hallucination resume tailoring.

---

## 2. API Endpoints

### 2.1 Parse Job Description
Extracts structured role parameters, requirements, and required skills from raw job descriptions or portal URLs.

- **Endpoint**: `POST /api/parse-jd`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "rawJd": "We are seeking a Senior Full Stack Engineer with 5+ years experience in TypeScript, React, and Node.js...",
  "jobUrl": "https://www.linkedin.com/jobs/view/41092837"
}
```
- **Response**:
```json
{
  "success": true,
  "job": {
    "id": "job-1726772100000",
    "title": "Senior Full Stack Engineer",
    "company": "Target Company",
    "location": "Remote / Hybrid",
    "workMode": "Remote",
    "experienceRequired": "5+ years",
    "extractedSkills": ["TypeScript", "React.js", "Node.js", "PostgreSQL", "AWS"],
    "matchingSkills": ["TypeScript", "React.js", "Node.js"],
    "missingSkills": ["AWS"],
    "atsScore": 92
  }
}
```

---

### 2.2 Tailor Resume (Evidence-Grounded)
Generates an ATS-optimized headline, summary, and grounded experience bullets anchored in the candidate's verified profile.

- **Endpoint**: `POST /api/tailor-resume`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "profile": { ... },
  "job": { ... }
}
```
- **Response**:
```json
{
  "success": true,
  "tailoredResume": {
    "id": "tailored-1726772150000",
    "tailoredHeadline": "Ankit Sharma | Senior Full Stack Engineer (TypeScript • React.js • Node.js)",
    "tailoredSummary": "Results-driven Senior Full Stack Engineer with 6+ years experience...",
    "tailoredBullets": [
      {
        "experienceId": "exp-1",
        "company": "Nexus Cloud Technologies",
        "role": "Senior Full Stack Engineer",
        "originalBullets": ["Architected core dashboard..."],
        "tailoredBullets": ["Architected core dashboard handling 120k+ DAU..."],
        "evidencePointers": ["fact-exp-exp-1-0"],
        "groundingScore": 1.0
      }
    ],
    "groundingAudit": {
      "totalClaims": 4,
      "groundedClaims": 4,
      "ungroundedClaims": 0,
      "groundingScore": 1.0,
      "zeroHallucinationVerified": true
    },
    "atsScore": 96
  }
}
```

---

### 2.3 Application Form Autofill & Review
Generates mapped form fields and stages human-in-the-loop review.

- **Endpoint**: `POST /api/autofill`
- **Request Body**:
```json
{
  "profile": { ... },
  "job": { ... },
  "tailoredResume": { ... }
}
```
- **Response**:
```json
{
  "success": true,
  "review": {
    "id": "rev-1726772200000",
    "jobTitle": "Senior Full Stack Engineer",
    "company": "Acme Cloud",
    "portal": "greenhouse",
    "fields": [
      {
        "id": "f_first_name",
        "name": "first_name",
        "label": "First Name",
        "type": "text",
        "value": "Ankit",
        "confidence": 100,
        "isUserEdited": false
      }
    ],
    "status": "ready_for_review"
  }
}
```

---

### 2.4 Application Confirmation & Submission
Submits reviewed applications with strict evidence enforcement.

- **Endpoint**: `POST /api/applications`
- **Supported Actions**:
  1. `confirm_apply`: Submit application
  2. `update_status`: Move application across Kanban stages
  3. `delete`: Remove application

#### Mode 1: Live Extension Submission (Verified ATS Evidence)
```json
{
  "action": "confirm_apply",
  "reviewId": "rev-1726772200000",
  "mode": "real_extension",
  "evidence": {
    "evidenceType": "dom_confirmation",
    "confirmationId": "GH-8492019",
    "rawReceiptSnippet": "Thank you for applying to Acme Cloud! Reference: GH-8492019.",
    "screenshotHash": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```
**Response**:
```json
{
  "success": true,
  "application": {
    "id": "app-1726772300000",
    "status": "applied",
    "confirmation": {
      "confirmationId": "GH-8492019",
      "isSimulated": false,
      "evidenceType": "dom_confirmation",
      "rawReceiptSnippet": "Thank you for applying to Acme Cloud!..."
    }
  }
}
```

#### Mode 2: Synthetic Demo Simulation (Standalone Web)
```json
{
  "action": "confirm_apply",
  "reviewId": "rev-1726772200000",
  "mode": "demo_simulation"
}
```
**Response**:
```json
{
  "success": true,
  "application": {
    "id": "app-1726772300000",
    "status": "demo_submitted",
    "confirmation": {
      "confirmationId": "SIM-DEMO-M09FK2",
      "isSimulated": true,
      "evidenceType": "synthetic_demo",
      "portalResponse": "[DEMO SIMULATION] Form fields validated & staged. Real ATS dispatch requires Companion Extension."
    }
  }
}
```

---

### 2.5 Portal Connection Management
- `GET /api/portals`: Retrieves status of all connected job hubs and ATS nodes.
- `POST /api/portals`: Connect, disconnect, or sync portal browser sessions.
  - Actions: `"connect"`, `"disconnect"`, `"toggle"`, `"sync_all"`.

---

## 3. Error Codes & Safety Invariants

| Code | Meaning | Remediation |
| :--- | :--- | :--- |
| `400` | Invalid request payload or missing parameters | Verify JSON schema |
| `404` | Review or application not found | Check reviewId |
| `CAPTCHA_CHALLENGE_DETECTED` | SecurityGuard detected reCAPTCHA/Turnstile | Auto-pause and hand off to human |
| `ZERO_EVIDENCE_REJECTION` | Attempted to mark 'applied' without receipt | Provide valid extension evidence |
