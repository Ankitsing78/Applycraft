"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Globe,
  FileCheck2,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ChevronRight,
  Zap,
  Activity,
  Cpu
} from "lucide-react";
import { CandidateProfile, PortalConnection, JobApplicationItem } from "@/types";
import { TiltCard } from "@/components/TiltCard";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [portals, setPortals] = useState<PortalConnection[]>([]);
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [quickJd, setQuickJd] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, portRes, appRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/portals"),
          fetch("/api/applications")
        ]);

        const profData = await profRes.json();
        const portData = await portRes.json();
        const appData = await appRes.json();

        if (profData.success) setProfile(profData.profile);
        if (portData.success) setPortals(portData.portals);
        if (appData.success) setApplications(appData.applications);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const connectedPortalsCount = portals.filter((p) => p.status === "connected").length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickJd.trim()) return;
    router.push(`/apply?prefill=${encodeURIComponent(quickJd)}`);
  };

  return (
    <div className="space-y-8">
      {/* Sci-Fi Hero Command Center Banner */}
      <TiltCard glowColor="cyan" className="p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SYS.CORE // AUTONOMOUS AGENT ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-glow-cyan">{profile?.fullName || "Candidate"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Neural telemetry synchronized with active browser sessions across{" "}
              <span className="text-cyan-300 font-semibold">LinkedIn, Naukri, Indeed, and ATS portals</span>.
              Target JD parsing, ATS resonance tuning, and automated form dispatch with 100% human-in-the-loop review.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-current" />
              <span>Deploy New Application</span>
            </Link>
            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 text-xs sm:text-sm font-semibold border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Review Checkpoint (1)</span>
            </Link>
          </div>
        </div>
      </TiltCard>

      {/* 3D Holographic Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <TiltCard glowColor="cyan" className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Portal Gateways
            </span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{connectedPortalsCount}</span>
            <span className="text-xs text-slate-400 font-mono">/ {portals.length} active</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Zero password capture
          </p>
        </TiltCard>

        <TiltCard glowColor="purple" className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
              Active Pipeline
            </span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{applications.length}</span>
            <span className="text-xs text-slate-400 font-mono">tracked</span>
          </div>
          <p className="text-[11px] text-purple-300 mt-2 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            2 interviews scheduled
          </p>
        </TiltCard>

        <TiltCard glowColor="neon" className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              ATS Resonance
            </span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">93%</span>
            <span className="text-xs text-cyan-400 font-mono font-medium">+14% boosted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Target keyword alignment</p>
        </TiltCard>

        <TiltCard glowColor="amber" className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Human In Loop
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono">100%</span>
            <span className="text-xs text-slate-400 font-mono">verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Zero blind submissions</p>
        </TiltCard>
      </div>

      {/* Cyber Quick Apply Scanner */}
      <TiltCard glowColor="cyan" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-cyan-400" />
              NEURAL PARSER // TARGET LINK OR JD
            </h2>
            <p className="text-xs text-slate-400">
              Paste URL from LinkedIn, Naukri, Indeed, or Greenhouse, or copy raw job description.
            </p>
          </div>
          <Link
            href="/apply"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            STUDIO MODE <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickJd}
            onChange={(e) => setQuickJd(e.target.value)}
            placeholder="Paste target job link or description..."
            className="flex-1 bg-[#030712]/90 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-mono shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <span>Scan & Tailor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-cyan-400 font-mono text-[11px]">PRESET TARGETS:</span>
          <button
            type="button"
            onClick={() =>
              setQuickJd(
                "Lead Full Stack Developer at Razorpay - Next.js, Node.js, AWS, Redis, Distributed Systems, High Concurrency Checkout (Bengaluru/Hybrid)"
              )
            }
            className="px-2.5 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-colors font-mono text-[11px]"
          >
            Razorpay Lead FullStack
          </button>
          <button
            type="button"
            onClick={() =>
              setQuickJd(
                "Senior Staff Platform Engineer at Stripe - React, TypeScript, Microservices, Cloud Infrastructure, High-availability APIs (Remote)"
              )
            }
            className="px-2.5 py-1 rounded-md bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 transition-colors font-mono text-[11px]"
          >
            Stripe Senior Platform
          </button>
          <button
            type="button"
            onClick={() =>
              setQuickJd(
                "Senior Full Stack Engineer at Swiggy Tech - React, Node.js, Kafka, Kubernetes, High-Scale Food Delivery Logistics (Bengaluru)"
              )
            }
            className="px-2.5 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 transition-colors font-mono text-[11px]"
          >
            Swiggy FullStack
          </button>
        </div>
      </TiltCard>

      {/* Two Columns: Portals & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Portals */}
        <TiltCard glowColor="cyan" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Globe className="w-4 h-4 text-cyan-400" />
              PORTAL GATEWAYS
            </h3>
            <Link
              href="/portals"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              VIEW ALL
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            Native authenticated sessions synchronized via companion bridge.
          </p>

          <div className="space-y-2.5">
            {portals.slice(0, 5).map((portal) => (
              <div
                key={portal.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#030712]/80 border border-cyan-500/15 hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: portal.logoColor, color: portal.logoColor }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{portal.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{portal.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      portal.status === "connected"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {portal.status === "connected" ? "LIVE SESSION" : "STANDBY"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/portals"
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-xs text-cyan-300 font-mono font-medium border border-cyan-500/30 transition-colors"
          >
            <span>CONFIGURE 9 CONNECTORS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </TiltCard>

        {/* Right Column: Applications Pipeline */}
        <TiltCard glowColor="purple" className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-purple-400" />
              TELEMETRY PIPELINE
            </h3>
            <Link
              href="/tracker"
              className="text-xs text-purple-400 hover:text-purple-300 font-mono"
            >
              KANBAN BOARD
            </Link>
          </div>

          <div className="divide-y divide-cyan-500/15">
            {applications.map((app) => (
              <div
                key={app.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{app.jobTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-medium border border-cyan-500/30">
                      {app.matchScore}% MATCH
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-slate-200 font-medium">{app.company}</span>
                    <span>•</span>
                    <span className="capitalize">{app.portal}</span>
                    <span>•</span>
                    <span>Applied on {app.appliedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {app.status === "review_ready" ? (
                    <Link
                      href="/review"
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Review Required</span>
                    </Link>
                  ) : (
                    <span
                      className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full uppercase ${
                        app.status === "interview"
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : app.status === "screening"
                          ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>HUMAN VALIDATION CHECKPOINT ACTIVE</span>
            <Link
              href="/review"
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              Inspect Active Review <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
