"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Puzzle,
  Radio,
  Cpu
} from "lucide-react";
import { PortalConnection } from "@/types";
import { TiltCard } from "@/components/TiltCard";

export default function PortalsPage() {
  const [portals, setPortals] = useState<PortalConnection[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortals();
  }, []);

  async function loadPortals() {
    try {
      const res = await fetch("/api/portals");
      const data = await res.json();
      if (data.success) {
        setPortals(data.portals);
      }
    } catch (err) {
      console.error("Failed to load portals:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = async (portalId: string) => {
    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", portalId })
      });
      const data = await res.json();
      if (data.success) {
        setPortals((prev) =>
          prev.map((p) => (p.id === portalId ? data.portal : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle portal:", err);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_all" })
      });
      const data = await res.json();
      if (data.success) {
        setPortals(data.portals);
      }
    } catch (err) {
      console.error("Failed to sync portals:", err);
    } finally {
      setSyncing(false);
    }
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
              ApplyCraft uses a **Companion Browser Bridge**: your existing authenticated browser cookies execute the forms natively.
              **Zero credentials or session tokens are ever transmitted to any central server.**
            </p>
          </div>
        </div>
      </TiltCard>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portals.map((portal) => {
          const isConnected = portal.status === "connected";
          return (
            <TiltCard
              key={portal.id}
              glowColor={isConnected ? "cyan" : "purple"}
              className="p-5 space-y-3.5"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md font-mono"
                    style={{ backgroundColor: portal.logoColor, boxShadow: `0 0 15px ${portal.logoColor}60` }}
                  >
                    {portal.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                      {portal.name}
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </h2>
                    <span className="text-[10px] text-cyan-400/80 uppercase font-mono tracking-wider">
                      {portal.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(portal.id)}
                  className={`text-xs px-3 py-1 rounded-full font-mono font-semibold transition-all ${
                    isConnected
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,136,0.2)] hover:bg-emerald-500/25"
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {isConnected ? "ACTIVE" : "CONNECT"}
                </button>
              </div>

              {/* Status Details */}
              <div className="space-y-1.5 text-xs py-2.5 border-y border-cyan-500/15 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>SESSION TELEMETRY:</span>
                  <span className={isConnected ? "text-cyan-400 font-semibold" : "text-slate-500"}>
                    {isConnected ? "BROWSER SYNCED" : "OFFLINE"}
                  </span>
                </div>
                {portal.username && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>ACCOUNT:</span>
                    <span className="text-slate-200 truncate max-w-[150px]">{portal.username}</span>
                  </div>
                )}
              </div>

              {/* Supported Features Checklist */}
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${portal.supportedFeatures.oneClickApply ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className={portal.supportedFeatures.oneClickApply ? "text-slate-200" : "text-slate-500"}>
                    Automated Form Dispatch
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${portal.supportedFeatures.tailoredResumeUpload ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className="text-slate-200">Tailored Resume Attachment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${portal.supportedFeatures.questionnaireAutofill ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className="text-slate-200">Custom Screening Autofill</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/apply?portal=${portal.id}`}
                className="w-full py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.1)]"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>LAUNCH VIA {portal.name.toUpperCase()}</span>
              </Link>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
