import type { CandidateProfile, EvidencePointer, GroundingAudit, JobDetails, TailoredResumeResult } from "@/types";

export interface CandidateFact {
  id: string;
  category: "skill" | "experience" | "education" | "questionnaire";
  key: string;
  value: string;
  verified: boolean;
  context?: string;
}

export class CandidateEvidenceGraph {
  private facts: Map<string, CandidateFact> = new Map();
  private verifiedSkills: Set<string> = new Set();

  constructor(profile: CandidateProfile) {
    this.buildGraph(profile);
  }

  private buildGraph(profile: CandidateProfile): void {
    // 1. Index skills
    if (Array.isArray(profile.skills)) {
      profile.skills.forEach((skill: any, idx: number) => {
        const name = typeof skill === "string" ? skill : skill.name;
        const factId = `fact-skill-${idx}`;
        const normalized = (name || "").trim().toLowerCase();
        if (normalized) {
          this.verifiedSkills.add(normalized);
          this.facts.set(factId, {
            id: factId,
            category: "skill",
            key: name,
            value: name,
            verified: true
          });
        }
      });
    } else if (typeof profile.skills === "object" && profile.skills !== null) {
      let idx = 0;
      for (const [cat, list] of Object.entries(profile.skills)) {
        if (Array.isArray(list)) {
          list.forEach((skillName: string) => {
            const factId = `fact-skill-${idx++}`;
            const normalized = skillName.trim().toLowerCase();
            if (normalized) {
              this.verifiedSkills.add(normalized);
              this.facts.set(factId, {
                id: factId,
                category: "skill",
                key: skillName,
                value: `${skillName} (${cat})`,
                verified: true,
                context: cat
              });
            }
          });
        }
      }
    }

    // 2. Index experience bullets
    profile.experience.forEach((exp) => {
      exp.bullets.forEach((bullet, bIdx) => {
        const factId = `fact-exp-${exp.id}-${bIdx}`;
        this.facts.set(factId, {
          id: factId,
          category: "experience",
          key: `${exp.role} at ${exp.company}`,
          value: bullet,
          verified: true,
          context: `${exp.startDate} - ${exp.endDate}`
        });
      });
    });

    // 3. Index education
    profile.education.forEach((edu) => {
      const factId = `fact-edu-${edu.id}`;
      this.facts.set(factId, {
        id: factId,
        category: "education",
        key: edu.degree,
        value: `${edu.degree} from ${edu.institution} (${edu.graduationYear})`,
        verified: true
      });
    });

    // 4. Index questionnaire items
    const q = profile.questionnaire;
    this.facts.set("fact-q-exp-years", {
      id: "fact-q-exp-years",
      category: "questionnaire",
      key: "yearsOfExperience",
      value: String(q.yearsOfExperience),
      verified: true
    });
    this.facts.set("fact-q-notice", {
      id: "fact-q-notice",
      category: "questionnaire",
      key: "noticePeriod",
      value: q.noticePeriod,
      verified: true
    });
    this.facts.set("fact-q-auth", {
      id: "fact-q-auth",
      category: "questionnaire",
      key: "workAuthorization",
      value: q.workAuthorization,
      verified: true
    });
  }

  public hasVerifiedSkill(skill: string): boolean {
    const s = skill.trim().toLowerCase();
    for (const verified of Array.from(this.verifiedSkills)) {
      if (verified === s || verified.includes(s) || s.includes(verified)) {
        return true;
      }
    }
    return false;
  }

  public findSupportingEvidence(text: string): EvidencePointer[] {
    const pointers: EvidencePointer[] = [];
    const textLower = text.toLowerCase();

    for (const [id, fact] of Array.from(this.facts.entries())) {
      if (fact.category === "experience") {
        // Look for phrase or keyword overlaps
        const factLower = fact.value.toLowerCase();
        const words = factLower.split(/\W+/).filter((w) => w.length > 4);
        const matchCount = words.filter((w) => textLower.includes(w)).length;
        if (matchCount >= 2 || textLower.includes(fact.key.toLowerCase())) {
          pointers.push({
            id: `ptr-${id}`,
            sourceType: fact.category,
            sourceId: id,
            originalText: fact.value,
            verified: fact.verified
          });
        }
      }
    }

    return pointers;
  }

  public auditTailoredResume(tailored: TailoredResumeResult, job: JobDetails): GroundingAudit {
    let totalClaims = 0;
    let groundedClaims = 0;
    let ungroundedClaims = 0;
    const notes: string[] = [];

    // Audit summary claims
    totalClaims++;
    const summaryLower = tailored.tailoredSummary.toLowerCase();
    const fabricatedSkillsFound: string[] = [];

    job.missingSkills.forEach((missing) => {
      // If the resume claims years of production experience in a skill they don't have
      const regex = new RegExp(`(\\d+\\+?\\s*years?\\s*(?:of)?\\s*(?:experience\\s*in\\s*)?${missing})`, "i");
      if (regex.test(tailored.tailoredSummary)) {
        fabricatedSkillsFound.push(missing);
      }
    });

    if (fabricatedSkillsFound.length > 0) {
      ungroundedClaims++;
      notes.push(`Hallucination warning: claimed unverified experience for: ${fabricatedSkillsFound.join(", ")}`);
    } else {
      groundedClaims++;
    }

    // Audit bullet claims
    tailored.tailoredBullets.forEach((tb) => {
      tb.tailoredBullets.forEach((bullet, idx) => {
        totalClaims++;
        const originalBullet = tb.originalBullets[idx] || "";
        const evidence = this.findSupportingEvidence(bullet);

        if (evidence.length > 0 || bullet.includes(originalBullet.slice(0, 30))) {
          groundedClaims++;
        } else {
          ungroundedClaims++;
          notes.push(`Bullet in ${tb.company} lacks direct anchor in candidate profile.`);
        }
      });
    });

    const groundingScore = totalClaims > 0 ? Number((groundedClaims / totalClaims).toFixed(2)) : 1.0;
    const zeroHallucinationVerified = ungroundedClaims === 0;

    return {
      totalClaims,
      groundedClaims,
      ungroundedClaims,
      groundingScore,
      zeroHallucinationVerified,
      notes
    };
  }
}
