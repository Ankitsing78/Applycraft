import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";

export async function GET() {
  try {
    const bridgeState = Storage.getExtensionBridgeState();
    const profile = Storage.getProfile();
    return NextResponse.json({
      success: true,
      bridgeState,
      profileSummary: {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        totalExperience: profile.questionnaire.yearsOfExperience,
        noticePeriod: profile.questionnaire.noticePeriod
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, activeTabPortal, currentJobUrl, extensionInstalled } = body;

    const updatedState = Storage.updateExtensionBridgeState({
      ...(activeTabPortal !== undefined && { activeTabPortal }),
      ...(currentJobUrl !== undefined && { currentJobUrl }),
      ...(extensionInstalled !== undefined && { extensionInstalled })
    });

    return NextResponse.json({ success: true, bridgeState: updatedState });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
