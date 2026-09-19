// Workday ATS Adapter for ApplyCraft AI Companion Extension
export const WorkdayAdapter = {
  name: "Workday Career Portal",
  matches: (url) => url.includes("myworkdayjobs.com") || !!document.querySelector("[data-automation-id*='workday']"),

  detectForm: () => {
    const pageContainer = document.querySelector("[data-automation-id='formPage'], main, form");
    if (!pageContainer) return null;

    return {
      formElement: pageContainer,
      fields: {
        firstName: document.querySelector("[data-automation-id='legalNameSection_firstName'] input, input[id*='firstName']"),
        lastName: document.querySelector("[data-automation-id='legalNameSection_lastName'] input, input[id*='lastName']"),
        email: document.querySelector("[data-automation-id='email'] input, input[type='email']"),
        phone: document.querySelector("[data-automation-id='phone-number'] input, input[type='tel']"),
        resumeInput: document.querySelector("[data-automation-id='file-upload-drop-zone'] input[type='file'], input[type='file']"),
        nextBtn: document.querySelector("[data-automation-id='bottom-navigation-next-button']"),
        submitBtn: document.querySelector("[data-automation-id='bottom-navigation-submit-button']")
      }
    };
  },

  detectSecurityChallenge: () => {
    const challenge = document.querySelector(".g-recaptcha, iframe[src*='recaptcha'], iframe[src*='turnstile'], [data-automation-id*='captcha']");
    if (challenge) {
      return {
        detected: true,
        type: "CAPTCHA_DETECTED",
        element: challenge,
        message: "CAPTCHA challenge detected on Workday form. Auto-paused for human handoff."
      };
    }
    return { detected: false };
  },

  detectConfirmation: () => {
    const confirmation = document.querySelector(
      "[data-automation-id='congratulations'], [data-automation-id='applicationSubmitted'], [data-automation-id='submissionSuccessMessage']"
    );
    if (confirmation) {
      return {
        submitted: true,
        receiptSnippet: confirmation.innerText.trim().slice(0, 200),
        confirmationSelector: "[data-automation-id='congratulations']"
      };
    }

    const heading = document.querySelector("h1, h2");
    if (heading && /congratulations|application submitted|thank you/i.test(heading.innerText)) {
      return {
        submitted: true,
        receiptSnippet: heading.innerText.trim(),
        confirmationSelector: "h1, h2"
      };
    }

    return { submitted: false };
  }
};
