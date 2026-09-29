import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
export const dynamic = "force-dynamic";
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const opportunities = await prisma.opportunity.findMany({ where: { source: { in: ["Remotive", "GitHub bounty"] }, OR: [{ publishedAt: { gte: new Date(Date.now() - 60 * 86400000) } }, { publishedAt: null, discoveredAt: { gte: new Date(Date.now() - 30 * 86400000) } }] }, take: 200, orderBy: { discoveredAt: "desc" }, include: { matches: { where: { userId } }, savedOpportunities: { where: { userId } } } });
    return NextResponse.json({ success: true, opportunities: opportunities.filter(o => !o.savedOpportunities[0]?.dismissed).map(o => ({
      id: o.id, title: o.title, description: o.description, company: o.company, category: o.category, remote: o.remote, location: o.location,
      minCompensation: o.minCompensation, maxCompensation: o.maxCompensation, currency: o.currency, source: o.source, sourceUrl: o.sourceUrl,
      publishedAt: o.publishedAt, matchScore: o.matches[0]?.matchScore ?? null, reasons: o.matches[0]?.reasons || [], concerns: o.matches[0]?.concerns || [],
    })).sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1)) });
  } catch { return NextResponse.json({ error: "Could not load opportunities." }, { status: 500 }); }
}
