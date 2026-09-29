import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mailConfigured } from "@/lib/mailer";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected", ai: !!process.env.OPENAI_API_KEY || !!process.env.GEMINI_API_KEY || process.env.AI_PROVIDER === "ollama" ? "configured" : "manual profile mode", email: mailConfigured() ? "configured" : "not configured" }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ status: "unavailable", database: "disconnected" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
