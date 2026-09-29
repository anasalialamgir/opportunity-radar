import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/current-user";
import { refreshMatches } from "@/lib/discovery/scan";
export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try { const matches = await refreshMatches(userId); return NextResponse.json({ success: true, totalMatched: matches.length, matches }); }
  catch (error: any) { return NextResponse.json({ error: error.message || "Matching failed." }, { status: 500 }); }
}
