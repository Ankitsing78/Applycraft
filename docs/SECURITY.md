# ApplyCraft AI — Security & Privacy Architecture

Version: `1.0.0`  
Standard: `Zero-Trust Candidate Privacy & Authenticated Browser Extension Boundary`

---

## 1. Threat Model & Design Principles

Traditional web scrapers and auto-apply bots ask candidates for their raw portal passwords (e.g. LinkedIn or Naukri credentials) and attempt to run automated Puppeteer/Playwright scripts on remote servers. This approach has critical flaws:
1. **Severe Credential Theft Liability**: Centralized databases storing plaintext or reversible passwords become honeypots for attackers.
2. **Immediate Bot Detection**: Cloudflare, PerimeterX, and portal 2FA challenges instantly flag and ban remote datacenter IP ranges.
3. **Violation of Terms of Service**: Storing credentials violates privacy policies and user security agreements.

### The ApplyCraft Alternative: Companion Browser Bridge
ApplyCraft AI eliminates password collection entirely:
```
+-------------------------------------------------------------+
|                      USER'S LOCAL BROWSER                   |
|                                                             |
|   [ LinkedIn / Naukri / Workday Tab ]                       |
|   ● Authenticated cookies remain safely in local browser     |
|   ● Zero session tokens exported                            |
|                            ▲                                |
|                            │ DOM Inspection & Autofill      |
|                            ▼                                |
|   [ ApplyCraft AI Companion Extension ]                     |
|   ● Manifest V3 sandbox                                     |
|   ● SecurityGuard monitors DOM for CAPTCHA & passwords      |
|                            ▲                                |
|                            │ PostMessage / Local Bridge     |
|                            ▼                                |
|   [ ApplyCraft Web Dashboard (localhost or static demo) ]   |
|   ● Human-in-the-Loop review before any submission          |
|   ● Zero passwords stored in LocalStorage or database       |
+-------------------------------------------------------------+
```

---

## 2. Core Security Invariants

### Invariant 1: Zero-Credential Storage Policy
- **No Password Inputs**: The ApplyCraft schema, profile models, and database contain zero fields for portal passwords.
- **Session Re-use**: Applications are executed using the candidate's existing, authenticated browser session on the target portal.
- **Local Isolation**: All candidate resume artifacts and profile questionnaire answers are saved exclusively in local storage or the user's private server.

### Invariant 2: Active CAPTCHA & Security Challenge Auto-Pause
- `SecurityGuard.js` scans the DOM before initiating any automated keystroke or click dispatch.
- If signatures of `g-recaptcha`, `cf-turnstile`, `h-captcha`, or Arkose Labs are identified:
  1. Automation is immediately halted.
  2. The candidate receives an alert: `"CAPTCHA detected. Automated script paused for human handoff."`
  3. The system waits until the candidate solves the challenge and clicks "Resume".

### Invariant 3: Anti-Hallucination Evidence Graph
- The `CandidateEvidenceGraph` guarantees that the AI cannot invent degrees, companies, or production years of experience in technologies the candidate has not verified.
- Missing skills required by the job posting are explicitly flagged as "transferable" or "rapid adoption" items rather than fabricated claims.

### Invariant 4: Zero Fake Success Guarantee
- Submissions cannot be marked as `applied` or assigned genuine ATS receipt references unless genuine DOM or HTTP confirmation evidence is returned by the companion extension.
- Standalone web submissions are transparently tagged `[DEMO SIMULATION]` to prevent misleading the user.

---

## 3. Incident Response & Bug Bounty
For security disclosures or audit inquiries, please contact the maintainers via GitHub Issues or security advisory on `https://github.com/Ankitsing78/Applycraft`.
