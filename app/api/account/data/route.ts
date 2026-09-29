import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
import { verifyPassword } from "@/lib/password";
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: {
    name: true, email: true, emailVerified: true, createdAt: true,
    profile: { include: { skills: true, experiences: true, education: true, certifications: true, userCapabilities: true } },
    alertRules: true, applications: { include: { opportunity: true } }, savedOpportunities: { include: { opportunity: true } }, notifications: true,
  } });
  return new NextResponse(JSON.stringify(user, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": "attachment; filename=opportunity-radar-data.json", "Cache-Control": "no-store" } });
}
export async function DELETE(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { password } = await req.json();
  if (typeof password !== "string") return NextResponse.json({ error: "Password required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user?.passwordHash || !await verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Password is incorrect" }, { status: 403 });
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}
