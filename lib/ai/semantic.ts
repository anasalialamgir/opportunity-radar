export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0, aNorm = 0, bNorm = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aNorm += a[i] ** 2; bNorm += b[i] ** 2; }
  return aNorm && bNorm ? dot / Math.sqrt(aNorm * bNorm) : 0;
}

async function embeddings(inputs: string[]): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small", input: inputs }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Embeddings returned ${res.status}`);
  const data = await res.json();
  const ordered = (data.data || []).sort((a: any, b: any) => a.index - b.index).map((item: any) => item.embedding);
  if (ordered.length !== inputs.length || !ordered.every(Array.isArray)) throw new Error("Invalid embedding response");
  return ordered;
}

export async function semanticScores(profileText: string, jobTexts: string[]): Promise<number[] | null> {
  if (!process.env.OPENAI_API_KEY || process.env.AI_SEMANTIC_MATCHING === "false" || !jobTexts.length) return null;
  const input = [profileText.slice(0, 2000), ...jobTexts.map(s => s.slice(0, 650))];
  const vectors: number[][] = [];
  for (let i = 0; i < input.length; i += 100) vectors.push(...await embeddings(input.slice(i, i + 100)));
  const profile = vectors[0];
  return vectors.slice(1).map(vector => Math.max(0, Math.min(100, Math.round((cosineSimilarity(profile, vector) - 0.25) * 150))));
}

export function blendScores(lexical: number, semantic: number): number {
  return Math.max(0, Math.min(99, Math.round(lexical * 0.65 + semantic * 0.35)));
}
