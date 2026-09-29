import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/current-user";
import { scanForUser } from "@/lib/discovery/scan";
export const maxDuration = 60;
export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to scan jobs." }, { status: 401 });
  try { return NextResponse.json({ success: true, ...await scanForUser(userId) }); }
  catch (error: any) { return NextResponse.json({ error: error.message || "Scan failed." }, { status: 503 }); }
}
