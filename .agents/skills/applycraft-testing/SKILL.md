---
name: applycraft-testing
description: ATS fixture lab, synthetic field mapping accuracy tests, false-submission prevention, and end-to-end regression.
---

# ApplyCraft Testing & QA Skill

## Purpose
Establishes automated unit, integration, and end-to-end testing with realistic local ATS fixtures and rigorous accuracy benchmarks.

## Quality Gates
1. **ATS Fixture Lab**:
   - Synthetic local forms for Greenhouse, Lever, Workday, LinkedIn, Indeed, Naukri.
   - Dynamic variant testing (Variant A, B, C).
2. **Field Mapping Accuracy**:
   - 500+ synthetic fields suite.
   - Target: >= 99% correct semantic classification.
3. **False-Positive Submission Rejection**:
   - Simulate failed/unacknowledged submissions.
   - Target: exactly 0 false-positive submission reports.
4. **AI Grounding & Prompt Injection**:
   - Test adversarial JDs with malicious injection instructions.
   - Target: 0 accepted hallucinated candidate facts.
