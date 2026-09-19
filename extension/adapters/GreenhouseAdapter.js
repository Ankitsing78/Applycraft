// Greenhouse ATS Adapter for ApplyCraft AI Companion Extension
export const GreenhouseAdapter = {
  name: "Greenhouse ATS",
  matches: (url) => url.includes("greenhouse.io") || !!document.querySelector("#application_form, #app_body"),

  detectForm: () => {
    const form = document.querySelector("#application_form, form#new_applicant, #app_body form");
    if (!form) return null;

    return {
      formElement: form,
      fields: {
        firstName: form.querySelector("#first_name, input[name*='first_name']"),
        lastName: form.querySelector("#last_name, input[name*='last_name']"),
        email: form.querySelector("#email, input[name*='email']"),
        phone: form.querySelector("#phone, input[name*='phone']"),
        resumeInput: form.querySelector("input[type='file'][name*='resume'], #resume_attachment"),
        coverLetter: form.querySelector("textarea[name*='cover_letter'], #cover_letter_text"),
        submitBtn: form.querySelector("#submit_app, input[type='submit'], button[type='submit']")
      }
    };
  },

  detectSecurityChallenge: () => {
    const captcha = document.querySelector(
      ".g-recaptcha, iframe[src*='recaptcha'], iframe[src*='turnstile'], .h-captcha, iframe[src*='hcaptcha']"
    );
    if (captcha) {
      return {
        detected: true,
        type: "CAPTCHA_DETECTED",
        element: captcha,
        message: "CAPTCHA challenge detected on Greenhouse form. Auto-paused for human handoff."
      };
    }
    return { detected: false };
  },

  detectConfirmation: () => {
    const confirmation = document.querySelector(
      "#application_confirmation, .application-confirmation, #application-confirmation, .application_confirmation"
    );
    if (confirmation) {
      return {
        submitted: true,
        receiptSnippet: confirmation.innerText.trim().slice(0, 200),
        confirmationSelector: "#application_confirmation"
      };
    }

    // Text search fallback on confirmation screen
    const heading = document.querySelector("h1, h2");
    if (heading && /thank you for applying|application submitted/i.test(heading.innerText)) {
      return {
        submitted: true,
        receiptSnippet: heading.innerText.trim(),
        confirmationSelector: "h1, h2"
      };
    }

    return { submitted: false };
  }
};
