import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { tokenHash } from "@/lib/account-tokens";
export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token) || typeof password !== "string" || password.length < 12 || password.length > 128) return NextResponse.json({ error: "Invalid token or password. Use at least 12 characters." }, { status: 400 });
  const hash = tokenHash(token);
  const row = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash } });
  if (!row || row.expiresAt < new Date()) return NextResponse.json({ error: "This reset link has expired or was already used." }, { status: 400 });
  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async tx => {
    const consumed = await tx.passwordResetToken.deleteMany({ where: { id: row.id, expiresAt: { gt: new Date() } } });
    if (!consumed.count) throw new Error("Token already used");
    await tx.user.update({ where: { id: row.userId }, data: { passwordHash, sessionVersion: { increment: 1 } } });
    await tx.passwordResetToken.deleteMany({ where: { userId: row.userId } });
  });
  return NextResponse.json({ success: true });
}
