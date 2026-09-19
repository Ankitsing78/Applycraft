# Known Failures & Bugs — ApplyCraft AI

This document catalogs all verified architectural defects, code bugs, and compliance violations identified during the Phase 0 audit.

---

## 1. Fake Success & Fabricated Confirmation ID (Rule 1 Violation)
- **Location**: `src/app/api/applications/route.ts:30`
- **Issue**:
  ```ts
  const confirmationId = "CONF-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  review.status = "submitted";
  review.submissionConfirmation = {
    confirmationId,
    timestamp,
    portalResponse: `Successfully received and verified by ${review.company} career gateway.`
  };
  ```
- **Impact**: Applications are marked as "submitted" with a fake confirmation number even though no web agent interacted with or received an acknowledgement from the target company's ATS.
- **Fix**: Replace with `SubmissionEvidence` verification. Status must remain `SUBMISSION_VERIFYING` or `SUBMISSION_UNKNOWN` until a genuine confirmation page/signal is observed by the browser extension.

---

## 2. Hard-Coded Job Extraction Substituting Real URLs (Rule 5 Violation)
- **Location**: `src/app/api/parse-jd/route.ts:11-47`
- **Issue**: When a candidate enters a real LinkedIn or Naukri URL, the code discards the URL and returns hard-coded dummy text (`Senior Full Stack Engineer at TechCorp Global...`).
- **Impact**: Users applying for real jobs get tailored resumes based on fictitious job descriptions.
- **Fix**: Implement Layered Real Extraction (Extension DOM extraction -> Backend HTTP scraper with JSON-LD/OpenGraph -> Clean fallback with manual paste prompt).

---

## 3. Ungrounded AI Resume Claims & Hallucinations (Rule 2 Violation)
- **Location**: `src/lib/ai/tailor.ts:145-180`
- **Issue**: Bullet point tailoring injects skills and percentages without validating against candidate facts.
- **Impact**: The model could invent technologies, years of experience, or responsibilities.
- **Fix**: Introduce Candidate Knowledge Graph with `EvidenceId` verification. Claims not grounded in `VERIFIED` or `SUPPORTED` evidence are rejected.

---

## 4. Static GitHub Pages Hosting Failure
- **Location**: Frontend API calls in `src/app/**/*.tsx`
- **Issue**: The frontend calls relative paths like `fetch("/api/profile")`. On GitHub Pages (`https://ankitsing78.github.io/Applycraft/`), this requests static files that do not exist, completely breaking dynamic workflows.
- **Fix**:
  - Introduce `NEXT_PUBLIC_API_BASE_URL`.
  - Provide an explicit client-side `DEMO MODE` indicator when running disconnected from a live backend.

---

## 5. Generic Extension DOM Matching Failing on Complex ATS Forms
- **Location**: `extension/content.js:38-49`
- **Issue**: Uses `document.querySelector('input[name*="..."]')` and directly assigns `.value`.
- **Impact**:
  - React/Vue controlled form inputs do not trigger state updates and revert to empty upon submission.
  - Custom dropdowns (div/combobox/aria), radio groups, and multi-step forms are ignored.
  - File upload inputs cannot be filled.
- **Fix**: Implement dedicated `ATSAdapter` registry (Greenhouse, Lever, Workday, LinkedIn, Indeed, Naukri, Foundit, Shine, Hirist, Generic) with native property setters and Blob/DataTransfer file injection.

---

## 6. Lack of CAPTCHA and MFA Auto-Pause Handling (Rule 3 Violation)
- **Location**: Entire `extension/` directory
- **Issue**: No detection of Cloudflare Turnstile, reCAPTCHA, hCaptcha, or 2FA challenge screens.
- **Fix**: Implement `detectChallenge()` in all ATS adapters to pause automation and display:
  ```text
  AUTOMATION PAUSED — Human Action Required
  ```

---

## 7. Lack of Multi-Tenant Authentication & Row-Level Security
- **Location**: `src/lib/storage.ts`
- **Issue**: A single file `data/store.json` contains unauthenticated state.
- **Fix**: Integrate Supabase Auth / PostgreSQL with user ID associations and RLS policies on all tables.
