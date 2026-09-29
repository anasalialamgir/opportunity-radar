import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runAlertCycle } from "@/lib/alerts";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(req: Request) {
  const configured = process.env.CRON_SECRET;
  const received = req.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!configured || !received || Buffer.byteLength(configured) !== Buffer.byteLength(received) || !timingSafeEqual(Buffer.from(configured), Buffer.from(received))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await runAlertCycle()); }
  catch (error: any) { return NextResponse.json({ error: error.message || "Alert cycle failed" }, { status: 503 }); }
}
