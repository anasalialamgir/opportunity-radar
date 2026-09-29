import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
import { mailConfigured } from "@/lib/mailer";
import { sendVerification } from "@/lib/account-tokens";
export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!mailConfigured()) return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.email || user.emailVerified) return NextResponse.json({ success: true });
  const recent = await prisma.emailVerificationToken.findFirst({ where: { userId, createdAt: { gt: new Date(Date.now() - 60000) } } });
  if (recent) return NextResponse.json({ error: "Please wait a minute before requesting another link." }, { status: 429 });
  await sendVerification(userId, user.email);
  return NextResponse.json({ success: true });
}
