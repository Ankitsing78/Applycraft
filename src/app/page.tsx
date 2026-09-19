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
  ExternalLink,
  ChevronRight,
  Zap
} from "lucide-react";
import { CandidateProfile, PortalConnection, JobApplicationItem } from "@/types";

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
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Job Search Copilot • Native Browser Bridge</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.fullName || "Candidate"}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              ApplyCraft continuously synchronizes with your logged-in sessions across{" "}
              <span className="text-indigo-300 font-medium">LinkedIn, Naukri, Indeed, and ATS portals</span>.
              Paste any job description to automatically tailor resumes and fill application forms with
              mandatory human review.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>New Job Application</span>
            </Link>
            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Pre-Apply Review (1)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Connected Portals</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{connectedPortalsCount}</span>
            <span className="text-xs text-slate-400">/ {portals.length} active</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Zero passwords stored
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Applications</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{applications.length}</span>
            <span className="text-xs text-slate-400">tracked</span>
          </div>
          <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            2 interviews scheduled
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg ATS Match</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">93%</span>
            <span className="text-xs text-emerald-400 font-medium">+14% boosted</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Keywords optimized</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Human Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</span>
            <span className="text-xs text-slate-400">gated</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Zero blind auto-submits</p>
        </div>
      </div>

      {/* Instant Job Parser & Action Section */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              Quick Apply: Paste Job Link or JD
            </h2>
            <p className="text-xs text-slate-400">
              Paste a URL from LinkedIn, Naukri, Indeed, or Greenhouse, or copy-paste any raw job description.
            </p>
          </div>
          <Link
            href="/apply"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Full Tailor Studio <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickJd}
            onChange={(e) => setQuickJd(e.target.value)}
            placeholder="e.g. https://www.linkedin.com/jobs/view/3948201 or paste Job Title & Requirements..."
            className="flex-1 bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
          >
            <span>Analyze & Tailor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-slate-400">Quick Test Samples:</span>
          <button
            type="button"
            onClick={() =>
              setQuickJd(
                "Lead Full Stack Developer at Razorpay - Next.js, Node.js, AWS, Redis, Distributed Systems, High Concurrency Checkout (Bengaluru/Hybrid)"
              )
            }
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
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
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
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
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            Swiggy FullStack
          </button>
        </div>
      </div>

      {/* Two Columns: Connected Portals & Active Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Connected Portals Quick View */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Connected Job Portals
            </h3>
            <Link
              href="/portals"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Manage All
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            Sessions synced locally via browser companion extension. Zero server credential storage.
          </p>

          <div className="space-y-2.5">
            {portals.slice(0, 5).map((portal) => (
              <div
                key={portal.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: portal.logoColor }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{portal.name}</div>
                    <div className="text-[10px] text-slate-400">{portal.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      portal.status === "connected"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {portal.status === "connected" ? "Session Active" : "Disconnected"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/portals"
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700/80 transition-colors"
          >
            <span>View All 9 Supported Portals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Column: Applications Pipeline */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Active Job Applications & Reviews
            </h3>
            <Link
              href="/tracker"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Open Kanban Board
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {applications.map((app) => (
              <div
                key={app.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{app.jobTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                      {app.matchScore}% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{app.company}</span>
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
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Review & Confirm</span>
                    </Link>
                  ) : (
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        app.status === "interview"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : app.status === "screening"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>All forms are verified before final submission.</span>
            <Link
              href="/review"
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Inspect Active Form Review <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
