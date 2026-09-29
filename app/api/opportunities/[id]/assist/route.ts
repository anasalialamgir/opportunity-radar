import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
import { generateOpportunityAssistance } from "@/lib/ai/assistance";
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const [opp, profile] = await Promise.all([
    prisma.opportunity.findUnique({ where: { id: params.id } }),
    prisma.profile.findUnique({ where: { userId }, include: { skills: true, experiences: true, userCapabilities: true } }),
  ]);
  if (!opp) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (!profile) return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  try {
    const summary = `Skills: ${profile.skills.map(s => s.name).join(", ")}. Experience: ${profile.experiences.map(e => `${e.title} at ${e.company || "unknown"}`).join("; ")}. Capabilities: ${profile.userCapabilities.map(c => c.description).join("; ")}`;
    return NextResponse.json({ assistance: await generateOpportunityAssistance(opp.title, opp.description, summary) });
  } catch { return NextResponse.json({ error: "AI assistant unavailable. Check configuration." }, { status: 503 }); }
}
