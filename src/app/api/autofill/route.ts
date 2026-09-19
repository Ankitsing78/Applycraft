import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";
import { buildReviewData } from "@/lib/connectors/fieldMapper";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDetails, tailoredResumeId } = body;

    if (!jobDetails) {
      return NextResponse.json(
        { success: false, error: "Missing jobDetails" },
        { status: 400 }
      );
    }

    const profile = Storage.getProfile();
    let tailoredResume = tailoredResumeId ? Storage.getTailoredResume(tailoredResumeId) : null;

    // If no tailored resume passed, create on the fly
    if (!tailoredResume) {
      const { tailorResume } = await import("@/lib/ai/tailor");
      tailoredResume = await tailorResume(profile, jobDetails);
      Storage.saveTailoredResume(tailoredResume);
    }

    const reviewData = buildReviewData(profile, jobDetails, tailoredResume);
    Storage.saveReview(reviewData);

    return NextResponse.json({ success: true, review: reviewData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    let review = null;
    if (reviewId) {
      review = Storage.getReview(reviewId);
    } else {
      review = Storage.getRecentReview();
    }

    if (!review) {
      // Fallback: create an initial sample review if none exists
      const profile = Storage.getProfile();
      const sampleJob = {
        id: "job-sample-01",
        title: "Senior Full Stack Platform Engineer",
        company: "Stripe",
        portal: "greenhouse" as const,
        location: "Bengaluru / Remote",
        workMode: "Hybrid" as const,
        experienceRequired: "5+ years",
        salaryRange: "₹38,00,000 - ₹50,00,000",
        rawJd: "Senior Full Stack Engineer to lead infrastructure and web payments",
        extractedRequirements: ["Design high-availability APIs", "Lead frontend architecture with Next.js"],
        extractedSkills: ["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        atsScore: 94,
        matchingSkills: ["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        missingSkills: [],
        tailoringRecommendations: []
      };
      const { tailorResume } = await import("@/lib/ai/tailor");
      const tailored = await tailorResume(profile, sampleJob);
      Storage.saveTailoredResume(tailored);
      review = buildReviewData(profile, sampleJob, tailored);
      Storage.saveReview(review);
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
