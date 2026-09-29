import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const opp = await prisma.opportunity.findUnique({ where: { id: params.id }, include: { matches: { where: { userId } } } });
  if (!opp) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  return NextResponse.json({ opportunity: { ...opp, matches: undefined, matchScore: opp.matches[0]?.matchScore ?? null, reasons: opp.matches[0]?.reasons || [], concerns: opp.matches[0]?.concerns || [] } });
}
