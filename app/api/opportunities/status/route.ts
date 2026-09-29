import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
const statuses = ["Saved", "Preparing", "Applied", "Interview", "Offer", "Rejected", "Closed"];
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const [saved, applications] = await Promise.all([
    prisma.savedOpportunity.findMany({ where: { userId, dismissed: false }, include: { opportunity: true }, orderBy: { savedAt: "desc" } }),
    prisma.application.findMany({ where: { userId }, include: { opportunity: true }, orderBy: { updatedAt: "desc" } }),
  ]);
  const items = new Map<string, any>();
  saved.forEach(s => items.set(s.opportunityId, { ...s.opportunity, status: "Saved" }));
  applications.forEach(a => items.set(a.opportunityId, { ...a.opportunity, status: a.status }));
  return NextResponse.json({ items: Array.from(items.values()) });
}
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { opportunityId, action, status } = await req.json();
  if (typeof opportunityId !== "string" || !["save", "dismiss", "applied", "status"].includes(action)) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId }, select: { id: true } });
  if (!opp) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (action === "save" || action === "dismiss") await prisma.savedOpportunity.upsert({ where: { userId_opportunityId: { userId, opportunityId } }, update: { dismissed: action === "dismiss" }, create: { userId, opportunityId, dismissed: action === "dismiss" } });
  else {
    const next = action === "applied" ? "Applied" : status;
    if (!statuses.includes(next)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    await prisma.application.upsert({ where: { userId_opportunityId: { userId, opportunityId } }, update: { status: next, appliedAt: next === "Applied" ? new Date() : undefined }, create: { userId, opportunityId, status: next, appliedAt: next === "Applied" ? new Date() : null } });
  }
  return NextResponse.json({ success: true });
}
