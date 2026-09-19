import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";

export async function GET() {
  try {
    const portals = Storage.getPortals();
    const bridgeState = Storage.getExtensionBridgeState();
    return NextResponse.json({ success: true, portals, bridgeState });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, portalId, updates } = body;

    if (action === "connect") {
      const updated = Storage.connectPortal(portalId);
      return NextResponse.json({ success: true, portal: updated });
    }

    if (action === "disconnect") {
      const updated = Storage.disconnectPortal(portalId);
      return NextResponse.json({ success: true, portal: updated });
    }

    if (action === "toggle") {
      const updated = Storage.togglePortal(portalId);
      return NextResponse.json({ success: true, portal: updated });
    }

    if (action === "sync_all") {
      const portals = Storage.getPortals().map((p) => {
        // Simulating session check for Indian and global job portals
        const isSessionActive = p.id !== "foundit" && p.id !== "shine";
        return Storage.updatePortal(p.id, {
          activeSessionDetected: isSessionActive,
          status: isSessionActive ? "connected" : p.status,
          lastSynced: new Date().toISOString()
        })!;
      });
      return NextResponse.json({ success: true, portals });
    }

    if (portalId && updates) {
      const updated = Storage.updatePortal(portalId, updates);
      return NextResponse.json({ success: true, portal: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action or parameters" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
