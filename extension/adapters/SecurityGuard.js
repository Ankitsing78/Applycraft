// SecurityGuard for ApplyCraft AI Companion Extension
// Enforces zero-credential scraping, auto-pause on CAPTCHA / 2FA challenges

export const SecurityGuard = {
  detectChallenges: () => {
    // 1. Google reCAPTCHA v2 / v3
    if (document.querySelector(".g-recaptcha, iframe[src*='google.com/recaptcha'], iframe[src*='recaptcha']")) {
      return {
        challengeDetected: true,
        type: "reCAPTCHA",
        guidance: "reCAPTCHA detected. Automated script paused. Please solve the challenge directly in the browser."
      };
    }

    // 2. Cloudflare Turnstile / Challenge
    if (document.querySelector(".cf-turnstile, iframe[src*='challenges.cloudflare.com'], #cf-challenge")) {
      return {
        challengeDetected: true,
        type: "Cloudflare Turnstile",
        guidance: "Cloudflare Turnstile challenge detected. Automated actions paused for human verification."
      };
    }

    // 3. hCaptcha
    if (document.querySelector(".h-captcha, iframe[src*='hcaptcha.com']")) {
      return {
        challengeDetected: true,
        type: "hCaptcha",
        guidance: "hCaptcha challenge detected. Automated actions paused for human verification."
      };
    }

    // 4. Arkose Labs / FunCaptcha
    if (document.querySelector("#arkose-iframe, iframe[src*='arkoselabs']")) {
      return {
        challengeDetected: true,
        type: "Arkose Labs",
        guidance: "Arkose challenge detected. Automated actions paused."
      };
    }

    return { challengeDetected: false };
  },

  assertNoPasswordHarvesting: (fields) => {
    const passwordFields = fields.filter((f) => f.type === "password" || (f.name && f.name.toLowerCase().includes("password")));
    if (passwordFields.length > 0) {
      throw new Error(
        "SECURITY VIOLATION: Password fields detected in form mapper. ApplyCraft uses authenticated companion sessions and strictly refuses password transmission."
      );
    }
    return true;
  }
};
