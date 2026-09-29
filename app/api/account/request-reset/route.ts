import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mailConfigured } from "@/lib/mailer";
import { sendPasswordReset } from "@/lib/account-tokens";
export async function POST(req: Request) {
  if (!mailConfigured()) return NextResponse.json({ error: "Password reset email is not configured. Contact the site operator." }, { status: 503 });
  const { email } = await req.json();
  if (typeof email !== "string" || email.length > 254) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  const recent = user && await prisma.passwordResetToken.findFirst({ where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60000) } } });
  if (user?.email && !recent) { try { await sendPasswordReset(user.id, user.email); } catch (error) { console.error("Reset email failed:", error); } }
  return NextResponse.json({ success: true, message: "If an account exists, an email has been sent." });
}
