import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "@/lib/sources/types";

/**
 * ExampleJobBoardSource
 * A clean, reference implementation of the OpportunitySource interface.
 */
export class ExampleJobBoardSource implements OpportunitySource {
  id = "example-job-board";
  name = "Example Job Board Adapter";
  description = "Reference adapter demonstrating how to connect a remote opportunity board.";
  enabled = true;

  capabilities = {
    search: true,
    realtime: false,
    pagination: true,
  };

  /**
   * Health check to confirm external service availability.
   */
  async healthCheck(): Promise<SourceHealth> {
    const startTime = Date.now();
    try {
      // In production, make a lightweight HEAD or status call to the external endpoint
      return {
        status: "healthy",
        latencyMs: Date.now() - startTime,
        message: "Endpoint is accessible",
      };
    } catch (err: any) {
      return {
        status: "down",
        latencyMs: Date.now() - startTime,
        message: err.message,
      };
    }
  }

  /**
   * Searches the external board using user query criteria.
   */
  async search(query: SearchQuery): Promise<RawOpportunity[]> {
    // 1. Prepare search parameters
    const limit = query.limit || 10;

    // 2. Mock external payload demonstrating clean parsing
    const rawItems: RawOpportunity[] = [
      {
        externalId: "ex-101",
        title: "Contract Technical Writer (Documentation & Guides)",
        description: "Seeking a writer to document our open-source APIs and developer tutorials. 5-10 hrs/week.",
        sourceUrl: "https://example.com/jobs/technical-writer",
        sourceName: this.name,
        company: "DocuTech",
        location: "Remote",
        remote: true,
        rawCompensation: "$40 - $60 / hr",
        publishedAt: new Date().toISOString(),
      },
      {
        externalId: "ex-102",
        title: "Bilingual English/Urdu Customer Support Specialist",
        description: "Assist customers across chat and email. Flexible part-time hours.",
        sourceUrl: "https://example.com/jobs/customer-support",
        sourceName: this.name,
        company: "GlobalCare Solutions",
        location: "Remote",
        remote: true,
        rawCompensation: "$500 - $800 / month",
        publishedAt: new Date().toISOString(),
      },
    ];

    // 3. Filter results based on search query if specified
    if (!query.skills || query.skills.length === 0) {
      return rawItems.slice(0, limit);
    }

    return rawItems
      .filter((item) =>
        query.skills!.some((s) =>
          item.title.toLowerCase().includes(s.toLowerCase()) ||
          item.description.toLowerCase().includes(s.toLowerCase())
        )
      )
      .slice(0, limit);
  }
}
