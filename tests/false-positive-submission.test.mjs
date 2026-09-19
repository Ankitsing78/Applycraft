import test from "node:test";
import assert from "node:assert/strict";

function evaluateSubmissionPayload(payload) {
  const { mode, evidence } = payload;
  const timestamp = new Date().toISOString();

  if (mode === "real_extension" && evidence?.rawReceiptSnippet) {
    return {
      status: "applied",
      confirmation: {
        confirmationId: evidence.confirmationId || `ATS-${Date.now().toString(36).toUpperCase()}`,
        timestamp,
        portalResponse: `Verified live ATS submission: "${evidence.rawReceiptSnippet.slice(0, 120)}"`,
        isSimulated: false,
        evidenceType: evidence.evidenceType || "dom_confirmation",
        rawReceiptSnippet: evidence.rawReceiptSnippet
      }
    };
  }

  if (mode === "manual_attestation") {
    return {
      status: "applied",
      confirmation: {
        confirmationId: `USER-ATTEST-${Date.now().toString(36).toUpperCase()}`,
        timestamp,
        portalResponse: "Candidate attested manual submission on portal tab.",
        isSimulated: false,
        evidenceType: "user_manual_attestation"
      }
    };
  }

  // Fallback / Demo Simulation
  return {
    status: "demo_submitted",
    confirmation: {
      confirmationId: `SIM-DEMO-${Date.now().toString(36).toUpperCase()}`,
      timestamp,
      portalResponse: "[DEMO SIMULATION] Form fields validated & staged. Real ATS dispatch requires Companion Extension.",
      isSimulated: true,
      evidenceType: "synthetic_demo"
    }
  };
}

test("Submission without extension evidence is strictly marked as simulated demo", () => {
  const payload = {
    action: "confirm_apply",
    reviewId: "rev-123",
    mode: "demo_simulation"
  };

  const result = evaluateSubmissionPayload(payload);

  assert.equal(result.status, "demo_submitted", "Status must NOT be 'applied' without genuine evidence");
  assert.equal(result.confirmation.isSimulated, true, "Must have isSimulated: true");
  assert.equal(result.confirmation.evidenceType, "synthetic_demo");
  assert.match(result.confirmation.confirmationId, /^SIM-DEMO-/, "Confirmation ID must clearly reflect simulated demo");
});

test("Submission with valid ATS DOM receipt is marked as verified live submission", () => {
  const payload = {
    action: "confirm_apply",
    reviewId: "rev-456",
    mode: "real_extension",
    evidence: {
      evidenceType: "dom_confirmation",
      confirmationId: "GH-CONF-984210",
      rawReceiptSnippet: "Thank you for applying to Acme Cloud! Your application has been received."
    }
  };

  const result = evaluateSubmissionPayload(payload);

  assert.equal(result.status, "applied");
  assert.equal(result.confirmation.isSimulated, false);
  assert.equal(result.confirmation.evidenceType, "dom_confirmation");
  assert.equal(result.confirmation.confirmationId, "GH-CONF-984210");
  assert.ok(result.confirmation.rawReceiptSnippet.includes("Thank you for applying"));
});

test("Manual candidate attestation is marked as user_manual_attestation without fake ATS claim", () => {
  const payload = {
    action: "confirm_apply",
    reviewId: "rev-789",
    mode: "manual_attestation"
  };

  const result = evaluateSubmissionPayload(payload);

  assert.equal(result.status, "applied");
  assert.equal(result.confirmation.isSimulated, false);
  assert.equal(result.confirmation.evidenceType, "user_manual_attestation");
  assert.match(result.confirmation.confirmationId, /^USER-ATTEST-/);
});
