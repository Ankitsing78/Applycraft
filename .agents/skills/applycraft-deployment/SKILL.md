---
name: applycraft-deployment
description: Static GitHub Pages frontend deployment, headless backend deployment on Render/Node, and CI/CD pipelines.
---

# ApplyCraft Deployment & Release Engineering Skill

## Purpose
Governs the continuous delivery and multi-environment deployment of the decoupled frontend and backend services.

## Deployment Guidelines
1. **GitHub Pages Static Export**:
   - Next.js static build configuration with basePath `/Applycraft`.
   - Dynamic API routing configured via `NEXT_PUBLIC_API_BASE_URL`.
   - Standalone demo mode if backend is unavailable.
2. **Backend Deployment**:
   - Containerized / Node-compatible backend suitable for Render, Railway, or Fly.io.
   - Structured environment configuration (`.env.example`).
3. **CI/CD Pipeline**:
   - GitHub Actions workflow running lint, typecheck, unit tests, security checks, and static deployment.
4. **Verification**:
   - Smoke test live endpoints after release.
