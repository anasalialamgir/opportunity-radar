import { NormalizedOpportunity } from "./normalizer";

export interface DeduplicatedItem {
  opportunity: NormalizedOpportunity;
  sourceCount: number;
  allSourceUrls: string[];
}

export function deduplicateOpportunities(items: NormalizedOpportunity[]): DeduplicatedItem[] {
  const map = new Map<string, DeduplicatedItem>();

  for (const item of items) {
    // Generate normalized signature: title lowercase without punctuation + company
    const cleanTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    const cleanCompany = (item.company || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
    const key = item.sourceUrl || `${cleanTitle}_${cleanCompany}`;

    if (map.has(key)) {
      const existing = map.get(key)!;
      existing.sourceCount += 1;
      if (!existing.allSourceUrls.includes(item.sourceUrl)) {
        existing.allSourceUrls.push(item.sourceUrl);
      }
    } else {
      map.set(key, {
        opportunity: item,
        sourceCount: 1,
        allSourceUrls: [item.sourceUrl],
      });
    }
  }

  return Array.from(map.values());
}
