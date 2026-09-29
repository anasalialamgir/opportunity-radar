import { AIProvider, AIRequest } from "./types";

function parseJson<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned) as T;
}

class OpenAIProvider implements AIProvider {
  name = "openai";
  constructor(private apiKey: string) {}
  async generateText(input: AIRequest): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", response_format: { type: "json_object" }, messages: [
        { role: "system", content: input.systemPrompt || "Return a JSON object." }, { role: "user", content: input.prompt },
      ], temperature: input.temperature ?? 0.2 }), signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`AI request failed (${res.status}). Check the provider configuration.`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI provider returned an empty response.");
    return content;
  }
  async structuredOutput<T>(input: AIRequest): Promise<T> { return parseJson<T>(await this.generateText(input)); }
}

class OllamaProvider implements AIProvider {
  name = "ollama";
  constructor(private baseUrl: string) {}
  async generateText(input: AIRequest): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "llama3", prompt: input.prompt, system: input.systemPrompt, stream: false, format: "json" }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`Local AI request failed (${res.status}).`);
    const data = await res.json();
    if (!data.response) throw new Error("Local AI returned an empty response.");
    return data.response;
  }
  async structuredOutput<T>(input: AIRequest): Promise<T> { return parseJson<T>(await this.generateText(input)); }
}

export function getAIProvider(): AIProvider {
  if (process.env.AI_PROVIDER === "ollama") return new OllamaProvider(process.env.OLLAMA_BASE_URL || "http://localhost:11434");
  if (process.env.OPENAI_API_KEY) return new OpenAIProvider(process.env.OPENAI_API_KEY);
  throw new Error("AI is not configured. Set OPENAI_API_KEY or AI_PROVIDER=ollama.");
}
