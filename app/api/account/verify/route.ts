import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tokenHash } from "@/lib/account-tokens";
export async function POST(req: Request) {
  const { token } = await req.json();
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "Invalid link." }, { status: 400 });
  const row = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: tokenHash(token) } });
  if (!row || row.expiresAt < new Date()) return NextResponse.json({ error: "Verification link expired or used." }, { status: 400 });
  await prisma.$transaction(async tx => {
    const consumed = await tx.emailVerificationToken.deleteMany({ where: { id: row.id, expiresAt: { gt: new Date() } } });
    if (!consumed.count) throw new Error("Token already used");
    await tx.user.update({ where: { id: row.userId }, data: { emailVerified: new Date() } });
    await tx.emailVerificationToken.deleteMany({ where: { userId: row.userId } });
  });
  return NextResponse.json({ success: true });
}
