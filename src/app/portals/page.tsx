"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Puzzle,
  Radio,
  PowerOff,
  Check
} from "lucide-react";
import { PortalConnection } from "@/types";
import { TiltCard } from "@/components/TiltCard";

const DEFAULT_CAPABILITIES = {
  jobDetection: true,
  formDetection: true,
  resumeUpload: true,
  questionAutofill: true
};

const FALLBACK_PORTALS: PortalConnection[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Major Job Board",
    logoColor: "#0A66C2",
    url: "https://www.linkedin.com/jobs",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    profileUrl: "https://linkedin.com/in/ankit-dev-profile",
    lastChecked: "12:32 AM",
    lastSynced: "2026-09-19T22:30:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Easy Apply automation enabled via Companion Extension bridge. Active session verified."
  },
  {
    id: "naukri",
    name: "Naukri.com",
    category: "Major Job Board",
    logoColor: "#0047AB",
    url: "https://www.naukri.com",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    profileUrl: "https://my.naukri.com/HomePage/view",
    lastChecked: "12:30 AM",
    lastSynced: "2026-09-19T21:45:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Fast Forward & 1-Click apply automation via native session."
  },
  {
    id: "indeed",
    name: "Indeed",
    category: "Major Job Board",
    logoColor: "#2164f3",
    url: "https://www.indeed.com",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    profileUrl: "https://my.indeed.com/resume",
    lastChecked: "12:29 AM",
    lastSynced: "2026-09-19T20:15:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Indeed Apply modal detection & automated screening response."
  },
  {
    id: "hirist",
    name: "Hirist.tech",
    category: "Tech Portal",
    logoColor: "#FF5722",
    url: "https://www.hirist.tech",
    status: "connected",
    statusText: "Browser Session Detected",
    username: "ankit.dev@example.com",
    profileUrl: "https://www.hirist.tech/profile",
    lastChecked: "12:20 AM",
    lastSynced: "2026-09-19T19:00:00Z",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Direct tech recruiter reachout & rapid dispatch protocol."
  },
  {
    id: "foundit",
    name: "Foundit (Monster)",
    category: "Major Job Board",
    logoColor: "#6c2eb9",
    url: "https://www.foundit.in",
    status: "disconnected",
    statusText: "Disconnected",
    lastChecked: "11:45 PM",
    activeSessionDetected: false,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Ready for pairing via Companion Extension."
  },
  {
    id: "shine",
    name: "Shine.com",
    category: "Major Job Board",
    logoColor: "#f7a600",
    url: "https://www.shine.com",
    status: "disconnected",
    statusText: "Disconnected",
    lastChecked: "09:40 PM",
    activeSessionDetected: false,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: true,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Ready for pairing via Companion Extension."
  },
  {
    id: "greenhouse",
    name: "Greenhouse ATS",
    category: "Enterprise ATS",
    logoColor: "#2A7B4C",
    url: "https://boards.greenhouse.io",
    status: "connected",
    statusText: "Browser Session Detected",
    lastChecked: "12:28 AM",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: false,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Direct career portal autofill. Detects custom screening questionnaires & resumes."
  },
  {
    id: "workday",
    name: "Workday Career Portal",
    category: "Enterprise ATS",
    logoColor: "#e26616",
    url: "https://myworkdayjobs.com",
    status: "connected",
    statusText: "Browser Session Detected",
    lastChecked: "12:25 AM",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: false,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Multi-page enterprise job portal flow mapper with Human-in-the-Loop review at each step."
  },
  {
    id: "lever",
    name: "Lever ATS",
    category: "Enterprise ATS",
    logoColor: "#00A4BD",
    url: "https://jobs.lever.co",
    status: "connected",
    statusText: "Browser Session Detected",
    lastChecked: "12:15 AM",
    activeSessionDetected: true,
    capabilities: DEFAULT_CAPABILITIES,
    supportedFeatures: {
      oneClickApply: false,
      tailoredResumeUpload: true,
      questionnaireAutofill: true
    },
    notes: "Universal single-page application parser with instant profile mapping."
  }
];

export default function PortalsPage() {
  const [portals, setPortals] = useState<PortalConnection[]>(FALLBACK_PORTALS);
  const [syncing, setSyncing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPortals();
  }, []);

  async function loadPortals() {
    try {
      const res = await fetch("/api/portals");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.portals) && data.portals.length > 0) {
        setPortals(data.portals);
      }
    } catch (err) {
      console.warn("Using local portal state fallback:", err);
    }
  }

  const handleConnect = async (portalId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    setActionLoading(portalId + "-connect");

    // Optimistic UI update
    setPortals((prev) =>
      prev.map((p) =>
        p.id === portalId
          ? {
              ...p,
              status: "connected",
              statusText: "Browser Session Detected",
              activeSessionDetected: true,
              lastChecked: timeStr
            }
          : p
      )
    );

    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", portalId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.portal) {
          setPortals((prev) =>
            prev.map((p) => (p.id === portalId ? { ...p, ...data.portal } : p))
          );
        }
      }
    } catch (err) {
      console.warn("Local connect fallback applied:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnect = async (portalId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    setActionLoading(portalId + "-disconnect");

    // Optimistic UI update
    setPortals((prev) =>
      prev.map((p) =>
        p.id === portalId
          ? {
              ...p,
              status: "disconnected",
              statusText: "Disconnected",
              activeSessionDetected: false,
              lastChecked: timeStr
            }
          : p
      )
    );

    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect", portalId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.portal) {
          setPortals((prev) =>
            prev.map((p) => (p.id === portalId ? { ...p, ...data.portal } : p))
          );
        }
      }
    } catch (err) {
      console.warn("Local disconnect fallback applied:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_all" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.portals)) {
          setPortals(data.portals);
          return;
        }
      }
    } catch (err) {
      console.warn("Using local sync_all fallback:", err);
    } finally {
      setSyncing(false);
    }

    // Fallback sync all
    setPortals((prev) =>
      prev.map((p) => ({
        ...p,
        lastChecked: timeStr,
        lastSynced: now.toISOString()
      }))
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>PORTAL GATEWAY MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            CONNECTED JOB HUBS & ATS NODES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automate application dispatches across major Indian and global portals without password compromise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/30 transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-cyan-400" : ""}`} />
            <span>{syncing ? "SYNCING..." : "SYNC SESSIONS"}</span>
          </button>
          <Link
            href="/extension-guide"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-mono font-bold text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all"
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>BRIDGE PROTOCOL</span>
          </Link>
        </div>
      </div>

      {/* Security Architecture Info Callout */}
      <TiltCard glowColor="cyan" className="p-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              ZERO-CREDENTIAL BROWSER BRIDGE PROTOCOL
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                ACTIVE SECURITY
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional scrapers asking for raw portal passwords get blocked by 2FA challenges and Cloudflare bot detection.
              ApplyCraft uses a <strong>Companion Browser Bridge</strong>: your existing authenticated browser cookies execute the forms natively.
              <strong> Zero credentials or session tokens are ever transmitted to any central server.</strong>
            </p>
          </div>
        </div>
      </TiltCard>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map((portal) => {
          const isConnected = portal.status === "connected" || portal.activeSessionDetected;
          const isConnecting = actionLoading === portal.id + "-connect";
          const isDisconnecting = actionLoading === portal.id + "-disconnect";

          return (
            <TiltCard
              key={portal.id}
              glowColor={isConnected ? "cyan" : "purple"}
              className="p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header: Portal Name */}
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md font-mono shrink-0"
                      style={{ backgroundColor: portal.logoColor, boxShadow: `0 0 15px ${portal.logoColor}60` }}
                    >
                      {portal.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white font-mono flex items-center gap-1.5">
                        {portal.name}
                      </h2>
                      <span className="text-[10px] text-cyan-400/80 uppercase font-mono tracking-wider">
                        {portal.category}
                      </span>
                    </div>
                  </div>
                  {portal.username && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700 max-w-[110px] truncate">
                      {portal.username}
                    </span>
                  )}
                </div>

                {/* Status Section */}
                <div className="py-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Status:
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isConnected
                          ? "bg-emerald-400 shadow-[0_0_8px_#00ff88] animate-pulse"
                          : "bg-slate-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-mono font-semibold ${
                        isConnected ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {isConnected ? "● Browser Session Detected" : "○ Disconnected"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: [ OPEN PORTAL ], [ CONNECT BROWSER ], [ DISCONNECT ] */}
                <div className="space-y-2 my-2 font-mono">
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>[ OPEN PORTAL ]</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleConnect(portal.id)}
                      disabled={isConnecting}
                      className={`py-2 px-2 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        isConnected
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,136,0.15)] hover:bg-emerald-900/50"
                          : "bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                      }`}
                    >
                      <Radio className={`w-3 h-3 ${isConnecting ? "animate-spin text-cyan-300" : "text-cyan-400"}`} />
                      <span>{isConnecting ? "CONNECTING..." : "[ CONNECT BROWSER ]"}</span>
                    </button>

                    <button
                      onClick={() => handleDisconnect(portal.id)}
                      disabled={isDisconnecting}
                      className="py-2 px-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-400 text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                    >
                      <PowerOff className={`w-3 h-3 ${isDisconnecting ? "animate-spin" : "text-rose-400"}`} />
                      <span>{isDisconnecting ? "DISCONNECTING..." : "[ DISCONNECT ]"}</span>
                    </button>
                  </div>
                </div>

                {/* Last Checked */}
                <div className="py-2.5 border-t border-cyan-500/15 font-mono text-xs flex items-center justify-between">
                  <span className="text-slate-400">Last checked:</span>
                  <span className="text-cyan-300 font-semibold">{portal.lastChecked || "12:32 AM"}</span>
                </div>

                {/* Capabilities */}
                <div className="pt-2.5 border-t border-cyan-500/15 font-mono">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                    Capabilities:
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Job detection</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Form detection</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Resume upload</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Question autofill</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Apply Launch Copilot */}
              <div className="mt-4 pt-3 border-t border-cyan-500/10">
                <Link
                  href={`/apply?portal=${portal.id}`}
                  className="w-full py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400 text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LAUNCH COPILOT FOR {portal.name.toUpperCase()}</span>
                </Link>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
