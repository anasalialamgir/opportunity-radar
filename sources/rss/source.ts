import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "@/lib/sources/types";

/** Remotive's published public feed. Jobs link back to the original listing. */
export class RSSOpportunitySource implements OpportunitySource {
  id = "remotive";
  name = "Remotive public jobs";
  description = "Published remote job listings from Remotive.";
  enabled = true;
  capabilities = { search: true, realtime: false, pagination: false };

  async healthCheck(): Promise<SourceHealth> {
    const start = Date.now();
    try {
      const res = await fetch("https://remotive.com/api/remote-jobs?limit=1", { signal: AbortSignal.timeout(10000) });
      return { status: res.ok ? "healthy" : "down", latencyMs: Date.now() - start, message: res.ok ? "Feed reachable" : `HTTP ${res.status}` };
    } catch { return { status: "down", latencyMs: Date.now() - start, message: "Feed unreachable" }; }
  }

  async search(_query: SearchQuery): Promise<RawOpportunity[]> {
    const res = await fetch("https://remotive.com/api/remote-jobs?limit=100", { signal: AbortSignal.timeout(12000), next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Remotive returned ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.jobs)) throw new Error("Invalid Remotive response");
    return data.jobs.filter((job: any) => /^https:\/\/remotive\.com\//.test(job.url) && job.title && job.description).map((job: any): RawOpportunity => ({
      externalId: String(job.id), title: job.title, description: String(job.description).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").slice(0, 12000),
      sourceUrl: job.url, sourceName: "Remotive", company: job.company_name, location: job.candidate_required_location || "Remote (check eligibility)",
      remote: true, rawCompensation: job.salary || undefined, publishedAt: job.publication_date,
    }));
  }
}
