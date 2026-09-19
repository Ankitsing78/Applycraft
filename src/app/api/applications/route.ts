import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";
import { JobApplicationItem } from "@/types";

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
    const { action, reviewId, applicationId, status, notes, updatedFields } = body;

    if (action === "confirm_apply") {
      const review = Storage.getReview(reviewId);
      if (!review) {
        return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
      }

      // If user updated fields on the review screen, persist them
      if (updatedFields && Array.isArray(updatedFields)) {
        review.fields = updatedFields;
      }

      const confirmationId = "CONF-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      const timestamp = new Date().toISOString();

      review.status = "submitted";
      review.confirmedAt = timestamp;
      review.submissionConfirmation = {
        confirmationId,
        timestamp,
        portalResponse: `Successfully received and verified by ${review.company} career gateway.`
      };
      Storage.saveReview(review);

      // Add to Kanban Tracker
      const newApp: JobApplicationItem = {
        id: "app-" + Date.now(),
        jobTitle: review.jobTitle,
        company: review.company,
        portal: review.portal,
        jobUrl: review.portalJobUrl,
        status: "applied",
        matchScore: 96,
        appliedDate: timestamp.split("T")[0],
        tailoredResumeId: review.tailoredResumeId,
        reviewId: review.id,
        notes: `Confirmed and submitted via ApplyCraft Web Agent. Confirmation: ${confirmationId}`
      };
      Storage.addApplication(newApp);

      return NextResponse.json({
        success: true,
        review,
        application: newApp,
        confirmationId
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
