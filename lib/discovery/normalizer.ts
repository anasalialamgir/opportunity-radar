import { RawOpportunity } from "@/lib/sources/types";

export interface NormalizedOpportunity {
  title: string;
  description: string;
  category: string;
  source: string;
  sourceUrl: string;
  company?: string;
  location?: string;
  remote: boolean;
  minCompensation?: number;
  maxCompensation?: number;
  currency: string;
  compensationPeriod: string;
  requirements: string[];
  skills: string[];
  publishedAt?: Date;
  discoveredAt: Date;
  verificationStatus: "unverified" | "source_confirmed" | "verified";
  rawData?: any;
}

export function normalizeOpportunity(raw: RawOpportunity): NormalizedOpportunity {
  // Infer category
  const text = `${raw.title} ${raw.description}`.toLowerCase();
  let category = "other";
  if (text.includes("freelance") || text.includes("gig")) category = "freelance";
  else if (text.includes("contract") || text.includes("project")) category = "contract";
  else if (text.includes("grant") || text.includes("fellowship")) category = "grant";
  else if (text.includes("bounty") || text.includes("open-source")) category = "open_source";
  else if (text.includes("job") || text.includes("full-time") || text.includes("engineer")) category = "job";

  // Simple number extraction from raw compensation string
  let minComp: number | undefined;
  let maxComp: number | undefined;
  if (raw.rawCompensation) {
    const numbers = raw.rawCompensation.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      minComp = parseFloat(numbers[0]);
      maxComp = parseFloat(numbers[1]);
    } else if (numbers && numbers.length === 1) {
      minComp = parseFloat(numbers[0]);
    }
  }

  // Detect remote
  const isRemote = raw.remote ?? (text.includes("remote") || (raw.location?.toLowerCase().includes("remote") ?? false));

  return {
    title: raw.title.trim(),
    description: raw.description.trim(),
    category,
    source: raw.sourceName || "Unknown",
    sourceUrl: raw.sourceUrl,
    company: raw.company || "Independent Client",
    location: raw.location || (isRemote ? "Remote" : "Unspecified"),
    remote: isRemote,
    minCompensation: minComp,
    maxCompensation: maxComp,
    currency: "USD",
    compensationPeriod: "project",
    requirements: [],
    skills: [],
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : new Date(),
    discoveredAt: new Date(),
    verificationStatus: "source_confirmed",
    rawData: raw.rawData || {},
  };
}
