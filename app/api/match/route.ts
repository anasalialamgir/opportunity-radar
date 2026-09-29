import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
import { computeOpportunityMatch } from "@/lib/ai/matching";

export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const profile = await prisma.profile.findUnique({ where: { userId }, include: { skills: true, experiences: true, userCapabilities: true } });
  if (!profile) return NextResponse.json({ error: "Complete your profile first." }, { status: 400 });
  const opportunities = await prisma.opportunity.findMany({ where: { source: { in: ["Remotive", "GitHub bounty"] }, OR: [{ publishedAt: { gte: new Date(Date.now() - 60 * 86400000) } }, { publishedAt: null, discoveredAt: { gte: new Date(Date.now() - 30 * 86400000) } }] }, take: 200, orderBy: { discoveredAt: "desc" } });
  const matches = await Promise.all(opportunities.map(async opp => {
    const match = computeOpportunityMatch(opp, { skills: profile.skills.map(s => s.name), capabilities: profile.userCapabilities.map(c => c.description), experienceTitles: profile.experiences.map(e => e.title), targetRoles: profile.targetRoles, country: profile.country || undefined, locationPreference: profile.locationPreference || undefined, minimumCompensation: profile.minimumCompensation || undefined });
    await prisma.opportunityMatch.upsert({ where: { userId_opportunityId: { userId, opportunityId: opp.id } }, update: { matchScore: match.score, reasons: match.reasons, concerns: match.concerns }, create: { userId, opportunityId: opp.id, matchScore: match.score, reasons: match.reasons, concerns: match.concerns } });
    return { opportunityId: opp.id, title: opp.title, matchScore: match.score, reasons: match.reasons, concerns: match.concerns };
  }));
  return NextResponse.json({ success: true, totalMatched: matches.length, matches: matches.sort((a, b) => b.matchScore - a.matchScore) });
}
