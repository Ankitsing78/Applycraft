# ApplyCraft AI — Production Deployment Guide

---

## 1. Deployment Topology

ApplyCraft AI supports two decoupled deployment tiers:

1. **Frontend Static Demo Tier (GitHub Pages)**:
   - Live URL: `https://ankitsing78.github.io/Applycraft/`
   - Static HTML/CSS/JS export generated via Next.js (`npm run build`).
   - Runs client-side fallback storage when disconnected from backend.
   - Allows users to test the UI, inspect portal matrix cards, and review tailored resumes in demo simulation mode.

2. **Full-Stack Node.js / Server Tier (Render / Vercel / Railway / Docker)**:
   - Runs the Next.js App Router Node.js server with REST APIs (`/api/parse-jd`, `/api/tailor-resume`, `/api/applications`, `/api/portals`).
   - Provides Gemini 1.5 Flash LLM resume tailoring and persistent database storage (`data/store.json` or Supabase).
   - Serves the Companion Extension bridge endpoint.

---

## 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Google Gemini API key for dynamic LLM parsing & tailoring
GEMINI_API_KEY=your_gemini_api_key_here

# Next.js Public Base URL (Points static frontend to live backend)
NEXT_PUBLIC_API_BASE_URL=https://your-applycraft-backend.onrender.com

# Node Environment
NODE_ENV=production
```

---

## 3. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run automated verification tests
npm test

# 3. Start local development server
npm run dev

# Server will be running at http://localhost:3000
```

---

## 4. Production Build & Verification

```bash
# 1. Compile Next.js production bundle
npm run build

# 2. Execute end-to-end test suites
node --experimental-strip-types --test tests/evidence-graph.test.mjs tests/false-positive-submission.test.mjs tests/ats-adapters.test.mjs
```

---

## 5. Companion Extension Installation

1. Open Google Chrome or any Chromium-based browser (Brave, Edge).
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the `extension/` directory inside this repository.
6. The ApplyCraft Companion Bridge icon will appear in your browser toolbar!
