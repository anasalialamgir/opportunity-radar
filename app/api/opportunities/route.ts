import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Fetch live opportunities stored in database
    const opportunities = await prisma.opportunity.findMany({
      take: 50,
      orderBy: { discoveredAt: "desc" },
      include: {
        matches: email
          ? {
              where: { user: { email } },
            }
          : false,
      },
    });

    const formatted = opportunities.map((opp) => {
      const match = (opp as any).matches?.[0];
      return {
        id: opp.id,
        title: opp.title,
        description: opp.description,
        company: opp.company || "Direct Client",
        category: opp.category,
        remote: opp.remote,
        minCompensation: opp.minCompensation || undefined,
        maxCompensation: opp.maxCompensation || undefined,
        currency: opp.currency || "USD",
        source: opp.source,
        sourceUrl: opp.sourceUrl,
        matchScore: match ? match.matchScore : 75,
        reasons: match && match.reasons.length > 0 ? match.reasons : [`✓ Discovered via ${opp.source}`],
      };
    });

    return NextResponse.json({ success: true, opportunities: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
