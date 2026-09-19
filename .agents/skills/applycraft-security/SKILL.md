---
name: applycraft-security
description: Security auditing, anti-credential harvesting, CAPTCHA/MFA auto-pause, CORS, and token validation.
---

# ApplyCraft Security Engineering Skill

## Purpose
Ensures ApplyCraft adheres to the highest data privacy, credential protection, and web security standards.

## Security Mandates
1. **Zero Credential Harvesting**:
   - Never prompt for, store, or transmit third-party portal passwords.
2. **CAPTCHA & MFA Auto-Pause**:
   - Immediately pause automation when a challenge is detected. Never attempt automated bypass.
3. **CORS & Allowed Origins**:
   - Restrict API access to trusted frontend origins (e.g. `https://ankitsing78.github.io`).
4. **Data Minimization & User Rights**:
   - Export candidate data (JSON/CSV).
   - Delete account & all associated facts with complete cleanup.
5. **No Secret Leakage**:
   - Gemini API keys, Supabase Service Role keys, and encryption secrets must never appear in client bundles or git commits.
