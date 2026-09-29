import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { mailConfigured } from "@/lib/mailer";
import { sendVerification } from "@/lib/account-tokens";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || password.length < 12 || password.length > 128) {
      return NextResponse.json({ error: "Enter a name, valid email, and password of at least 12 characters." }, { status: 400 });
    }
    const user = await prisma.user.create({ data: { name: name.trim().slice(0, 120), email: email.trim().toLowerCase(), passwordHash: await hashPassword(password) } });
    let emailSent = false;
    if (mailConfigured() && user.email) {
      try { await sendVerification(user.id, user.email); emailSent = true; } catch (error) { console.error("Verification email failed:", error); }
    }
    return NextResponse.json({ success: true, emailSent }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
