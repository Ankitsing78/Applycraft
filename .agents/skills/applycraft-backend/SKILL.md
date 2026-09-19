---
name: applycraft-backend
description: Robust production API service layer, schema validation, Supabase PostgreSQL persistence, and auth integration.
---

# ApplyCraft Backend Engineering Skill

## Purpose
Guides the design and implementation of the decoupled backend API service layer (`/api/v1/...`).

## Architecture Standards
1. **Layered Structure**:
   - Controller -> Validation (Zod) -> Service -> Repository -> Database.
2. **Normalized Schemas**:
   - Users, Profiles, Candidate Facts, Resumes, Jobs, Tailored Resumes, Applications, Submission Evidence, Audit Logs.
3. **Database Integration**:
   - Supabase PostgreSQL client with Row Level Security (RLS) enforcement.
   - Resilient fallback for local testing & development.
4. **Idempotency**:
   - Idempotency keys on application creation and submission actions.
5. **Rate Limiting & Health**:
   - Protection on AI and extraction routes.
   - Structured JSON health endpoints at `/health` and `/ready`.
