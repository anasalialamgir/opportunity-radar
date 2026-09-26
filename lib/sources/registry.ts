import { OpportunitySource, SearchQuery, RawOpportunity, SourceHealth } from "./types";

class SourceRegistry {
  private sources: Map<string, OpportunitySource> = new Map();

  register(source: OpportunitySource): void {
    this.sources.set(source.id, source);
  }

  get(id: string): OpportunitySource | undefined {
    return this.sources.get(id);
  }

  list(): OpportunitySource[] {
    return Array.from(this.sources.values());
  }

  enable(id: string): boolean {
    const s = this.sources.get(id);
    if (s) {
      s.enabled = true;
      return true;
    }
    return false;
  }

  disable(id: string): boolean {
    const s = this.sources.get(id);
    if (s) {
      s.enabled = false;
      return true;
    }
    return false;
  }

  async runAllEnabled(query: SearchQuery): Promise<RawOpportunity[]> {
    const enabledSources = Array.from(this.sources.values()).filter((s) => s.enabled);
    const results: RawOpportunity[] = [];

    await Promise.all(
      enabledSources.map(async (source) => {
        try {
          const items = await source.search(query);
          results.push(...items);
        } catch (error) {
          console.error(`Error running source ${source.id}:`, error);
        }
      })
    );

    return results;
  }

  async checkAllHealth(): Promise<Record<string, SourceHealth>> {
    const statuses: Record<string, SourceHealth> = {};
    for (const [id, source] of this.sources.entries()) {
      try {
        statuses[id] = await source.healthCheck();
      } catch (err: any) {
        statuses[id] = { status: "down", latencyMs: 0, message: err.message };
      }
    }
    return statuses;
  }
}

// Global singleton instance
export const sourceRegistry = new SourceRegistry();
