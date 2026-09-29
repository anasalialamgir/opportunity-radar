import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { enabled, minimumScore } = await req.json();
  const existing = await prisma.alertRule.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  if (typeof enabled !== "boolean" && minimumScore === undefined) return NextResponse.json({ error: "Invalid change" }, { status: 400 });
  if (minimumScore !== undefined && (!Number.isInteger(minimumScore) || minimumScore < 0 || minimumScore > 99)) return NextResponse.json({ error: "Invalid threshold" }, { status: 400 });
  const alert = await prisma.alertRule.update({ where: { id: params.id }, data: { enabled: typeof enabled === "boolean" ? enabled : undefined, minimumScore: minimumScore === undefined ? undefined : minimumScore } });
  return NextResponse.json({ alert });
}
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const deleted = await prisma.alertRule.deleteMany({ where: { id: params.id, userId } });
  return deleted.count ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Alert not found" }, { status: 404 });
}
