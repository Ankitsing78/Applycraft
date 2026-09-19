// Lever ATS Adapter for ApplyCraft AI Companion Extension
export const LeverAdapter = {
  name: "Lever ATS",
  matches: (url) => url.includes("jobs.lever.co") || !!document.querySelector(".lever-application-form, .application-form"),

  detectForm: () => {
    const form = document.querySelector(".application-form, form#application-form, form[action*='lever.co']");
    if (!form) return null;

    return {
      formElement: form,
      fields: {
        fullName: form.querySelector("input[name='name']"),
        email: form.querySelector("input[name='email']"),
        phone: form.querySelector("input[name='phone']"),
        org: form.querySelector("input[name='org']"),
        urls: {
          linkedIn: form.querySelector("input[name='urls[LinkedIn]']"),
          github: form.querySelector("input[name='urls[GitHub]']"),
          portfolio: form.querySelector("input[name='urls[Portfolio]']")
        },
        resumeInput: form.querySelector("input[type='file'][name='resume']"),
        additionalInfo: form.querySelector("textarea[name='comments']"),
        submitBtn: form.querySelector("#btn-submit, button[type='submit']")
      }
    };
  },

  detectSecurityChallenge: () => {
    const challenge = document.querySelector(".g-recaptcha, iframe[src*='recaptcha'], iframe[src*='turnstile'], .h-captcha");
    if (challenge) {
      return {
        detected: true,
        type: "CAPTCHA_DETECTED",
        element: challenge,
        message: "CAPTCHA challenge detected on Lever form. Auto-paused for human handoff."
      };
    }
    return { detected: false };
  },

  detectConfirmation: () => {
    const confirmation = document.querySelector(".application-confirmation, .confirmation-page, .post-apply-container");
    if (confirmation) {
      return {
        submitted: true,
        receiptSnippet: confirmation.innerText.trim().slice(0, 200),
        confirmationSelector: ".application-confirmation"
      };
    }

    const heading = document.querySelector("h1, h2");
    if (heading && /application submitted|thank you for your interest/i.test(heading.innerText)) {
      return {
        submitted: true,
        receiptSnippet: heading.innerText.trim(),
        confirmationSelector: "h1, h2"
      };
    }

    return { submitted: false };
  }
};
