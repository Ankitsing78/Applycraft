"use client";

import { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  HelpCircle,
  FileText,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Radio
} from "lucide-react";
import { CandidateProfile, ExperienceItem } from "@/types";
import { TiltCard } from "@/components/TiltCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "experience" | "education" | "skills" | "questionnaire" | "resumes"
  >("personal");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>CANDIDATE KNOWLEDGE GRAPH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            MASTER IDENTITY & EVIDENCE VAULT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounding data source for AI resume tailoring and portal form-filling agents. Zero hallucinations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> EVIDENCE SYNCED!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-mono font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "SAVING..." : "SAVE PROFILE"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cyan-500/20 text-xs sm:text-sm font-mono">
        {[
          { id: "personal", label: "CONTACT & BIO", icon: User },
          { id: "experience", label: "EXPERIENCE", icon: Briefcase },
          { id: "education", label: "EDUCATION", icon: GraduationCap },
          { id: "skills", label: "SKILLS MATRIX", icon: Wrench },
          { id: "questionnaire", label: "APPLICATION QA", icon: HelpCircle },
          { id: "resumes", label: "BASE RESUMES", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Contact & Bio */}
      {activeTab === "personal" && (
        <TiltCard glowColor="cyan" className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">FULL NAME</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">EMAIL ADDRESS</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">PHONE NUMBER</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">CURRENT LOCATION</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">PROFESSIONAL HEADLINE</label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">LINKEDIN URL</label>
              <input
                type="text"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GITHUB URL</label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">PORTFOLIO WEBSITE</label>
              <input
                type="text"
                value={profile.portfolioUrl}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">EXECUTIVE SUMMARY</label>
              <textarea
                rows={4}
                value={profile.summary}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
              />
            </div>
          </div>
        </TiltCard>
      )}

      {/* Tab 2: Work Experience */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {profile.experience.map((exp, index) => (
            <TiltCard key={exp.id} glowColor="purple" className="p-6 space-y-4">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  ROLE // {index + 1}: {exp.company.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = profile.experience.filter((_, i) => i !== index);
                    setProfile({ ...profile, experience: updated });
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">COMPANY</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...profile.experience];
                      updated[index].company = e.target.value;
                      setProfile({ ...profile, experience: updated });
                    }}
                    className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ROLE / TITLE</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...profile.experience];
                      updated[index].role = e.target.value;
                      setProfile({ ...profile, experience: updated });
                    }}
                    className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 font-mono">
                <label className="block text-xs font-semibold text-slate-300">
                  ACHIEVEMENT FACTS (CANDIDATE EVIDENCE)
                </label>
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => {
                        const updated = [...profile.experience];
                        updated[index].bullets[bIdx] = e.target.value;
                        setProfile({ ...profile, experience: updated });
                      }}
                      className="flex-1 bg-[#030712] border border-cyan-500/20 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...profile.experience];
                        updated[index].bullets = updated[index].bullets.filter((_, i) => i !== bIdx);
                        setProfile({ ...profile, experience: updated });
                      }}
                      className="text-slate-500 hover:text-rose-400 px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...profile.experience];
                    updated[index].bullets.push("Engineered scalable microservice reducing latency by 30%.");
                    setProfile({ ...profile, experience: updated });
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD EVIDENCE BULLET
                </button>
              </div>
            </TiltCard>
          ))}

          <button
            type="button"
            onClick={() => {
              const newExp: ExperienceItem = {
                id: "exp-" + Date.now(),
                company: "New Tech Corp",
                role: "Senior Software Engineer",
                location: "Bengaluru, India",
                startDate: "2023-01",
                endDate: "Present",
                current: true,
                technologies: ["React", "Node.js"],
                bullets: ["Spearheaded core platform initiatives delivering 99.9% uptime."]
              };
              setProfile({ ...profile, experience: [newExp, ...profile.experience] });
            }}
            className="w-full py-3.5 rounded-xl border border-dashed border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors bg-cyan-950/20"
          >
            <Plus className="w-4 h-4" />
            <span>ADD WORK EXPERIENCE RECORD</span>
          </button>
        </div>
      )}

      {/* Tab 4: Skills Matrix */}
      {activeTab === "skills" && (
        <TiltCard glowColor="cyan" className="p-6 space-y-6">
          {Object.entries(profile.skills).map(([category, skillsList]) => (
            <div key={category} className="space-y-2 font-mono">
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {category.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-[0_0_8px_rgba(0,240,255,0.1)]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSkills = { ...profile.skills };
                        (updatedSkills as any)[category] = skillsList.filter((_, i) => i !== idx);
                        setProfile({ ...profile, skills: updatedSkills });
                      }}
                      className="hover:text-rose-400 transition-colors ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </TiltCard>
      )}

      {/* Tab 5: Job Questionnaire */}
      {activeTab === "questionnaire" && (
        <TiltCard glowColor="amber" className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 font-mono flex items-start gap-2 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              STANDARD SCREENING ANSWERS: Mapped directly by the companion web agent on portal forms.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">NOTICE PERIOD</label>
              <select
                value={profile.questionnaire.noticePeriod}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: { ...profile.questionnaire, noticePeriod: e.target.value }
                  })
                }
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              >
                <option>Immediate (0-15 days)</option>
                <option>30 Days (Negotiable to 15 Days)</option>
                <option>60 Days</option>
                <option>90 Days</option>
                <option>Currently Serving Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">EXPECTED CTC / SALARY</label>
              <input
                type="text"
                value={profile.questionnaire.expectedSalary}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: { ...profile.questionnaire, expectedSalary: e.target.value }
                  })
                }
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              />
            </div>
          </div>
        </TiltCard>
      )}

      {/* Tab 6: Base Resumes */}
      {activeTab === "resumes" && (
        <TiltCard glowColor="cyan" className="p-6 space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-sm font-bold text-white">STORED MASTER RESUMES</h3>
          </div>

          <div className="space-y-3 font-mono">
            {profile.resumes.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-[#030712] border border-cyan-500/20 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-cyan-300">{res.title}</span>
                    {res.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">File: {res.fileName} • Last updated {res.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>
        </TiltCard>
      )}
    </div>
  );
}
