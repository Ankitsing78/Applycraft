---
name: applycraft-browser-automation
description: Manifest V3 browser extension architecture, background worker, secure pairing, and content script bridge.
---

# ApplyCraft Browser Automation Skill

## Purpose
Governs the companion browser extension providing direct native session access to job portals without collecting or storing third-party passwords.

## Architecture Guidelines
1. **Manifest V3**:
   - Background service worker, popup, and content script modules.
2. **Secure Token Pairing**:
   - One-time pairing code handshake with ApplyCraft web dashboard.
   - Zero portal passwords or raw cookies captured.
3. **Reactive DOM Observation**:
   - `MutationObserver` for dynamic multi-step form steps, modal popups, and async validations.
4. **State Machine Synchronization**:
   - Live bridge reporting active portal, detected form fields, confidence ratings, and review status to dashboard.
