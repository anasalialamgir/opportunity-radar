import { NextResponse } from "next/server";
import { sourceRegistry } from "@/lib/sources/registry";
import { RSSOpportunitySource } from "@/sources/rss/source";
import { GitHubOpportunitySource } from "@/sources/github/source";
import { WebSearchDiscovery } from "@/lib/discovery/web-search";
import { normalizeOpportunity } from "@/lib/discovery/normalizer";
import { deduplicateOpportunities } from "@/lib/discovery/deduplicator";
import { prisma } from "@/lib/prisma";

// Register sources if not already present
if (!sourceRegistry.get("rss")) sourceRegistry.register(new RSSOpportunitySource());
if (!sourceRegistry.get("github")) sourceRegistry.register(new GitHubOpportunitySource());

export async function POST(req: Request) {
  try {
    const { userEmail } = await req.json().catch(() => ({ userEmail: undefined }));

    let userSkills: string[] = ["Python", "Video Editing", "Data Analysis"];
    let userCapabilities: string[] = ["Translate English to Urdu", "Content Management"];

    // Fetch user's actual profile if available
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { profile: { include: { skills: true, userCapabilities: true } } },
      });
      if (user?.profile) {
        if (user.profile.skills.length > 0) {
          userSkills = user.profile.skills.map((s) => s.name);
        }
        if (user.profile.userCapabilities.length > 0) {
          userCapabilities = user.profile.userCapabilities.map((c) => c.description);
        }
      }
    }

    // 1. Run all enabled plugin sources
    const rawFromPlugins = await sourceRegistry.runAllEnabled({
      skills: userSkills,
      remoteOnly: true,
    });

    // 2. Run AI Web Search discovery
    const rawFromSearch = await WebSearchDiscovery.discover({
      skills: userSkills,
      capabilities: userCapabilities,
    });

    const allRaw = [...rawFromPlugins, ...rawFromSearch];

    // 3. Normalize all items
    const normalized = allRaw.map(normalizeOpportunity);

    // 4. Deduplicate across sources
    const uniqueItems = deduplicateOpportunities(normalized);

    // 5. Upsert unique opportunities to database
    const saved = [];
    for (const item of uniqueItems) {
      const opp = item.opportunity;
      const record = await prisma.opportunity.upsert({
        where: { sourceUrl: opp.sourceUrl },
        update: {
          title: opp.title,
          description: opp.description,
          company: opp.company,
          minCompensation: opp.minCompensation,
          maxCompensation: opp.maxCompensation,
        },
        create: {
          title: opp.title,
          description: opp.description,
          category: opp.category,
          source: opp.source,
          sourceUrl: opp.sourceUrl,
          company: opp.company,
          location: opp.location,
          remote: opp.remote,
          minCompensation: opp.minCompensation,
          maxCompensation: opp.maxCompensation,
          currency: opp.currency,
          compensationPeriod: opp.compensationPeriod,
          verificationStatus: opp.verificationStatus,
        },
      });
      saved.push({ ...record, sourceCount: item.sourceCount });
    }

    return NextResponse.json({
      success: true,
      totalDiscovered: allRaw.length,
      uniqueStored: saved.length,
      opportunities: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
