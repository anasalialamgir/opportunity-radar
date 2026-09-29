export interface MatchProfile {
  skills: string[]; capabilities: string[]; experienceTitles?: string[]; targetRoles?: string[];
  country?: string; locationPreference?: string; hoursPerWeek?: number; minimumCompensation?: number; currency?: string;
}
export interface MatchOpportunity {
  id: string; title: string; description: string; remote: boolean; location?: string | null;
  skills?: string[]; minCompensation?: number | null; maxCompensation?: number | null; currency?: string | null; compensationPeriod?: string | null;
}
export interface MatchResult { score: number; reasons: string[]; concerns: string[]; }
const terms = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#. ]/g, " ").replace(/\s+/g, " ").trim();
const hasPhrase = (text: string, phrase: string) => phrase.length > 1 && (` ${text} `).includes(` ${phrase} `);

export function computeOpportunityMatch(opp: MatchOpportunity, profile: MatchProfile): MatchResult {
  const reasons: string[] = [], concerns: string[] = [];
  const text = terms(`${opp.title} ${opp.description} ${(opp.skills || []).join(" ")}`);
  const title = terms(opp.title);
  const skills = Array.from(new Set(profile.skills.map(terms).filter(Boolean)));
  const matched = skills.filter(s => hasPhrase(text, s));
  const titleMatches = matched.filter(s => hasPhrase(title, s));
  const roleMatches = (profile.experienceTitles || []).map(terms).filter(s => hasPhrase(title, s) || hasPhrase(s, title));
  const goalMatches = (profile.targetRoles || []).map(terms).filter(s => hasPhrase(title, s) || hasPhrase(s, title));
  const capabilityMatches = profile.capabilities.map(terms).filter(s => s.length > 3 && hasPhrase(text, s));
  const hasBackground = skills.length > 0 || profile.capabilities.length > 0 || (profile.experienceTitles || []).length > 0 || (profile.targetRoles || []).length > 0;
  if (!hasBackground) return { score: 0, reasons: [], concerns: ["Add your CV or skills to receive a fit score."] };
  let score = Math.round(65 * matched.length / Math.max(2, skills.length));
  score += Math.min(20, titleMatches.length * 10 + roleMatches.length * 12);
  score += Math.min(40, goalMatches.length * 40);
  score += Math.min(10, capabilityMatches.length * 5);
  if (matched.length) reasons.push(`Skills in listing: ${matched.slice(0, 5).join(", ")}`);
  if (roleMatches.length) reasons.push(`Relevant role: ${roleMatches[0]}`);
  if (goalMatches.length) reasons.push(`Matches your target role: ${goalMatches[0]}`);
  if (capabilityMatches.length) reasons.push(`Related capability: ${capabilityMatches[0]}`);
  if (!matched.length && !roleMatches.length && !goalMatches.length && !capabilityMatches.length) concerns.push("No specific CV skill or role overlap found.");
  const location = terms(opp.location || "");
  if (profile.locationPreference === "remote") {
    if (!opp.remote) { score -= 25; concerns.push("This listing does not state remote availability."); }
    else if (profile.country && location && location !== "remote" && !/worldwide|anywhere|global/.test(location) && !hasPhrase(location, terms(profile.country))) {
      score -= 15; concerns.push(`Check location eligibility: ${opp.location}.`);
    } else { score += 5; reasons.push("Remote preference aligns."); }
  }
  const period = (opp.compensationPeriod || "").toLowerCase();
  const monthlyMax = period.includes("year") ? (opp.maxCompensation || 0) / 12 : period.includes("month") ? opp.maxCompensation : null;
  if (profile.minimumCompensation && monthlyMax != null && (profile.currency || "USD") === opp.currency && monthlyMax < profile.minimumCompensation) {
    score -= 15; concerns.push("Listed monthly equivalent appears below your minimum.");
  }
  return { score: Math.max(0, Math.min(99, score)), reasons, concerns };
}
