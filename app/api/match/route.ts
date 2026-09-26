import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeOpportunityMatch } from "@/lib/ai/matching";

export async function POST(req: Request) {
  try {
    const { userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: {
          include: {
            skills: true,
            userCapabilities: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      return NextResponse.json({ error: "User or Profile not found. Complete Step 1 profile first." }, { status: 404 });
    }

    const profileData = {
      skills: user.profile.skills.map((s) => s.name),
      capabilities: user.profile.userCapabilities.map((c) => c.description),
      locationPreference: user.profile.locationPreference || "remote",
      minimumCompensation: user.profile.minimumCompensation || undefined,
    };

    const opportunities = await prisma.opportunity.findMany({
      take: 50,
      orderBy: { discoveredAt: "desc" },
    });

    const matchResults = [];

    for (const opp of opportunities) {
      const match = computeOpportunityMatch(opp, profileData);

      // Record or update match in database
      const record = await prisma.opportunityMatch.upsert({
        where: {
          userId_opportunityId: {
            userId: user.id,
            opportunityId: opp.id,
          },
        },
        update: {
          matchScore: match.score,
          reasons: match.reasons,
          concerns: match.concerns,
        },
        create: {
          userId: user.id,
          opportunityId: opp.id,
          matchScore: match.score,
          reasons: match.reasons,
          concerns: match.concerns,
        },
      });

      matchResults.push({
        opportunityId: opp.id,
        title: opp.title,
        matchScore: match.score,
        reasons: match.reasons,
        concerns: match.concerns,
      });
    }

    return NextResponse.json({
      success: true,
      totalMatched: matchResults.length,
      matches: matchResults.sort((a, b) => b.matchScore - a.matchScore),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
