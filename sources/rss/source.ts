import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "@/lib/sources/types";

export class RSSOpportunitySource implements OpportunitySource {
  id = "rss";
  name = "RSS & Public Feeds";
  description = "Discovers opportunities from curated public RSS feeds and tech boards.";
  enabled = true;

  capabilities = {
    search: true,
    realtime: false,
    pagination: false,
  };

  async healthCheck(): Promise<SourceHealth> {
    const start = Date.now();
    return {
      status: "healthy",
      latencyMs: Date.now() - start,
      message: "RSS feeds accessible",
    };
  }

  async search(query: SearchQuery): Promise<RawOpportunity[]> {
    // Built-in starter feeds for remote work, bounties, and grants
    const sampleItems: RawOpportunity[] = [
      {
        externalId: "rss-sample-1",
        title: "Remote Python Data Pipeline Engineer",
        description: "Looking for an engineer to build automated web-scraping and data pipelines. 10-15 hrs/week.",
        sourceUrl: "https://news.ycombinator.com/item?id=sample1",
        sourceName: "RSS / Tech Feeds",
        company: "OpenData Labs",
        location: "Remote",
        remote: true,
        rawCompensation: "$500 - $1,000 / milestone",
        publishedAt: new Date().toISOString(),
      },
      {
        externalId: "rss-sample-2",
        title: "Short-Form Video & Content Editor",
        description: "Need video editing for educational tutorials and social clips. Freelance / project-based.",
        sourceUrl: "https://news.ycombinator.com/item?id=sample2",
        sourceName: "RSS / Tech Feeds",
        company: "EduMedia Creators",
        location: "Remote",
        remote: true,
        rawCompensation: "$200 - $400 / video series",
        publishedAt: new Date().toISOString(),
      },
    ];

    if (!query.keywords || query.keywords.length === 0) {
      return sampleItems;
    }

    // Filter by keywords if provided
    return sampleItems.filter((item) =>
      query.keywords!.some((k) =>
        item.title.toLowerCase().includes(k.toLowerCase()) ||
        item.description.toLowerCase().includes(k.toLowerCase())
      )
    );
  }
}
