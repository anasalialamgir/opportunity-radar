import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const issue = () => randomBytes(32).toString("hex");
const url = (path: string, token: string) => `${process.env.NEXTAUTH_URL?.replace(/\/$/, "")}${path}?token=${encodeURIComponent(token)}`;

export async function sendVerification(userId: string, email: string): Promise<void> {
  const token = issue();
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  const row = await prisma.emailVerificationToken.create({ data: { userId, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 24 * 3600000) } });
  try { await sendMail(email, "Verify your Opportunity Radar email", `Open this link within 24 hours to verify your email:\n${url("/verify-email", token)}\n\nIf you did not register, ignore this email.`); }
  catch (e) { await prisma.emailVerificationToken.delete({ where: { id: row.id } }); throw e; }
}

export async function sendPasswordReset(userId: string, email: string): Promise<void> {
  const token = issue();
  await prisma.passwordResetToken.deleteMany({ where: { userId } });
  const row = await prisma.passwordResetToken.create({ data: { userId, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 3600000) } });
  try { await sendMail(email, "Reset your Opportunity Radar password", `Open this link within one hour to reset your password:\n${url("/reset-password", token)}\n\nIf you did not ask for this, ignore the email.`); }
  catch (e) { await prisma.passwordResetToken.delete({ where: { id: row.id } }); throw e; }
}
