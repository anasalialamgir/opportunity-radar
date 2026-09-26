export interface MatchProfile {
  skills: string[];
  capabilities: string[];
  locationPreference?: string;
  hoursPerWeek?: number;
  minimumCompensation?: number;
}

export interface MatchOpportunity {
  id: string;
  title: string;
  description: string;
  remote: boolean;
  location?: string;
  minCompensation?: number;
  maxCompensation?: number;
}

export interface MatchResult {
  score: number; // 0 to 100
  reasons: string[];
  concerns: string[];
}

export function computeOpportunityMatch(
  opp: MatchOpportunity,
  profile: MatchProfile
): MatchResult {
  const reasons: string[] = [];
  const concerns: string[] = [];
  let score = 50; // base score for legitimate discovered listing

  const fullText = `${opp.title} ${opp.description}`.toLowerCase();
  const allUserSkills = [...profile.skills, ...profile.capabilities];

  // 1. Skill & Capability Match (+30 max)
  let matchedSkillsCount = 0;
  for (const s of allUserSkills) {
    if (s.trim().length > 1 && fullText.includes(s.toLowerCase())) {
      reasons.push(`✓ Matches your capability: "${s}"`);
      matchedSkillsCount++;
    }
  }

  if (matchedSkillsCount > 0) {
    score += Math.min(matchedSkillsCount * 12, 30);
  } else {
    concerns.push("△ No exact named skill overlap detected in listing title/summary");
    score -= 10;
  }

  // 2. Remote & Location Preference (+15 or -15)
  if (profile.locationPreference === "remote") {
    if (opp.remote) {
      reasons.push("✓ Fully remote opportunity matches your preference");
      score += 15;
    } else {
      concerns.push("△ Listing does not explicitly confirm remote availability");
      score -= 15;
    }
  }

  // 3. Compensation Fit (+10 or -10)
  if (profile.minimumCompensation && opp.minCompensation) {
    if (opp.minCompensation >= profile.minimumCompensation) {
      reasons.push(`✓ Compensation ($${opp.minCompensation}+) meets your minimum requirement`);
      score += 10;
    } else {
      concerns.push(`△ Stated compensation ($${opp.minCompensation}) is below your minimum ($${profile.minimumCompensation})`);
      score -= 10;
    }
  }

  // Bound score between 10 and 99
  const finalScore = Math.max(15, Math.min(score, 98));

  return {
    score: finalScore,
    reasons: reasons.length > 0 ? reasons : ["✓ Opportunity matches general discovery parameters"],
    concerns,
  };
}
