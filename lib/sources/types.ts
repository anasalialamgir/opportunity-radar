export interface SearchQuery {
  keywords?: string[];
  skills?: string[];
  remoteOnly?: boolean;
  minCompensation?: number;
  category?: string;
  limit?: number;
}

export interface RawOpportunity {
  externalId?: string;
  title: string;
  description: string;
  sourceUrl: string;
  sourceName: string;
  company?: string;
  location?: string;
  remote?: boolean;
  rawCompensation?: string;
  publishedAt?: Date | string;
  rawData?: Record<string, any>;
}

export interface SourceHealth {
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  message?: string;
}

export interface OpportunitySource {
  id: string;
  name: string;
  description: string;
  enabled: boolean;

  capabilities: {
    search: boolean;
    realtime: boolean;
    pagination: boolean;
  };

  search(query: SearchQuery): Promise<RawOpportunity[]>;
  fetch?(url: string): Promise<RawOpportunity | null>;
  healthCheck(): Promise<SourceHealth>;
}
