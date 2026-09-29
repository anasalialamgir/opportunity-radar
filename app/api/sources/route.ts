import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/current-user";
import { RSSOpportunitySource } from "@/sources/rss/source";
import { GitHubOpportunitySource } from "@/sources/github/source";
export async function GET() {
  if (!await currentUserId()) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const sources = [new RSSOpportunitySource(), new GitHubOpportunitySource()];
  return NextResponse.json({ sources: sources.map(s => ({ id: s.id, name: s.name, description: s.description })), health: await Promise.all(sources.map(s => s.healthCheck())) });
}
