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
  Edit3,
  FileText,
  Clock,
  Briefcase,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react";
import { ApplicationReviewData, FormField } from "@/types";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">No Application Ready for Review</h2>
        <p className="text-xs text-slate-400">
          Analyze a job description first to trigger the AI resume tailor and form mapping agent.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <span>Go to Tailor & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Group fields by category
  const personalFields = fields.filter((f) => f.category === "personal");
  const experienceFields = fields.filter((f) => f.category === "experience" || f.category === "education");
  const screeningFields = fields.filter((f) => f.category === "screening");
  const legalFields = fields.filter((f) => f.category === "legal");
  const documentFields = fields.filter((f) => f.category === "document");

  const allChecklistSatisfied =
    checklist.contactVerified && checklist.noticeVerified && checklist.resumeApproved;

  return (
    <div className="space-y-8">
      {/* Top Review Banner */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Human-in-the-Loop Checkpoint</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pre-Application Form Review: {review.jobTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="text-slate-200 font-semibold flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              {review.company}
            </span>
            <span>•</span>
            <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              Portal: {review.portal}
            </span>
            <span>•</span>
            <a
              href={review.portalJobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Portal Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {!submittedSuccess && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmSubmit}
              disabled={submitting || !allChecklistSatisfied}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Send className={`w-4 h-4 ${submitting ? "animate-pulse" : ""}`} />
              <span>{submitting ? "Submitting Application..." : "Confirm & Submit Application"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Modal / Card if submitted */}
      {submittedSuccess && confirmationData && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 p-6 space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Application Successfully Submitted!</h3>
              <p className="text-xs text-slate-300">
                The web agent filled and submitted all verified fields to {review.company}.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Confirmation ID:</span>
              <div className="font-mono font-bold text-emerald-400 text-sm">
                {confirmationData.confirmationId}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Timestamp:</span>
              <div className="text-slate-200 font-medium">
                {new Date(confirmationData.timestamp).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Attached Resume:</span>
              <div className="text-indigo-300 font-medium truncate">{review.tailoredResumeName}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/tracker"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <span>View in Job Tracker Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Agent Instructions & Safety Callout */}
      <div className="glass-card rounded-xl p-4 border border-slate-800 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Human Verification in Progress:</span> All 18 fields
          below have been pre-filled by the ApplyCraft Web Agent using your Master Profile and the tailored
          resume. You can click any input to modify values before clicking &quot;Confirm &amp; Submit&quot;.
        </p>
      </div>

      {/* Two Column Layout: Form Fields on Left, Attached Resume & Checklist on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Personal Information */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              1. Candidate Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {field.isUserEdited ? "Edited by you" : `${field.confidence}% Mapped`}
                    </span>
                  </div>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={submittedSuccess}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Experience & Education */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              2. Experience & Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experienceFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {field.isUserEdited ? "Edited by you" : `${field.confidence}% Mapped`}
                    </span>
                  </div>
                  {field.type === "select" && field.options ? (
                    <select
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      disabled={submittedSuccess}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                    >
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>
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
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Availability & Compensation */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              3. Availability & Compensation (Crucial Check)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {screeningFields
                .filter((f) => f.name.includes("salary") || f.name.includes("notice"))
                .map((field) => (
                  <div key={field.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300">{field.label}</label>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {field.isUserEdited ? "Edited by you" : `${field.confidence}% Mapped`}
                      </span>
                    </div>
                    {field.type === "select" && field.options ? (
                      <select
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        disabled={submittedSuccess}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                      >
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Section 4: Work Authorization & Legal */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              4. Legal & Work Authorization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Screening Questions */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              5. Employer Screening Question Answers
            </h3>

            <div className="space-y-4">
              {screeningFields
                .filter((f) => !f.name.includes("salary") && !f.name.includes("notice"))
                .map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300">{field.label}</label>
                      <span className="text-[10px] text-indigo-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Tailored
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      disabled={submittedSuccess}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-xs sm:text-sm text-slate-100 disabled:opacity-60"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attached Documents & Final Submission Checklist */}
        <div className="space-y-6">
          {/* Attached Tailored Resume Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Attached Tailored Resume
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {review.tailoredResumeName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Optimized with ATS keywords matching {review.company}&apos;s job description.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Custom Cover Letter</label>
              <textarea
                rows={6}
                value={review.coverLetter}
                readOnly
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 text-[11px] text-slate-300 font-mono"
              />
            </div>
          </div>

          {/* Mandatory Human Confirmation Checklist */}
          {!submittedSuccess && (
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 space-y-4 bg-indigo-950/20">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Human Review Checklist
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.contactVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, contactVerified: e.target.checked })
                    }
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>I have inspected my contact details, phone, and current employer.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.noticeVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, noticeVerified: e.target.checked })
                    }
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>I verify my notice period and expected compensation are accurate.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.resumeApproved}
                    onChange={(e) =>
                      setChecklist({ ...checklist, resumeApproved: e.target.checked })
                    }
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>I approve sending the tailored ATS resume and cover letter.</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting || !allChecklistSatisfied}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className={`w-4 h-4 ${submitting ? "animate-spin" : ""}`} />
                <span>
                  {submitting
                    ? "Agent Submitting to Portal..."
                    : "Confirm & Submit Application"}
                </span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Submitting executes the final form post via the browser bridge and logs the entry in your tracker.
              </p>
            </div>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
