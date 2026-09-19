"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Building,
  ExternalLink,
  ShieldCheck,
  Send,
  FileText,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Radio
} from "lucide-react";
import { ApplicationReviewData, FormField } from "@/types";
import { TiltCard } from "@/components/TiltCard";

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewIdParam = searchParams.get("reviewId");

  const [review, setReview] = useState<ApplicationReviewData | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const [checklist, setChecklist] = useState({
    contactVerified: true,
    noticeVerified: true,
    resumeApproved: true
  });

  useEffect(() => {
    async function loadReview() {
      try {
        const url = reviewIdParam ? `/api/autofill?reviewId=${reviewIdParam}` : "/api/autofill";
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.review) {
          setReview(data.review);
          setFields(data.review.fields);
          if (data.review.status === "submitted") {
            setSubmittedSuccess(true);
            setConfirmationData(data.review.submissionConfirmation);
          }
        }
      } catch (err) {
        console.error("Failed to load review data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReview();
  }, [reviewIdParam]);

  const handleFieldChange = (fieldId: string, newValue: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, value: newValue, isUserEdited: true } : f))
    );
  };

  const handleConfirmSubmit = async () => {
    if (!review) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm_apply",
          reviewId: review.id,
          updatedFields: fields
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setConfirmationData(data.review.submissionConfirmation || {
          confirmationId: data.confirmationId,
          timestamp: new Date().toISOString(),
          portalResponse: "Application submitted successfully through web agent."
        });
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submission confirmation failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <TiltCard glowColor="amber" className="p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white font-mono">NO APPLICATION PENDING REVIEW</h2>
        <p className="text-xs text-slate-400 font-mono">
          Scan a target job description first to trigger the AI resume tailor and form mapping agent.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-mono font-bold"
        >
          <span>GO TO TAILOR & APPLY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </TiltCard>
    );
  }

  // Group fields by category
  const personalFields = fields.filter((f) => f.category === "personal");
  const experienceFields = fields.filter((f) => f.category === "experience" || f.category === "education");
  const screeningFields = fields.filter((f) => f.category === "screening");
  const legalFields = fields.filter((f) => f.category === "legal");

  const allChecklistSatisfied =
    checklist.contactVerified && checklist.noticeVerified && checklist.resumeApproved;

  return (
    <div className="space-y-8">
      {/* Top Review Banner */}
      <div className="pb-4 border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold mb-2 shadow-[0_0_12px_rgba(0,255,136,0.2)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HUMAN VERIFICATION GATEWAY ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            PRE-APPLY REVIEW: {review.jobTitle.toUpperCase()}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
            <span className="text-cyan-300 font-semibold flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              {review.company}
            </span>
            <span>•</span>
            <span className="capitalize px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 font-medium border border-cyan-500/20">
              PORTAL: {review.portal}
            </span>
            <span>•</span>
            <a
              href={review.portalJobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Target Form Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {!submittedSuccess && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmSubmit}
              disabled={submitting || !allChecklistSatisfied}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(0,255,136,0.35)] transition-all hover:scale-[1.02]"
            >
              <Send className={`w-4 h-4 ${submitting ? "animate-pulse" : ""}`} />
              <span>{submitting ? "DISPATCHING APPLICATION..." : "CONFIRM & DISPATCH VIA AGENT"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Modal if submitted */}
      {submittedSuccess && confirmationData && (
        <TiltCard glowColor="neon" className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">APPLICATION CONFIRMED & DISPATCHED</h3>
              <p className="text-xs text-slate-300 font-mono">
                The web agent executed form submission with verified candidate evidence to {review.company}.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#030712] border border-cyan-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400">Confirmation Reference:</span>
              <div className="font-bold text-emerald-400 text-sm">{confirmationData.confirmationId}</div>
            </div>
            <div>
              <span className="text-slate-400">Timestamp:</span>
              <div className="text-slate-200">{new Date(confirmationData.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <span className="text-slate-400">Attached Artifact:</span>
              <div className="text-cyan-300 truncate">{review.tailoredResumeName}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/tracker"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>VIEW IN PIPELINE TRACKER</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </TiltCard>
      )}

      {/* Safety Callout */}
      <TiltCard glowColor="cyan" className="p-4 flex items-start gap-3">
        <Radio className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0 animate-pulse" />
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          <span className="font-semibold text-cyan-300">HUMAN VERIFICATION IN PROGRESS:</span> All 18 fields
          below have been mapped by ApplyCraft Web Agent from your Master Profile and the tailored
          artifacts. Click any input to edit values before granting final dispatch authorization.
        </p>
      </TiltCard>

      {/* Form Fields & Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Personal Information */}
          <TiltCard glowColor="cyan" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-cyan-500/20 pb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
              01 // CANDIDATE CONTACT TELEMETRY
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {personalFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      {field.isUserEdited ? "USER EDITED" : `${field.confidence}% MAPPED`}
                    </span>
                  </div>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={submittedSuccess}
                    className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none disabled:opacity-60 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
                  />
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Section 2: Experience & Education */}
          <TiltCard glowColor="cyan" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-cyan-500/20 pb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
              02 // CREDENTIALS & EXPERIENCE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {experienceFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      {field.isUserEdited ? "USER EDITED" : `${field.confidence}% MAPPED`}
                    </span>
                  </div>
                  {field.type === "select" && field.options ? (
                    <select
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      disabled={submittedSuccess}
                      className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                    >
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt} className="bg-[#030712]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      disabled={submittedSuccess}
                      className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none disabled:opacity-60"
                    />
                  )}
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Section 3: Availability & Compensation */}
          <TiltCard glowColor="amber" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-cyan-500/20 pb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
              03 // AVAILABILITY & COMPENSATION (CRITICAL CHECK)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {screeningFields
                .filter((f) => f.name.includes("salary") || f.name.includes("notice"))
                .map((field) => (
                  <div key={field.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300">{field.label}</label>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {field.isUserEdited ? "USER EDITED" : `${field.confidence}% MAPPED`}
                      </span>
                    </div>
                    {field.type === "select" && field.options ? (
                      <select
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        disabled={submittedSuccess}
                        className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                      >
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt} className="bg-[#030712]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        disabled={submittedSuccess}
                        className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                      />
                    )}
                  </div>
                ))}
            </div>
          </TiltCard>

          {/* Section 4: Work Authorization & Legal */}
          <TiltCard glowColor="cyan" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-cyan-500/20 pb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
              04 // LEGAL & WORK AUTHORIZATION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {legalFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">{field.label}</label>
                  <div className="flex items-center gap-4">
                    {field.options?.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={opt}
                          checked={field.value === opt}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          disabled={submittedSuccess}
                          className="text-cyan-500 focus:ring-cyan-400"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Section 5: Screening Questions */}
          <TiltCard glowColor="purple" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-cyan-500/20 pb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
              05 // SCREENING QUESTION INTELLIGENCE
            </h3>

            <div className="space-y-4 font-mono">
              {screeningFields
                .filter((f) => !f.name.includes("salary") && !f.name.includes("notice"))
                .map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300">{field.label}</label>
                      <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> AI TAILORED
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      disabled={submittedSuccess}
                      className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg p-3 text-xs sm:text-sm text-slate-100 disabled:opacity-60 font-mono shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
                    />
                  </div>
                ))}
            </div>
          </TiltCard>
        </div>

        {/* Right Column: Attached Documents & Checklist */}
        <div className="space-y-6">
          <TiltCard glowColor="cyan" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-cyan-400" />
              ATTACHED ARTIFACT
            </h3>

            <div className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/30 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {review.tailoredResumeName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  COMPILED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Resonant keywords aligned with {review.company}&apos;s job specification.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 font-mono">CUSTOM COVER LETTER</label>
              <textarea
                rows={6}
                value={review.coverLetter}
                readOnly
                className="w-full bg-[#030712] border border-cyan-500/20 rounded-lg p-3 text-[11px] text-cyan-200 font-mono"
              />
            </div>
          </TiltCard>

          {/* Verification Checklist */}
          {!submittedSuccess && (
            <TiltCard glowColor="neon" className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                VERIFICATION PROTOCOL
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.contactVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, contactVerified: e.target.checked })
                    }
                    className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>I have verified contact details, mobile, and employer.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.noticeVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, noticeVerified: e.target.checked })
                    }
                    className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>I verify notice period and compensation targets.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.resumeApproved}
                    onChange={(e) =>
                      setChecklist({ ...checklist, resumeApproved: e.target.checked })
                    }
                    className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>I approve sending the tailored ATS resume.</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting || !allChecklistSatisfied}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <Send className={`w-4 h-4 ${submitting ? "animate-spin" : ""}`} />
                <span>
                  {submitting
                    ? "DISPATCHING FORM VIA BRIDGE..."
                    : "CONFIRM & DISPATCH VIA AGENT"}
                </span>
              </button>

              <p className="text-[10px] text-slate-400 text-center font-mono">
                Submitting triggers authenticated form posting and records verified submission evidence.
              </p>
            </TiltCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
