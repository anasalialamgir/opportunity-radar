import nodemailer from "nodemailer";

export function mailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.EMAIL_FROM && process.env.NEXTAUTH_URL);
}

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  if (!mailConfigured()) throw new Error("Email delivery is not configured.");
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, text });
}
