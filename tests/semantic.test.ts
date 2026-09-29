import { test } from "node:test";
import { strict as assert } from "node:assert";
import { blendScores, cosineSimilarity, semanticScores } from "../lib/ai/semantic";
test("semantic similarity compares aligned and unrelated vectors", () => {
  assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(blendScores(80, 40), 66);
});
test("embeddings preserve provider indexes in their input order", async () => {
  const oldKey = process.env.OPENAI_API_KEY, oldFetch = global.fetch;
  process.env.OPENAI_API_KEY = "test-key";
  global.fetch = (async (_url: any, options: any) => {
    const body = JSON.parse(options.body);
    assert.equal(body.model, "text-embedding-3-small");
    return { ok: true, json: async () => ({ data: body.input.map((_s: string, index: number) => ({ index, embedding: index === 1 ? [1, 0] : index === 2 ? [0, 1] : [1, 0] })).reverse() }) } as Response;
  }) as typeof fetch;
  try { assert.deepEqual(await semanticScores("CV", ["related", "unrelated"]), [100, 0]); }
  finally { global.fetch = oldFetch; if (oldKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = oldKey; }
});
