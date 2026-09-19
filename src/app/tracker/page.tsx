"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Kanban,
  Building,
  Calendar,
  ExternalLink,
  Plus,
  TrendingUp,
  FileCheck2,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";
import { JobApplicationItem } from "@/types";

const COLUMNS: { id: JobApplicationItem["status"]; title: string; color: string }[] = [
  { id: "review_ready", title: "Review Ready", color: "border-amber-500/40 text-amber-400" },
  { id: "applied", title: "Applied", color: "border-blue-500/40 text-blue-400" },
  { id: "screening", title: "Recruiter Screen", color: "border-purple-500/40 text-purple-400" },
  { id: "interview", title: "Technical Interview", color: "border-indigo-500/40 text-indigo-400" },
  { id: "offer", title: "Offer Received", color: "border-emerald-500/40 text-emerald-400" },
  { id: "rejected", title: "Archived", color: "border-slate-700 text-slate-400" },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPortal, setFilterPortal] = useState<string>("all");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (appId: string, newStatus: JobApplicationItem["status"]) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          applicationId: appId,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (appId: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          applicationId: appId
        })
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((a) => a.id !== appId));
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const filtered = applications.filter((app) => {
    if (filterPortal === "all") return true;
    return app.portal === filterPortal;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Kanban className="w-6 h-6 text-indigo-400" />
            Job Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track applications submitted by web agents and manage interview stages in one unified pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Portal:</span>
            <select
              value={filterPortal}
              onChange={(e) => setFilterPortal(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Portals</option>
              <option value="naukri" className="bg-slate-900">Naukri.com</option>
              <option value="linkedin" className="bg-slate-900">LinkedIn</option>
              <option value="greenhouse" className="bg-slate-900">Greenhouse</option>
              <option value="lever" className="bg-slate-900">Lever</option>
              <option value="hirist" className="bg-slate-900">Hirist</option>
            </select>
          </div>

          <Link
            href="/apply"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Application</span>
          </Link>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colItems = filtered.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              className="glass-card rounded-2xl p-3.5 border border-slate-800 space-y-3 min-h-[300px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-850 bg-slate-800 text-slate-300">
                  {colItems.length}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {colItems.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-xs font-bold text-white leading-snug">{app.jobTitle}</h2>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Building className="w-3 h-3 text-slate-500" />
                          <span>{app.company}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                        {app.matchScore}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span className="capitalize">{app.portal}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-500" />
                        {app.appliedDate}
                      </span>
                    </div>

                    {app.notes && (
                      <p className="text-[10px] text-slate-400 line-clamp-2 bg-slate-950/60 p-1.5 rounded">
                        {app.notes}
                      </p>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {app.status === "review_ready" ? (
                        <Link
                          href="/review"
                          className="w-full py-1 text-center rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold hover:bg-amber-500/30 flex items-center justify-center gap-1"
                        >
                          <FileCheck2 className="w-3 h-3" /> Review Now
                        </Link>
                      ) : (
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as any)
                          }
                          className="text-[10px] bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 focus:outline-none w-full"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              Move to: {c.title}
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition-colors ml-1"
                        title="Delete application"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-400 italic">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
