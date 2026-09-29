import { test } from "node:test";
import { strict as assert } from "node:assert";
import { getAIProvider } from "../lib/ai/providers";
import { semanticScores } from "../lib/ai/semantic";

test("Gemini parses structured CV output and scores embeddings in order", async () => {
  const previous = { provider: process.env.AI_PROVIDER, key: process.env.GEMINI_API_KEY, fetch: global.fetch };
  process.env.AI_PROVIDER = "gemini";
  process.env.GEMINI_API_KEY = "test-key";
  global.fetch = (async (url: string, options: RequestInit) => {
    assert.equal((options.headers as Record<string, string>)["x-goog-api-key"], "test-key");
    if (url.endsWith(":generateContent")) {
      const body = JSON.parse(options.body as string);
      assert.equal(body.generationConfig.responseMimeType, "application/json");
      assert.equal(body.contents[0].parts[0].text, "Parse this CV");
      return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '{"skills":["regulatory affairs"]}' }] } }] }) } as Response;
    }
    assert.ok(url.endsWith(":batchEmbedContents"));
    const body = JSON.parse(options.body as string);
    assert.equal(body.requests.length, 3);
    return { ok: true, json: async () => ({ embeddings: [{ values: [1, 0] }, { values: [1, 0] }, { values: [0, 1] }] }) } as Response;
  }) as typeof fetch;
  try {
    assert.deepEqual(await getAIProvider().structuredOutput({ prompt: "Parse this CV" }), { skills: ["regulatory affairs"] });
    assert.deepEqual(await semanticScores("CV", ["related", "unrelated"]), [100, 0]);
  } finally {
    global.fetch = previous.fetch;
    if (previous.provider === undefined) delete process.env.AI_PROVIDER; else process.env.AI_PROVIDER = previous.provider;
    if (previous.key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previous.key;
  }
});
