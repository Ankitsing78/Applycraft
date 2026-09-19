---
name: applycraft-ats-adapters
description: Dedicated adapters for Greenhouse, Lever, Workday, LinkedIn, Indeed, Naukri, and generic ATS platforms.
---

# ApplyCraft ATS Adapters Skill

## Purpose
Provides specialized form-filling, input-handling, and verification adapters for enterprise and board-specific application portals.

## Requirements
1. **Adapter Interface**:
   ```ts
   interface ATSAdapter {
     id: string;
     name: string;
     matchesPage(): boolean;
     inspect(): Promise<FormModel>;
     fill(field: FieldModel, value: unknown): Promise<FillResult>;
     validate(): Promise<ValidationResult>;
     detectChallenge(): Promise<ChallengeSignal>;
     detectSubmit(): Promise<SubmitSignal>;
     detectSuccess(): Promise<SuccessSignal>;
   }
   ```
2. **Supported Platforms**:
   - Greenhouse (`boards.greenhouse.io`)
   - Lever (`jobs.lever.co`)
   - Workday (`*.myworkdayjobs.com`)
   - LinkedIn Easy Apply
   - Indeed Apply
   - Naukri.com, Hirist.tech, Foundit, Shine
   - Generic ATS fallback
3. **Controlled Inputs**:
   - Use native property descriptors to update React and Vue controlled components.
4. **File Upload Injection**:
   - Real DataTransfer / File creation and attachment.
