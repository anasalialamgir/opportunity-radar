import { NextResponse } from "next/server";
import { RSSOpportunitySource } from "@/sources/rss/source";
import { GitHubOpportunitySource } from "@/sources/github/source";
import { normalizeOpportunity } from "@/lib/discovery/normalizer";
import { deduplicateOpportunities } from "@/lib/discovery/deduplicator";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";

const sources = [new RSSOpportunitySource(), new GitHubOpportunitySource()];
export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to scan jobs." }, { status: 401 });
  try {
    const profile = await prisma.profile.findUnique({ where: { userId }, include: { skills: true, experiences: true } });
    if (!profile || (!profile.skills.length && !profile.experiences.length && !profile.targetRoles.length)) return NextResponse.json({ error: "Add CV skills or target roles before scanning." }, { status: 400 });
    const skills = [...profile.targetRoles, ...profile.skills.map(s => s.name), ...profile.experiences.map(e => e.title)].slice(0, 10);
    const results = await Promise.allSettled(sources.map(source => source.search({ skills, remoteOnly: profile.locationPreference === "remote" })));
    const errors = results.flatMap((r, i) => r.status === "rejected" ? [`${sources[i].name}: unavailable`] : []);
    const raw = results.flatMap(r => r.status === "fulfilled" ? r.value : []);
    if (results.every(r => r.status === "rejected")) return NextResponse.json({ error: "Job sources are temporarily unavailable. Please retry.", sources: errors }, { status: 503 });
    const unique = deduplicateOpportunities(raw.map(normalizeOpportunity));
    for (const { opportunity: opp } of unique) {
      await prisma.opportunity.upsert({ where: { sourceUrl: opp.sourceUrl }, update: {
        title: opp.title, description: opp.description, company: opp.company, location: opp.location, remote: opp.remote,
        publishedAt: opp.publishedAt, minCompensation: opp.minCompensation, maxCompensation: opp.maxCompensation,
      }, create: {
        title: opp.title, description: opp.description, category: opp.category, source: opp.source, sourceUrl: opp.sourceUrl,
        company: opp.company, location: opp.location, remote: opp.remote, minCompensation: opp.minCompensation,
        maxCompensation: opp.maxCompensation, currency: opp.currency, compensationPeriod: opp.compensationPeriod,
        verificationStatus: opp.verificationStatus, publishedAt: opp.publishedAt,
      } });
    }
    return NextResponse.json({ success: true, totalDiscovered: raw.length, uniqueStored: unique.length, sources: errors });
  } catch { return NextResponse.json({ error: "Scan failed. Check database configuration and retry." }, { status: 500 }); }
}
