# ApplyCraft AI — Forensic Audit Report (Phase 0)

**Date**: September 20, 2026  
**Auditor**: Principal Architect & Security Auditor  
**Target Repository**: `https://github.com/ankitsing78/Applycraft`  
**Live Site**: `https://ankitsing78.github.io/Applycraft/`  
**Local Workspace**: `C:\Users\ankit\.gemini\antigravity\scratch\autoapply-agent`

---

## 1. Executive Summary

ApplyCraft was initially scaffolded as a monolithic Next.js 14 web application with local JSON file storage (`data/store.json`) and a basic Manifest V3 companion extension skeleton. While the UI structure and concept are compelling, the current implementation contains critical defects, architectural limitations, and simulated behaviors that violate core production and security requirements.

### Key Audit Findings:
1. **GitHub Pages Incompatibility**: The frontend makes relative calls to `/api/*`. Because GitHub Pages serves only static files, all `POST` / `PUT` endpoints fail with `404 Not Found` or `405 Method Not Allowed`.
2. **Fabricated Confirmation Numbers**: `src/app/api/applications/route.ts` generates a synthetic ID using `Math.random().toString(36)` and claims successful application submission without receiving any submission signal from the target portal.
3. **Hard-coded Job Extraction**: `src/app/api/parse-jd/route.ts` contains hard-coded sample text for LinkedIn and Naukri URLs instead of executing real HTTP or DOM extraction.
4. **Ungrounded Resume Generation**: The current resume tailoring function does not enforce candidate evidence traceability, allowing the LLM or heuristic model to potentially fabricate achievements or claims.
5. **Primitive Extension Content Script**: `extension/content.js` relies on a generic `input[name*="..."]` selector that fails on complex enterprise ATS platforms (Greenhouse, Lever, Workday) and lacks CAPTCHA/MFA pause controls, real file upload handling, and submission verification.
6. **Lack of True Database & Authentication**: Candidate career details, applications, and portal session states are written to a single unauthenticated local JSON file (`data/store.json`).

---

## 2. Codebase Forensic Analysis

### 2.1 File System & Routing Audit
- `src/app/page.tsx`: Overview dashboard. Assumes same-origin API `/api/profile`, `/api/portals`, `/api/applications`.
- `src/app/apply/page.tsx`: Contains sample button shortcuts and calls `/api/parse-jd` and `/api/tailor-resume`.
- `src/app/review/page.tsx`: Human review page. Currently calls `/api/autofill` and `/api/applications` (`action: "confirm_apply"`).
- `src/app/tracker/page.tsx`: Kanban tracker reading from `/api/applications`.
- `src/app/portals/page.tsx`: Statically simulates session states (`isSessionActive = p.id !== "foundit"`).
- `src/lib/storage.ts`: Reads/writes synchronous JSON to `data/store.json`. Fails on serverless or static hosting.

### 2.2 Security & Compliance Audit
- **CORS & Origin Security**: No explicit CORS headers configured on API routes.
- **Authentication**: No user session or JWT validation. Any visitor can read or modify the candidate profile.
- **Data Minimization**: Full profile details are loaded indiscriminately.
- **Prompt Injection**: `src/lib/ai/tailor.ts` injects raw JD text directly into the LLM prompt without strict delimiters or system instruction boundaries declaring JD as untrusted data.

### 2.3 Simulated / Mock Code Occurrences
| File | Line | Content | Classification | Severity |
| :--- | :--- | :--- | :--- | :--- |
| `src/app/api/applications/route.ts` | 30 | `const confirmationId = "CONF-" + Math.random()...` | Production Bug | **CRITICAL** (Violates Rule 1) |
| `src/app/api/parse-jd/route.ts` | 11-47 | Hard-coded JD text for LinkedIn & Naukri URLs | Production Bug | **CRITICAL** (Violates Rule 5) |
| `src/app/api/portals/route.ts` | 27 | `isSessionActive = p.id !== "foundit"` | Production Bug | **HIGH** (Simulated connection) |
| `src/lib/ai/tailor.ts` | 179 | `Math.min(99, Math.max(93, job.atsScore + 8))` | Production Bug | **HIGH** (Fabricated score boost) |
| `src/lib/storage.ts` | 25-240 | Hardcoded default profile & portals | Prototype Seed | **MEDIUM** (Needs DB migration) |

---

## 3. Live Site Audit (`https://ankitsing78.github.io/Applycraft/`)

- **Rendering**: Static HTML and assets load with basePath `/Applycraft`.
- **API Failure**: Any dynamic interaction (saving profile, analyzing real JD, submitting review) fails because GitHub Pages cannot execute server-side Node.js API routes.
- **Console Errors**: Requests to `/api/*` fail with `404` or return static HTML.

---

## 4. Remediation Mandate

To fulfill the Master Build requirements:
1. **Decouple Frontend and Backend**:
   - Update frontend to point to `NEXT_PUBLIC_API_BASE_URL` (HTTPS).
   - Retain GitHub Pages as static demo/production frontend with clear "DEMO MODE" indicator when backend is disconnected.
2. **Build Normalized Backend API (`/api/v1/...`)**:
   - Authentication (Supabase Auth / JWT).
   - Real database persistence (Supabase PostgreSQL / schema migrations).
   - Real JD extraction engine (Layered: Extension DOM -> HTTP Scraper -> JSON-LD / Meta -> Manual Paste Fallback).
   - Real candidate evidence graph (traceable claims, 0 accepted hallucinations).
3. **Build Real Browser Extension & ATS Adapter Framework**:
   - Dedicated adapters for Greenhouse, Lever, Workday, LinkedIn, Indeed, Naukri, Foundit, Shine, Hirist.
   - React/Vue controlled input setters.
   - Real file upload handling via Blob/DataTransfer.
   - CAPTCHA/MFA auto-pause mechanism.
   - Real submission verification (detecting actual success page, confirmation message, target URL change, 0 false-positive submissions).
