# ApplyCraft AI (OpenJobAgent) 🚀

> **Open-Source AI Job Application Copilot with Companion Browser Bridge, Intelligent Resume Tailoring, and Mandatory Human-in-the-Loop Review.**

ApplyCraft automates the repetitive friction of searching and applying for tech jobs across **LinkedIn, Naukri.com, Indeed, Hirist.tech, Foundit, Shine, and enterprise ATS gateways (Workday, Greenhouse, Lever)**.

---

## 🌟 Why ApplyCraft? (The Architectural Advantage)

Traditional auto-apply tools ask candidates for their raw portal passwords and attempt headless logins on cloud servers. This approach fails because:
1. **Bot Banning & 2FA**: LinkedIn, Naukri, and Workday instantly challenge anomalous cloud server IPs with 2FA/SMS OTPs and CAPTCHAs.
2. **Credential Liability**: Storing plaintext or reversible third-party passwords on a central database creates severe security and privacy hazards.

### The Solution: Two-Tier Native Session Bridge
- **Zero Third-Party Passwords Stored**: ApplyCraft connects to your job boards via a lightweight **Companion Browser Extension**. If you are logged into LinkedIn, Naukri, or Indeed in your browser, ApplyCraft interacts directly with portal forms within your native, authenticated session.
- **Mandatory Human-in-the-Loop Review**: ApplyCraft **never** blind-submits applications. Before any form is submitted, a comprehensive **Review Screen** presents all pre-filled fields (contact details, compensation, notice period, and tailored screening question answers) so you can inspect and modify them with 1-click before confirmation.

---

## 🛠 Features

- **Candidate Master Profile**:
  - Centralized repository of work experience, education, skills matrix, and application preferences (Notice period, expected CTC, work authorization).
- **Universal Job & JD Parser**:
  - Paste any job URL (LinkedIn, Naukri, Indeed, Greenhouse, etc.) or raw text to extract required tech skills, experience thresholds, and ATS keywords.
- **AI Resume & Application Tailoring**:
  - Dynamically rewrites experience bullet points to match the target JD requirements with action verbs and quantifiable metrics.
  - Generates custom Cover Letters and bespoke answers to screening questions (e.g. *"Why this company?"*).
  - Works with **Google Gemini API** or the built-in heuristic NLP engine.
- **Smart Form-Filling Agent**:
  - Maps multi-step form inputs (names, emails, phone numbers, custom selects, notice periods, and resume attachments) to your profile.
- **Human-in-the-Loop Pre-Application Review**:
  - Visual verification checkpoint with AI confidence meters.
  - Inline editing of all fields and answers before final submission.
  - Generates verifiable submission receipts with confirmation IDs.
- **Application Kanban Tracker**:
  - Track applications across stages: *Review Ready*, *Applied*, *Screening*, *Technical Interview*, *Offer*, and *Archived*.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24 LTS)
- **npm**: v9+

### 2. Run the Web Application
```bash
# Navigate to project directory
cd C:\Users\ankit\.gemini\antigravity\scratch\autoapply-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Load the Companion Browser Extension
1. Open Google Chrome, Edge, or Brave and go to `chrome://extensions`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select the `extension/` directory:
   `C:\Users\ankit\.gemini\antigravity\scratch\autoapply-agent\extension`
4. The ApplyCraft bridge icon will appear in your browser toolbar, automatically syncing with your local dashboard.

---

## ⚙️ Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# Optional: Enable Google Gemini for generative resume tailoring
# (If omitted, ApplyCraft uses the built-in intelligent heuristic engine)
GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📂 Project Architecture

```
autoapply-agent/
├── data/
│   └── store.json             # Persistent local JSON database
├── extension/                 # Companion Browser Bridge (Manifest V3)
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js             # Form detection & autofill injector
│   └── background.js          # Tab session observer
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard & metrics overview
│   │   ├── profile/page.tsx   # Master Candidate Profile Editor
│   │   ├── portals/page.tsx   # Connected Portals & Session Sync Hub
│   │   ├── apply/page.tsx     # New Job Application Flow & Resume Tailor
│   │   ├── review/page.tsx    # Mandatory Human-in-the-Loop Review Screen
│   │   ├── tracker/page.tsx   # Kanban Application Tracker
│   │   ├── extension-guide/   # Step-by-step setup guide
│   │   └── api/
│   │       ├── profile/       # Profile CRUD API
│   │       ├── portals/       # Portal connection API
│   │       ├── parse-jd/      # JD extraction API
│   │       ├── tailor-resume/ # AI tailoring API
│   │       ├── autofill/      # Review & form field generation API
│   │       ├── applications/  # Application submission & Kanban API
│   │       └── extension/     # Bridge sync API
│   ├── components/
│   │   └── Navbar.tsx         # Modern responsive header & status indicators
│   ├── lib/
│   │   ├── ai/tailor.ts       # Gemini API & NLP heuristics
│   │   ├── connectors/        # Smart field mapper
│   │   └── storage.ts         # Persistent data layer
│   └── types/index.ts         # Complete TypeScript definitions
└── README.md
```

---

## 🔒 Security & Privacy Statement

ApplyCraft is built on the core principle that your personal career credentials should never be collected or stored on external servers:
- **No 3rd-party passwords stored**: Session state is retained in your native browser session.
- **No blind auto-submissions**: You retain complete review authority through the pre-application checkpoint.
- **Data stays local**: All profile data is saved locally on your machine.
