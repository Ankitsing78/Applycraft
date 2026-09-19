"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Link as LinkIcon,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  FileCheck2,
  ChevronRight,
  Eye,
  Building,
  MapPin,
  Clock
} from "lucide-react";
import { JobDetails, TailoredResumeResult } from "@/types";

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
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Resume Tailor & Job Matcher</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Paste any job link or description. Our agent analyzes requirements, optimizes your resume for ATS
          keywords, and prepares the pre-application review.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" /> Target Job Details
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Quick Samples:</span>
            <button
              type="button"
              onClick={() => loadSample("razorpay")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Razorpay (Naukri)
            </button>
            <button
              type="button"
              onClick={() => loadSample("stripe")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Stripe (Greenhouse)
            </button>
            <button
              type="button"
              onClick={() => loadSample("swiggy")}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Swiggy (Hirist)
            </button>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Job URL (LinkedIn, Naukri, Indeed, Greenhouse, Lever, etc.)
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/... or https://boards.greenhouse.io/..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Job Description Text (Paste full JD requirements)
            </label>
            <textarea
              rows={5}
              value={rawJd}
              onChange={(e) => setRawJd(e.target.value)}
              placeholder="Paste Job Description, roles, qualifications, and responsibilities here..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingParse || (!rawJd.trim() && !jobUrl.trim())}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-colors"
            >
              <Cpu className={`w-4 h-4 ${loadingParse ? "animate-spin" : ""}`} />
              <span>{loadingParse ? "Analyzing Requirements..." : "Analyze & Extract Skills"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Step 2: Parsed Job & ATS Match Breakdown */}
      {parsedJob && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                  Extracted Job Posting
                </span>
                <h2 className="text-xl font-bold text-white">{parsedJob.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="text-slate-200 font-medium flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
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
                      <span className="text-emerald-400 font-medium">{parsedJob.salaryRange}</span>
                    </>
                  )}
                </div>
              </div>

              {/* ATS Match Gauge */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">ATS Match Score</div>
                  <div className="text-2xl font-black text-emerald-400">{parsedJob.atsScore}%</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-white">
                  ✓
                </div>
              </div>
            </div>

            {/* Skills Match Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Matching Skills ({parsedJob.matchingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedJob.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Skills to Emphasize ({parsedJob.missingSkills.length || 1})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(parsedJob.missingSkills.length > 0 ? parsedJob.missingSkills : ["System Design", "Microservices"]).map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Tailor CTA */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                AI will inject matching ATS keywords into your work experience bullet points and generate tailored screening answers.
              </p>
              <button
                type="button"
                onClick={handleTailorResume}
                disabled={loadingTailor}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles className={`w-4 h-4 ${loadingTailor ? "animate-spin" : ""}`} />
                <span>{loadingTailor ? "Tailoring Bullets & Letter..." : "Tailor My Application"}</span>
              </button>
            </div>
          </div>

          {/* Step 3: Tailored Results & Comparison */}
          {tailoredResult && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Score Boosted to {tailoredResult.atsScore}%
                  </div>
                  <h3 className="text-lg font-bold text-white">Tailored Application Package Ready</h3>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: "comparison", label: "Resume Bullet Diffs" },
                    { id: "cover_letter", label: "Cover Letter" },
                    { id: "screening", label: "Screening Q&A" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
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
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">
                          {item.company} • {item.role}
                        </span>
                        <span className="text-[10px] text-slate-400 italic">{item.rationale}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Original Bullet
                          </span>
                          <p className="text-slate-400 leading-relaxed">{item.originalBullets[0]}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Tailored for {parsedJob.company}
                          </span>
                          <p className="text-indigo-200 leading-relaxed font-medium">
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
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {tailoredResult.customCoverLetter}
                  </pre>
                </div>
              )}

              {/* Sub-tab 3: Screening Q&A */}
              {activeTab === "screening" && (
                <div className="space-y-3">
                  {Object.entries(tailoredResult.screeningAnswers).map(([q, a], idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs font-semibold text-slate-300">{q}</span>
                      <p className="text-xs text-indigo-300">{a}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Final Proceed to Review Screen */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory Human Review: You will inspect all form fields before submission.</span>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToReview}
                  disabled={loadingAutofill}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Proceed to Pre-Apply Review Screen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      }
    >
      <ApplyForm />
    </Suspense>
  );
}
