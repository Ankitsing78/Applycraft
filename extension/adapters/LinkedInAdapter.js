// LinkedIn Easy Apply Adapter for ApplyCraft AI Companion Extension
export const LinkedInAdapter = {
  name: "LinkedIn Easy Apply",
  matches: (url) => url.includes("linkedin.com"),

  detectForm: () => {
    const modal = document.querySelector(".jobs-easy-apply-modal, [data-test-modal-id='easy-apply-modal']");
    if (!modal) return null;

    return {
      modalElement: modal,
      fields: {
        inputs: Array.from(modal.querySelectorAll("input, select, textarea")),
        resumeInput: modal.querySelector("input[type='file']"),
        nextBtn: modal.querySelector("button[aria-label*='next'], button[aria-label*='Continue to next step']"),
        reviewBtn: modal.querySelector("button[aria-label*='Review your application']"),
        submitBtn: modal.querySelector("button[aria-label*='Submit application']")
      }
    };
  },

  detectSecurityChallenge: () => {
    const challenge = document.querySelector(".checkpoint-challenge, iframe[src*='checkpoint'], #captcha-internal");
    if (challenge) {
      return {
        detected: true,
        type: "MFA_OR_SECURITY_CHALLENGE",
        element: challenge,
        message: "LinkedIn security verification detected. Execution paused for user resolution."
      };
    }
    return { detected: false };
  },

  detectConfirmation: () => {
    const confirmation = document.querySelector(
      ".artdeco-inline-feedback--success, [data-test-modal-id='post-apply-modal'], .jobs-post-apply-modal"
    );
    if (confirmation) {
      return {
        submitted: true,
        receiptSnippet: confirmation.innerText.trim().slice(0, 200),
        confirmationSelector: ".jobs-post-apply-modal"
      };
    }

    const heading = document.querySelector("h3, h2");
    if (heading && /application was sent|applied to/i.test(heading.innerText)) {
      return {
        submitted: true,
        receiptSnippet: heading.innerText.trim(),
        confirmationSelector: "h3, h2"
      };
    }

    return { submitted: false };
  }
};
