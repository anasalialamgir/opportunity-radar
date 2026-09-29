import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const [user, alerts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } }),
    prisma.alertRule.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);
  return NextResponse.json({ alerts, emailVerified: !!user?.emailVerified });
}
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { keyword, minimumScore } = await req.json();
  const value = typeof keyword === "string" ? keyword.trim().slice(0, 80) : "";
  const threshold = Number(minimumScore);
  if (!value || !Number.isInteger(threshold) || threshold < 0 || threshold > 99) return NextResponse.json({ error: "Enter a keyword and threshold from 0 to 99." }, { status: 400 });
  if (await prisma.alertRule.count({ where: { userId } }) >= 20) return NextResponse.json({ error: "Maximum of 20 alerts." }, { status: 400 });
  const alert = await prisma.alertRule.create({ data: { userId, keyword: value, minimumScore: threshold } });
  return NextResponse.json({ alert }, { status: 201 });
}
