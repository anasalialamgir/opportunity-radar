import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "@/lib/sources/types";

export class GitHubOpportunitySource implements OpportunitySource {
  id = "github";
  name = "GitHub paid issues";
  description = "Public issues explicitly labeled bounty or paid.";
  enabled = true;
  capabilities = { search: true, realtime: true, pagination: false };
  async healthCheck(): Promise<SourceHealth> {
    const start = Date.now();
    try {
      const res = await fetch("https://api.github.com/rate_limit", { headers: { "User-Agent": "opportunity-radar" }, signal: AbortSignal.timeout(10000) });
      return { status: res.ok ? "healthy" : "down", latencyMs: Date.now() - start, message: res.ok ? "Public API reachable" : `HTTP ${res.status}` };
    } catch { return { status: "down", latencyMs: Date.now() - start, message: "API unreachable" }; }
  }
  async search(query: SearchQuery): Promise<RawOpportunity[]> {
    const skill = (query.skills || []).find(s => /^[\w .+#-]{2,40}$/.test(s));
    const q = `${skill ? `"${skill}" ` : ""}is:issue is:open label:bounty`;
    const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=30&sort=updated`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "opportunity-radar" }, signal: AbortSignal.timeout(12000), next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
    const data = await res.json();
    return (data.items || []).filter((item: any) => item.html_url && item.title && !item.pull_request).map((item: any): RawOpportunity => ({
      externalId: String(item.id), title: item.title, description: (item.body || item.title).slice(0, 12000),
      sourceUrl: item.html_url, sourceName: "GitHub bounty", company: item.repository_url?.split("/").slice(-2).join("/"),
      location: "Check issue terms", remote: true, publishedAt: item.created_at,
    }));
  }
}
