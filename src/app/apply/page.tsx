"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Link as LinkIcon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  FileCheck2,
  Building,
  MapPin,
  Clock,
  Radio
} from "lucide-react";
import { JobDetails, TailoredResumeResult } from "@/types";
import { TiltCard } from "@/components/TiltCard";

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobUrl, setJobUrl] = useState("");
  const [rawJd, setRawJd] = useState("");
  const [loadingParse, setLoadingParse] = useState(false);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingAutofill, setLoadingAutofill] = useState(false);

  const [parsedJob, setParsedJob] = useState<JobDetails | null>(null);
  const [tailoredResult, setTailoredResult] = useState<TailoredResumeResult | null>(null);
  const [activeTab, setActiveTab] = useState<"comparison" | "cover_letter" | "screening">("comparison");

  useEffect(() => {
    const prefill = searchParams.get("prefill");
    const urlParam = searchParams.get("jobUrl");
    if (prefill) {
      setRawJd(prefill);
    }
    if (urlParam) {
      setJobUrl(urlParam);
    }
  }, [searchParams]);

  // Step 1: Parse JD
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rawJd.trim() && !jobUrl.trim()) return;

    setLoadingParse(true);
    setTailoredResult(null);
    try {
      const res = await fetch("/api/parse-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJd, url: jobUrl })
      });
      const data = await res.json();
      if (data.success) {
        setParsedJob(data.jobDetails);
      } else {
        alert(data.error || "Failed to analyze job");
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoadingParse(false);
    }
  };

  // Step 2: Tailor Resume
  const handleTailorResume = async () => {
    if (!parsedJob) return;
    setLoadingTailor(true);
    try {
      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDetails: parsedJob })
      });
      const data = await res.json();
      if (data.success) {
        setTailoredResult(data.tailoredResume);
      } else {
        alert(data.error || "Tailoring failed");
      }
    } catch (err) {
      console.error("Tailoring error:", err);
    } finally {
      setLoadingTailor(false);
    }
  };

  // Step 3: Go to Review Screen
  const handleProceedToReview = async () => {
    if (!parsedJob) return;
    setLoadingAutofill(true);
    try {
      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDetails: parsedJob,
          tailoredResumeId: tailoredResult?.id
        })
      });
      const data = await res.json();
      if (data.success && data.review) {
        router.push(`/review?reviewId=${data.review.id}`);
      } else {
        router.push("/review");
      }
    } catch (err) {
      console.error("Autofill failed:", err);
      router.push("/review");
    } finally {
      setLoadingAutofill(false);
    }
  };

  const loadSample = (type: "razorpay" | "stripe" | "swiggy") => {
    if (type === "razorpay") {
      setJobUrl("https://www.naukri.com/job-listings-lead-full-stack-developer-razorpay-29401");
      setRawJd(`Lead Full Stack Developer at Razorpay - Bengaluru (Hybrid)
We are seeking a Lead Full Stack Developer to scale merchant checkout workflows.
Responsibilities:
- Build fault-tolerant, high-concurrency payment interfaces using React.js, Next.js, and Node.js.
- Work closely with security teams to ensure PCI-DSS compliance and zero-defect deployments.
- Mentor junior engineers and conduct architectural code reviews.
Must-Have Skills:
- React.js, Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS, System Design.
- Notice period: 30 days or immediate preferred.
Salary: ₹35,00,000 - ₹48,00,000 PA`);
    } else if (type === "stripe") {
      setJobUrl("https://boards.greenhouse.io/stripe/jobs/5482910");
      setRawJd(`Senior Staff Platform Engineer at Stripe - Remote (Global)
About Stripe:
Stripe builds economic infrastructure for the internet.
Requirements:
- 6+ years experience architecting distributed systems and cloud platforms.
- Deep expertise in TypeScript, React, Node.js, and cloud containerization (Docker, Kubernetes, AWS).
- Proven track record reducing API latency and managing high-throughput PostgreSQL databases.
- Strong communication and cross-functional leadership skills.`);
    } else {
      setJobUrl("https://www.hirist.tech/j/swiggy-senior-full-stack-engineer-184920.html");
      setRawJd(`Senior Full Stack Engineer at Swiggy Tech - Bengaluru
Swiggy is India's leading on-demand convenience platform.
Key Requirements:
- Build high-scale real-time food delivery dispatch and order management systems.
- Tech Stack: React, Next.js, Node.js, Redis, Kafka, PostgreSQL, AWS ECS.
- Experience with microservice latency optimization and caching strategies.
- Notice period: 30 days max.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-cyan-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>NEURAL TAILORING ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          AI RESUME TAILOR & ATS RESONANCE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Scan target JD requirements, align ATS keywords with candidate evidence, and dispatch to human review.
        </p>
      </div>

      {/* Input Section */}
      <TiltCard glowColor="cyan" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
            <LinkIcon className="w-3.5 h-3.5" /> TARGET SPECIFICATION
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">PRESETS:</span>
            <button
              type="button"
              onClick={() => loadSample("razorpay")}
              className="px-2 py-0.5 rounded bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-colors font-mono text-[11px]"
            >
              Razorpay (Naukri)
            </button>
            <button
              type="button"
              onClick={() => loadSample("stripe")}
              className="px-2 py-0.5 rounded bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 transition-colors font-mono text-[11px]"
            >
              Stripe (Greenhouse)
            </button>
            <button
              type="button"
              onClick={() => loadSample("swiggy")}
              className="px-2 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 transition-colors font-mono text-[11px]"
            >
              Swiggy (Hirist)
            </button>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
              TARGET URL (LINKEDIN, NAUKRI, INDEED, GREENHOUSE, LEVER)
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/... or https://boards.greenhouse.io/..."
              className="w-full bg-[#030712]/90 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
              RAW JOB SPECIFICATION (FULL TEXT REQUIREMENTS)
            </label>
            <textarea
              rows={5}
              value={rawJd}
              onChange={(e) => setRawJd(e.target.value)}
              placeholder="Paste Job Description, roles, qualifications, and responsibilities here..."
              className="w-full bg-[#030712]/90 border border-cyan-500/30 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingParse || (!rawJd.trim() && !jobUrl.trim())}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 text-sm font-mono font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
            >
              <Cpu className={`w-4 h-4 ${loadingParse ? "animate-spin" : ""}`} />
              <span>{loadingParse ? "ANALYZING REQUIREMENTS..." : "ANALYZE & EXTRACT SKILLS"}</span>
            </button>
          </div>
        </form>
      </TiltCard>

      {/* Step 2: Parsed Job & ATS Match Breakdown */}
      {parsedJob && (
        <div className="space-y-6">
          <TiltCard glowColor="cyan" className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                  EXTRACTED POSTING
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">{parsedJob.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="text-cyan-300 font-semibold flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    {parsedJob.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {parsedJob.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {parsedJob.experienceRequired}
                  </span>
                  {parsedJob.salaryRange && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{parsedJob.salaryRange}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Futuristic ATS Gauge */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#030712]/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-mono font-medium">ATS RESONANCE</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono text-glow-cyan">{parsedJob.atsScore}%</div>
                </div>
                <div className="relative w-12 h-12 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-white shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Skills Match Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  RESONANT SKILLS ({parsedJob.matchingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedJob.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium shadow-[0_0_10px_rgba(0,255,136,0.1)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase font-mono text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  KEYWORD EMPHASIS GAPS ({parsedJob.missingSkills.length || 1})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(parsedJob.missingSkills.length > 0 ? parsedJob.missingSkills : ["System Design", "Microservices"]).map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Tailor CTA */}
            <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 font-mono">
                AI will inject matched ATS keywords into your work experience bullets grounded in candidate evidence.
              </p>
              <button
                type="button"
                onClick={handleTailorResume}
                disabled={loadingTailor}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all"
              >
                <Sparkles className={`w-4 h-4 ${loadingTailor ? "animate-spin" : ""}`} />
                <span>{loadingTailor ? "TAILORING BULLETS & COVER LETTER..." : "TAILOR APPLICATION ARTIFACTS"}</span>
              </button>
            </div>
          </TiltCard>

          {/* Step 3: Tailored Results & Comparison */}
          {tailoredResult && (
            <TiltCard glowColor="purple" className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-semibold mb-1 border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                    <TrendingUp className="w-3.5 h-3.5" /> BOOSTED TO {tailoredResult.atsScore}%
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">TAILORED APPLICATION PACKAGE GENERATED</h3>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: "comparison", label: "BULLET DIFFS" },
                    { id: "cover_letter", label: "COVER LETTER" },
                    { id: "screening", label: "SCREENING Q&A" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
                        activeTab === tab.id
                          ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                          : "text-slate-400 hover:text-white bg-[#030712] border border-cyan-500/20"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-tab 1: Bullet Diffs */}
              {activeTab === "comparison" && (
                <div className="space-y-4">
                  {tailoredResult.tailoredBullets.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#030712]/90 border border-cyan-500/20 space-y-3">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-xs font-bold text-cyan-400">
                          {item.company} // {item.role}
                        </span>
                        <span className="text-[10px] text-slate-400 italic">{item.rationale}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                            ORIGINAL CANDIDATE FACT
                          </span>
                          <p className="text-slate-400 leading-relaxed">{item.originalBullets[0]}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/40 space-y-1.5 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]">
                          <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" /> TAILORED FOR {parsedJob.company.toUpperCase()}
                          </span>
                          <p className="text-cyan-100 leading-relaxed font-medium">
                            {item.tailoredBullets[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Cover Letter */}
              {activeTab === "cover_letter" && (
                <div className="p-4 rounded-xl bg-[#030712] border border-cyan-500/20">
                  <pre className="text-xs text-cyan-100 font-mono whitespace-pre-wrap leading-relaxed">
                    {tailoredResult.customCoverLetter}
                  </pre>
                </div>
              )}

              {/* Sub-tab 3: Screening Q&A */}
              {activeTab === "screening" && (
                <div className="space-y-3">
                  {Object.entries(tailoredResult.screeningAnswers).map(([q, a], idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/20 space-y-1 font-mono">
                      <span className="text-xs font-semibold text-slate-300">{q}</span>
                      <p className="text-xs text-cyan-300">{a}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Final Proceed to Review Screen */}
              <div className="pt-6 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>HUMAN-IN-THE-LOOP CHECKPOINT: All fields must be inspected before dispatch.</span>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToReview}
                  disabled={loadingAutofill}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(0,255,136,0.35)] transition-all hover:scale-[1.02]"
                >
                  <span>PROCEED TO PRE-APPLY REVIEW SCREEN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </TiltCard>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      }
    >
      <ApplyForm />
    </Suspense>
  );
}
