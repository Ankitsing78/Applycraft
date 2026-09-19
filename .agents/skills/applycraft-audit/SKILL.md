---
name: applycraft-audit
description: Forensic code audit, mock detection, and architectural compliance verification for ApplyCraft AI.
---

# ApplyCraft Forensic Audit Skill

## Purpose
Enforces rigorous inspection of the ApplyCraft codebase to identify and eliminate simulated, mock, or hard-coded logic in production execution paths.

## Key Checklists
1. **Mock Code Detection**:
   - Grep for `Math.random()`, `fake`, `dummy`, `mock`, `sample`, `simulate`, `hard-coded`.
   - Ensure zero random confirmation ID generators exist in submission pathways.
   - Verify all test fixtures are strictly confined to `tests/fixtures/`.

2. **Compliance Rules**:
   - Rule 1: Never fake success.
   - Rule 2: Never fabricate candidate facts.
   - Rule 3: Never bypass security (auto-pause on CAPTCHA/MFA).
   - Rule 4: Human-in-the-loop review mandatory before submit.
   - Rule 5: Real URLs and real data only.

3. **Audit Deliverables**:
   - `docs/AUDIT_REPORT.md`
   - `docs/KNOWN_FAILURES.md`
