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
  AlertCircle
} from "lucide-react";
import { CandidateProfile, ExperienceItem, EducationItem } from "@/types";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Candidate Master Profile</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            This master profile feeds the AI resume tailor and automatic form-filling agent across all job portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Changes saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs sm:text-sm">
        {[
          { id: "personal", label: "Contact & Bio", icon: User },
          { id: "experience", label: "Experience", icon: Briefcase },
          { id: "education", label: "Education", icon: GraduationCap },
          { id: "skills", label: "Skills Matrix", icon: Wrench },
          { id: "questionnaire", label: "Job Questionnaire", icon: HelpCircle },
          { id: "resumes", label: "Base Resumes", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
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
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Location / City</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn URL</label>
              <input
                type="text"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub URL</label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portfolio Website</label>
              <input
                type="text"
                value={profile.portfolioUrl}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Executive Bio / Summary
              </label>
              <textarea
                rows={4}
                value={profile.summary}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Work Experience */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {profile.experience.map((exp, index) => (
            <div key={exp.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Role #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = profile.experience.filter((_, i) => i !== index);
                    setProfile({ ...profile, experience: updated });
                  }}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...profile.experience];
                      updated[index].company = e.target.value;
                      setProfile({ ...profile, experience: updated });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...profile.experience];
                      updated[index].role = e.target.value;
                      setProfile({ ...profile, experience: updated });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => {
                      const updated = [...profile.experience];
                      updated[index].startDate = e.target.value;
                      setProfile({ ...profile, experience: updated });
                    }}
                    placeholder="YYYY-MM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => {
                      const updated = [...profile.experience];
                      updated[index].endDate = e.target.value;
                      setProfile({ ...profile, experience: updated });
                    }}
                    placeholder="Present or YYYY-MM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Key Achievements & Metrics (Used by AI Tailor)
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
                      className="flex-1 bg-slate-900 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...profile.experience];
                        updated[index].bullets = updated[index].bullets.filter((_, i) => i !== bIdx);
                        setProfile({ ...profile, experience: updated });
                      }}
                      className="text-slate-400 hover:text-rose-400 px-1"
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
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add bullet point
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newExp: ExperienceItem = {
                id: "exp-" + Date.now(),
                company: "New Company Inc.",
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
            className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Experience</span>
          </button>
        </div>
      )}

      {/* Tab 3: Education */}
      {activeTab === "education" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          {profile.education.map((edu, index) => (
            <div key={edu.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...profile.education];
                      updated[index].degree = e.target.value;
                      setProfile({ ...profile, education: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => {
                      const updated = [...profile.education];
                      updated[index].fieldOfStudy = e.target.value;
                      setProfile({ ...profile, education: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...profile.education];
                      updated[index].institution = e.target.value;
                      setProfile({ ...profile, education: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-300 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={edu.endYear}
                      onChange={(e) => {
                        const updated = [...profile.education];
                        updated[index].endYear = e.target.value;
                        setProfile({ ...profile, education: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium text-slate-300 mb-1">GPA / Score</label>
                    <input
                      type="text"
                      value={edu.gpa || ""}
                      onChange={(e) => {
                        const updated = [...profile.education];
                        updated[index].gpa = e.target.value;
                        setProfile({ ...profile, education: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Skills Matrix */}
      {activeTab === "skills" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          {Object.entries(profile.skills).map(([category, skillsList]) => (
            <div key={category} className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {category.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSkills = { ...profile.skills };
                        (updatedSkills as any)[category] = skillsList.filter((_, i) => i !== idx);
                        setProfile({ ...profile, skills: updatedSkills });
                      }}
                      className="hover:text-rose-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  placeholder={`Add ${category} skill...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      const updatedSkills = { ...profile.skills };
                      (updatedSkills as any)[category] = [...skillsList, val];
                      setProfile({ ...profile, skills: updatedSkills });
                      e.currentTarget.value = "";
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Job Questionnaire */}
      {activeTab === "questionnaire" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              These standard questionnaire answers are automatically mapped by the web agent when applying to
              portals like Naukri, Workday, Greenhouse, and LinkedIn Easy Apply.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notice Period / Availability
              </label>
              <select
                value={profile.questionnaire.noticePeriod}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: { ...profile.questionnaire, noticePeriod: e.target.value }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              >
                <option>Immediate (0-15 days)</option>
                <option>30 Days (Negotiable to 15 Days)</option>
                <option>60 Days</option>
                <option>90 Days</option>
                <option>Currently Serving Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Total Years of Experience
              </label>
              <input
                type="number"
                value={profile.questionnaire.yearsOfExperience}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: {
                      ...profile.questionnaire,
                      yearsOfExperience: Number(e.target.value)
                    }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current CTC / Salary
              </label>
              <input
                type="text"
                value={profile.questionnaire.currentSalary}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: { ...profile.questionnaire, currentSalary: e.target.value }
                  })
                }
                placeholder="e.g. 28,00,000"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Expected CTC / Salary
              </label>
              <input
                type="text"
                value={profile.questionnaire.expectedSalary}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: { ...profile.questionnaire, expectedSalary: e.target.value }
                  })
                }
                placeholder="e.g. 38,00,000"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Require Visa Sponsorship?
              </label>
              <select
                value={profile.questionnaire.requireVisaSponsorship}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: {
                      ...profile.questionnaire,
                      requireVisaSponsorship: e.target.value as any
                    }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Authorization
              </label>
              <input
                type="text"
                value={profile.questionnaire.workAuthorization}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: { ...profile.questionnaire, workAuthorization: e.target.value }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pre-scripted Answer: Why are you interested in our company?
              </label>
              <textarea
                rows={3}
                value={profile.questionnaire.customAnswers["Why are you interested in our company?"] || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    questionnaire: {
                      ...profile.questionnaire,
                      customAnswers: {
                        ...profile.questionnaire.customAnswers,
                        "Why are you interested in our company?": e.target.value
                      }
                    }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Base Resumes */}
      {activeTab === "resumes" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Saved Master Resumes</h3>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Upload New Base Resume
            </button>
          </div>

          <div className="space-y-3">
            {profile.resumes.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">{res.title}</span>
                    {res.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">File: {res.fileName} • Last updated {res.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-400 hover:underline cursor-pointer">Preview</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
