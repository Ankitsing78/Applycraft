"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Kanban,
  Building,
  Calendar,
  Plus,
  FileCheck2,
  Trash2,
  Filter,
  Radio
} from "lucide-react";
import { JobApplicationItem } from "@/types";
import { TiltCard } from "@/components/TiltCard";

const COLUMNS: { id: JobApplicationItem["status"]; title: string; color: string }[] = [
  { id: "review_ready", title: "REVIEW PENDING", color: "text-amber-400 border-amber-500/40" },
  { id: "applied", title: "DISPATCHED", color: "text-cyan-400 border-cyan-500/40" },
  { id: "screening", title: "SCREENING", color: "text-purple-400 border-purple-500/40" },
  { id: "interview", title: "INTERVIEW", color: "text-indigo-400 border-indigo-500/40" },
  { id: "offer", title: "OFFER RECEIVED", color: "text-emerald-400 border-emerald-500/40" },
  { id: "rejected", title: "ARCHIVED", color: "text-slate-400 border-slate-700" },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>APPLICATION TELEMETRY GRID</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono flex items-center gap-2.5">
            <Kanban className="w-6 h-6 text-cyan-400" />
            PIPELINE KANBAN
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track agent dispatches, interview rounds, and verified submission receipts in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#030712] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>PORTAL:</span>
            <select
              value={filterPortal}
              onChange={(e) => setFilterPortal(e.target.value)}
              className="bg-transparent text-cyan-300 focus:outline-none font-mono"
            >
              <option value="all" className="bg-[#030712]">All Portals</option>
              <option value="naukri" className="bg-[#030712]">Naukri.com</option>
              <option value="linkedin" className="bg-[#030712]">LinkedIn</option>
              <option value="greenhouse" className="bg-[#030712]">Greenhouse</option>
              <option value="lever" className="bg-[#030712]">Lever</option>
              <option value="hirist" className="bg-[#030712]">Hirist</option>
            </select>
          </div>

          <Link
            href="/apply"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW APPLICATION</span>
          </Link>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colItems = filtered.filter((a) => {
            if (col.id === "applied") {
              return a.status === "applied" || a.status === "demo_submitted";
            }
            return a.status === col.id;
          });
          return (
            <TiltCard
              key={col.id}
              glowColor="cyan"
              className="p-3.5 space-y-3 min-h-[320px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 font-mono">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {colItems.length}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {colItems.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-[#030712]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-2.5 shadow-[0_0_10px_rgba(0,240,255,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-xs font-bold text-white leading-snug">{app.jobTitle}</h2>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <Building className="w-3 h-3 text-cyan-400" />
                          <span>{app.company}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                          {app.matchScore}%
                        </span>
                        {app.confirmation?.isSimulated && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                            DEMO
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-cyan-500/15 font-mono">
                      <span className="capitalize text-cyan-400">{app.portal}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-500" />
                        {app.appliedDate}
                      </span>
                    </div>

                    {app.notes && (
                      <p className="text-[10px] text-slate-400 line-clamp-2 bg-[#02040a] p-1.5 rounded font-mono border border-cyan-500/10">
                        {app.notes}
                      </p>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {app.status === "review_ready" ? (
                        <Link
                          href="/review"
                          className="w-full py-1 text-center rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold hover:bg-amber-500/30 flex items-center justify-center gap-1 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                        >
                          <FileCheck2 className="w-3 h-3" /> REVIEW NOW
                        </Link>
                      ) : (
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as any)
                          }
                          className="text-[10px] bg-[#02040a] border border-cyan-500/20 rounded px-1.5 py-1 text-cyan-300 font-mono focus:outline-none w-full"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#030712]">
                              Move: {c.title}
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors ml-1"
                        title="Delete application"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-500 italic font-mono">
                    STANDBY // NO ENTRIES
                  </div>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
