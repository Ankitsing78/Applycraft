import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";
import { tailorResume } from "@/lib/ai/tailor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDetails } = body;

    if (!jobDetails) {
      return NextResponse.json(
        { success: false, error: "Missing jobDetails payload" },
        { status: 400 }
      );
    }

    const profile = Storage.getProfile();
    const tailored = await tailorResume(profile, jobDetails);
    Storage.saveTailoredResume(tailored);

    return NextResponse.json({ success: true, tailoredResume: tailored });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
