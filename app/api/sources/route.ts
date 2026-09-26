import { NextResponse } from "next/server";
import { sourceRegistry } from "@/lib/sources/registry";
import { RSSOpportunitySource } from "@/sources/rss/source";

// Ensure default sources are registered on server startup
if (!sourceRegistry.get("rss")) {
  sourceRegistry.register(new RSSOpportunitySource());
}

export async function GET() {
  const sources = sourceRegistry.list().map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    enabled: s.enabled,
    capabilities: s.capabilities,
  }));

  const health = await sourceRegistry.checkAllHealth();

  return NextResponse.json({ sources, health });
}

export async function POST(req: Request) {
  try {
    const { id, enabled } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Source ID is required" }, { status: 400 });
    }

    if (enabled) {
      sourceRegistry.enable(id);
    } else {
      sourceRegistry.disable(id);
    }

    return NextResponse.json({ success: true, id, enabled });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
