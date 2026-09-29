import { prisma } from "@/lib/prisma";
import { RSSOpportunitySource } from "@/sources/rss/source";
import { GitHubOpportunitySource } from "@/sources/github/source";
import { JobicyOpportunitySource } from "@/sources/jobicy/source";
import { normalizeOpportunity } from "@/lib/discovery/normalizer";
import { deduplicateOpportunities } from "@/lib/discovery/deduplicator";
import { computeOpportunityMatch } from "@/lib/ai/matching";
import { semanticScores, blendScores } from "@/lib/ai/semantic";

const sources = [new RSSOpportunitySource(), new JobicyOpportunitySource(), new GitHubOpportunitySource()];
const recent = () => ({ source: { in: ["Remotive", "Jobicy", "GitHub bounty"] }, OR: [{ publishedAt: { gte: new Date(Date.now() - 60 * 86400000) } }, { publishedAt: null, discoveredAt: { gte: new Date(Date.now() - 30 * 86400000) } }] });
async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = [];
  for (let i = 0; i < items.length; i += size) output.push(...await Promise.all(items.slice(i, i + size).map(fn)));
  return output;
}

export async function scanForUser(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId }, include: { skills: true, experiences: true, userCapabilities: true } });
  if (!profile || (!profile.skills.length && !profile.experiences.length && !profile.targetRoles.length)) throw new Error("Add CV skills or target roles before scanning.");
  const skills = [...profile.targetRoles, ...profile.skills.map(s => s.name), ...profile.experiences.map(e => e.title)].slice(0, 10);
  const results = await Promise.allSettled(sources.map(source => source.search({ skills, remoteOnly: profile.locationPreference === "remote" })));
  const errors = results.flatMap((r, i) => r.status === "rejected" ? [`${sources[i].name}: unavailable`] : []);
  if (results.every(r => r.status === "rejected")) throw new Error("Job sources are temporarily unavailable. Please retry.");
  const raw = results.flatMap(r => r.status === "fulfilled" ? r.value : []);
  const unique = deduplicateOpportunities(raw.map(normalizeOpportunity));
  await inBatches(unique, 12, async ({ opportunity: opp }) => {
    return prisma.opportunity.upsert({ where: { sourceUrl: opp.sourceUrl }, update: {
      title: opp.title, description: opp.description, company: opp.company, location: opp.location, remote: opp.remote,
      publishedAt: opp.publishedAt, minCompensation: opp.minCompensation, maxCompensation: opp.maxCompensation,
      currency: opp.currency, compensationPeriod: opp.compensationPeriod,
    }, create: {
      title: opp.title, description: opp.description, category: opp.category, source: opp.source, sourceUrl: opp.sourceUrl,
      company: opp.company, location: opp.location, remote: opp.remote, minCompensation: opp.minCompensation,
      maxCompensation: opp.maxCompensation, currency: opp.currency, compensationPeriod: opp.compensationPeriod,
      verificationStatus: opp.verificationStatus, publishedAt: opp.publishedAt,
    } });
  });
  const matches = await refreshMatches(userId);
  return { totalDiscovered: raw.length, uniqueStored: unique.length, sources: errors, matches };
}

export async function refreshMatches(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId }, include: { skills: true, experiences: true, userCapabilities: true } });
  if (!profile) throw new Error("Complete your profile first.");
  const opportunities = await prisma.opportunity.findMany({ where: recent(), take: 500, orderBy: { discoveredAt: "desc" } });
  const profileText = `Desired roles: ${profile.targetRoles.join(", ")}. Work history: ${profile.experiences.map(e => `${e.title}: ${e.summary || ""}`).join("; ")}. Skills: ${profile.skills.map(s => s.name).join(", ")}. Other strengths: ${profile.userCapabilities.map(c => c.description).join("; ")}.`;
  let semantic: number[] | null = null;
  try { semantic = await semanticScores(profileText, opportunities.map(o => `${o.title}. ${o.description}`)); }
  catch (error) { console.error("Semantic matching unavailable; using profile match", error); }
  const matches = await inBatches(opportunities.map((opp, index) => ({ opp, index })), 12, async ({ opp, index }) => {
    const match = computeOpportunityMatch(opp, { skills: profile.skills.map(s => s.name), capabilities: profile.userCapabilities.map(c => c.description), experienceTitles: profile.experiences.map(e => e.title), targetRoles: profile.targetRoles, country: profile.country || undefined, locationPreference: profile.locationPreference || undefined, minimumCompensation: profile.minimumCompensation || undefined, currency: profile.currency });
    const blended = semantic && match.score > 0 ? blendScores(match.score, semantic[index]) : match.score;
    const score = match.concerns.some(c => c.includes("eligibility")) ? Math.min(blended, 59) : blended;
    const reasons = semantic && semantic[index] >= 55 ? [...match.reasons, "Related to your profile and target roles (AI similarity)."] : match.reasons;
    await prisma.opportunityMatch.upsert({ where: { userId_opportunityId: { userId, opportunityId: opp.id } }, update: { matchScore: score, reasons, concerns: match.concerns }, create: { userId, opportunityId: opp.id, matchScore: score, reasons, concerns: match.concerns } });
    return { opportunityId: opp.id, title: opp.title, matchScore: score, reasons, concerns: match.concerns };
  });
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
