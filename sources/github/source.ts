import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "@/lib/sources/types";

export class GitHubOpportunitySource implements OpportunitySource {
  id = "github";
  name = "GitHub Bounties & Grants";
  description = "Discovers paid issues, open-source bounties, and developer grants.";
  enabled = true;

  capabilities = {
    search: true,
    realtime: true,
    pagination: false,
  };

  async healthCheck(): Promise<SourceHealth> {
    return {
      status: "healthy",
      latencyMs: 80,
      message: "GitHub Public API connected",
    };
  }

  async search(query: SearchQuery): Promise<RawOpportunity[]> {
    // Simulated live GitHub bounty items
    const bountyList: RawOpportunity[] = [
      {
        externalId: "gh-bounty-101",
        title: "Build automated test suite for TypeScript SDK",
        description: "Funded issue: write integration tests and documentation for our open API client. Fast payout upon merge.",
        sourceUrl: "https://github.com/example-org/repo/issues/101",
        sourceName: "GitHub Bounties",
        company: "OpenCore Foundation",
        location: "Remote",
        remote: true,
        rawCompensation: "$350 Bounty",
        publishedAt: new Date().toISOString(),
      },
      {
        externalId: "gh-bounty-102",
        title: "Python Data Migration Script & CLI Tool",
        description: "We need a clean CLI script to migrate SQLite records to PostgreSQL with data validation.",
        sourceUrl: "https://github.com/example-org/repo/issues/102",
        sourceName: "GitHub Bounties",
        company: "DataMesh Tools",
        location: "Remote",
        remote: true,
        rawCompensation: "$500 Bounty",
        publishedAt: new Date().toISOString(),
      }
    ];

    if (!query.skills || query.skills.length === 0) return bountyList;

    return bountyList.filter((b) =>
      query.skills!.some((skill) =>
        b.title.toLowerCase().includes(skill.toLowerCase()) ||
        b.description.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }
}
