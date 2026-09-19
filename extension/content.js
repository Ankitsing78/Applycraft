// ApplyCraft Companion Bridge - Content Script
console.log("ApplyCraft AI Agent Bridge loaded on:", window.location.hostname);

// Detect application form fields on current page
function scanApplicationForm() {
  const inputs = document.querySelectorAll("input, textarea, select");
  const detected = [];

  inputs.forEach((input) => {
    const name = input.getAttribute("name") || input.getAttribute("id") || "";
    const type = input.getAttribute("type") || input.tagName.toLowerCase();
    const label = findAssociatedLabel(input);

    if (name || label) {
      detected.push({ name, label, type, element: input });
    }
  });

  return detected;
}

function findAssociatedLabel(element) {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.innerText.trim();
  }
  const parentLabel = element.closest("label");
  if (parentLabel) return parentLabel.innerText.trim();

  return element.getAttribute("aria-label") || element.getAttribute("placeholder") || "";
}

// Receive autofill commands from ApplyCraft review confirmation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill_fields" && request.fields) {
    let filledCount = 0;

    request.fields.forEach((field) => {
      const selector = `input[name*="${field.name}"], input[id*="${field.name}"], textarea[name*="${field.name}"], select[name*="${field.name}"]`;
      const el = document.querySelector(selector);

      if (el && field.value) {
        el.value = field.value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.style.border = "2px solid #10b981"; // Visual confirmation indicator
        filledCount++;
      }
    });

    sendResponse({ success: true, filledCount });
  }

  if (request.action === "scan_page") {
    const fields = scanApplicationForm();
    sendResponse({ success: true, count: fields.length });
  }
  return true;
});
