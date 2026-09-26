import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOpportunityAssistance } from "@/lib/ai/assistance";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const opportunityId = params.id;
    const { userEmail } = await req.json().catch(() => ({ userEmail: undefined }));

    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    let userSummary = "User has skills in automation, research, and communication.";
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { profile: { include: { skills: true, userCapabilities: true } } },
      });
      if (user?.profile) {
        userSummary = `Skills: ${user.profile.skills.map((s) => s.name).join(", ")}. Capabilities: ${user.profile.userCapabilities.map((c) => c.description).join("; ")}`;
      }
    }

    const assistance = await generateOpportunityAssistance(
      opp.title,
      opp.description,
      userSummary
    );

    return NextResponse.json({ success: true, assistance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
