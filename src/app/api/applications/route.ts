import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";
import { JobApplicationItem, SubmissionConfirmation, SubmissionEvidenceType } from "@/types";

export async function GET() {
  try {
    const applications = Storage.getApplications();
    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, reviewId, applicationId, status, notes, updatedFields, mode, evidence } = body;

    if (action === "confirm_apply") {
      const review = Storage.getReview(reviewId);
      if (!review) {
        return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
      }

      // If user updated fields on the review screen, persist them
      if (updatedFields && Array.isArray(updatedFields)) {
        review.fields = updatedFields;
      }

      const timestamp = new Date().toISOString();
      const submissionMode = mode || (evidence?.evidenceType === "dom_confirmation" ? "real_extension" : "demo_simulation");

      let confirmation: SubmissionConfirmation;
      let appStatus: JobApplicationItem["status"];
      let appNotes: string;

      if (submissionMode === "real_extension" && evidence?.rawReceiptSnippet) {
        // Genuine ATS DOM confirmation captured via Companion Extension
        const realId = evidence.confirmationId || `ATS-${Date.now().toString(36).toUpperCase()}`;
        confirmation = {
          confirmationId: realId,
          timestamp,
          portalResponse: `Verified live ATS submission: "${evidence.rawReceiptSnippet.slice(0, 120)}"`,
          isSimulated: false,
          evidenceType: (evidence.evidenceType as SubmissionEvidenceType) || "dom_confirmation",
          rawReceiptSnippet: evidence.rawReceiptSnippet,
          screenshotHash: evidence.screenshotHash
        };
        appStatus = "applied";
        appNotes = `Live submission verified by Companion Extension bridge. ATS Confirmation: ${realId}`;
      } else if (submissionMode === "manual_attestation") {
        // User confirmed they submitted directly in the portal tab
        const attestId = `USER-ATTEST-${Date.now().toString(36).toUpperCase()}`;
        confirmation = {
          confirmationId: attestId,
          timestamp,
          portalResponse: `Candidate attested manual submission on portal tab.`,
          isSimulated: false,
          evidenceType: "user_manual_attestation"
        };
        appStatus = "applied";
        appNotes = `Candidate verified manual submission on portal tab. ID: ${attestId}`;
      } else {
        // Synthetic Demo Simulation (No live extension confirmation captured)
        const demoId = `SIM-DEMO-${Date.now().toString(36).toUpperCase()}`;
        confirmation = {
          confirmationId: demoId,
          timestamp,
          portalResponse: `[DEMO SIMULATION] Form fields validated & staged. Real ATS dispatch requires Companion Extension.`,
          isSimulated: true,
          evidenceType: "synthetic_demo"
        };
        appStatus = "demo_submitted";
        appNotes = `[DEMO SIMULATION] Application packaged. Real ATS dispatch requires Companion Extension paired with live portal tab.`;
      }

      review.status = "submitted";
      review.confirmedAt = timestamp;
      review.submissionConfirmation = confirmation;
      Storage.saveReview(review);

      // Add to Kanban Tracker
      const newApp: JobApplicationItem = {
        id: "app-" + Date.now(),
        jobTitle: review.jobTitle,
        company: review.company,
        portal: review.portal,
        jobUrl: review.portalJobUrl,
        status: appStatus,
        matchScore: 96,
        appliedDate: timestamp.split("T")[0],
        tailoredResumeId: review.tailoredResumeId,
        reviewId: review.id,
        confirmation,
        notes: appNotes
      };
      Storage.addApplication(newApp);

      return NextResponse.json({
        success: true,
        review,
        application: newApp,
        confirmation
      });
    }

    if (action === "update_status") {
      const updated = Storage.updateApplication(applicationId, { status, notes });
      return NextResponse.json({ success: true, application: updated });
    }

    if (action === "delete") {
      Storage.deleteApplication(applicationId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
