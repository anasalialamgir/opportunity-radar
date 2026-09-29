import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "@/lib/sources/types";

export class JobicyOpportunitySource implements OpportunitySource {
  id = "jobicy";
  name = "Jobicy remote jobs";
  description = "Current remote jobs from the Jobicy public API.";
  enabled = true;
  capabilities = { search: true, realtime: false, pagination: false };
  async healthCheck(): Promise<SourceHealth> {
    const start = Date.now();
    try { const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=1", { signal: AbortSignal.timeout(12000), next: { revalidate: 3600 } }); return { status: res.ok ? "healthy" : "down", latencyMs: Date.now() - start, message: res.ok ? "Feed reachable" : `HTTP ${res.status}` }; }
    catch { return { status: "down", latencyMs: Date.now() - start, message: "Feed unreachable" }; }
  }
  async search(query: SearchQuery): Promise<RawOpportunity[]> {
    const terms = (query.skills || []).filter(s => /^[\w .+#-]{2,60}$/.test(s)).slice(0, 2);
    const urls = ["https://jobicy.com/api/v2/remote-jobs?count=200", ...terms.map(s => `https://jobicy.com/api/v2/remote-jobs?count=100&tag=${encodeURIComponent(s)}`)];
    const responses = await Promise.allSettled(urls.map(url => fetch(url, { signal: AbortSignal.timeout(15000), next: { revalidate: 3600 } }).then(async res => {
      if (!res.ok) throw new Error(`Jobicy returned ${res.status}`);
      const data = await res.json(); if (!Array.isArray(data.jobs)) throw new Error("Invalid Jobicy response"); return data.jobs;
    })));
    const jobs = responses.flatMap(r => r.status === "fulfilled" ? r.value : []);
    if (!jobs.length && responses.every(r => r.status === "rejected")) throw new Error("Jobicy unavailable");
    return jobs.filter((job: any) => /^https:\/\/jobicy\.com\//.test(job.url) && job.jobTitle && job.jobDescription).map((job: any): RawOpportunity => ({
      externalId: String(job.id), title: job.jobTitle, description: String(job.jobDescription).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").slice(0, 12000),
      sourceUrl: job.url, sourceName: "Jobicy", company: job.companyName, location: job.jobGeo || "Remote (check eligibility)", remote: true,
      publishedAt: job.pubDate, rawData: { salaryMin: job.salaryMin, salaryMax: job.salaryMax, salaryCurrency: job.salaryCurrency, salaryPeriod: job.salaryPeriod },
    }));
  }
}
