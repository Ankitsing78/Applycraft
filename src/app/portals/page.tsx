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
  FileCheck2,
  Lock
} from "lucide-react";
import { PortalConnection } from "@/types";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connected Job Portals & ATS Gateways</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automate job applications across all major Indian & global portals without central password storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-indigo-400" : ""}`} />
            <span>{syncing ? "Syncing Sessions..." : "Sync Active Sessions"}</span>
          </button>
          <Link
            href="/extension-guide"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Companion Bridge Guide</span>
          </Link>
        </div>
      </div>

      {/* Security Architecture Info Callout */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Privacy-First Native Session Architecture
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                Industry Best Practice
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional bots that ask for your raw portal passwords get blocked by 2FA (SMS OTPs), CAPTCHAs, and Cloudflare.
              ApplyCraft uses a **Companion Browser Bridge**: as long as you are logged into LinkedIn, Naukri, or Indeed in your browser,
              our agent interacts directly with the application forms within your authenticated session.
              **Zero passwords are ever sent to or stored on any server.**
            </p>
          </div>
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portals.map((portal) => {
          const isConnected = portal.status === "connected";
          return (
            <div
              key={portal.id}
              className={`glass-card rounded-2xl p-5 border transition-all ${
                isConnected
                  ? "border-slate-800 hover:border-indigo-500/50"
                  : "border-slate-800/60 opacity-80"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                    style={{ backgroundColor: portal.logoColor }}
                  >
                    {portal.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {portal.name}
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </h2>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                      {portal.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(portal.id)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    isConnected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {isConnected ? "Active" : "Connect"}
                </button>
              </div>

              {/* Status Details */}
              <div className="space-y-2 text-xs py-3 border-y border-slate-800/80 my-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Session Status:</span>
                  <span className={isConnected ? "text-emerald-400 font-medium" : "text-slate-500"}>
                    {isConnected ? "Live Browser Session" : "Not Paired"}
                  </span>
                </div>
                {portal.username && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Account:</span>
                    <span className="text-slate-200 truncate max-w-[150px]">{portal.username}</span>
                  </div>
                )}
                {portal.lastSynced && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Last Verified:</span>
                    <span className="text-slate-400">Just now</span>
                  </div>
                )}
              </div>

              {/* Supported Features Checklist */}
              <div className="space-y-1.5 text-[11px] text-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${portal.supportedFeatures.oneClickApply ? "text-indigo-400" : "text-slate-600"}`} />
                  <span className={portal.supportedFeatures.oneClickApply ? "text-slate-300" : "text-slate-500"}>
                    Automated Form Submission
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${portal.supportedFeatures.tailoredResumeUpload ? "text-indigo-400" : "text-slate-600"}`} />
                  <span className="text-slate-300">Tailored Resume Attachment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${portal.supportedFeatures.questionnaireAutofill ? "text-indigo-400" : "text-slate-600"}`} />
                  <span className="text-slate-300">Custom Screening Autofill</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/apply?portal=${portal.id}`}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-indigo-600/20 text-indigo-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Apply via {portal.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
