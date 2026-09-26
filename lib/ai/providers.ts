import { AIProvider, AIRequest } from "./types";

class OpenAIProvider implements AIProvider {
  name = "openai";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(input: AIRequest): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          ...(input.systemPrompt ? [{ role: "system", content: input.systemPrompt }] : []),
          { role: "user", content: input.prompt },
        ],
        temperature: input.temperature ?? 0.2,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async structuredOutput<T>(input: AIRequest): Promise<T> {
    const raw = await this.generateText(input);
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  }
}

class OllamaProvider implements AIProvider {
  name = "ollama";
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  async generateText(input: AIRequest): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: input.prompt,
        system: input.systemPrompt,
        stream: false,
      }),
    });
    const data = await res.json();
    return data.response || "";
  }

  async structuredOutput<T>(input: AIRequest): Promise<T> {
    const raw = await this.generateText(input);
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  }
}

// Built-in rule-based fallback parser for local environments when no external API key is active
class FallbackLocalProvider implements AIProvider {
  name = "fallback-local";

  async generateText(input: AIRequest): Promise<string> {
    return JSON.stringify({ info: "Local fallback response" });
  }

  async structuredOutput<T>(input: AIRequest): Promise<T> {
    const text = input.prompt;
    const foundSkills: string[] = [];
    const keywords = ["Python", "JavaScript", "Excel", "Data Analysis", "React", "Node", "SQL", "Design", "Communication", "Management"];
    keywords.forEach((k) => {
      if (new RegExp(`\\b${k}\\b`, "i").test(text)) foundSkills.push(k);
    });

    const parsed: any = {
      skills: { technical: foundSkills, soft: ["Problem Solving"], domain: [] },
      experience: [{ title: "Professional Role", company: "Extracted from CV", years: 2 }],
      education: [{ degree: "Degree / Coursework", institution: "Educational Institution" }],
      certifications: [],
      languages: ["English"],
      links: {},
    };

    return parsed as T;
  }
}

export function getAIProvider(): AIProvider {
  const providerType = process.env.AI_PROVIDER || "fallback";

  if (providerType === "openai" && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider(process.env.OPENAI_API_KEY);
  }

  if (providerType === "ollama") {
    return new OllamaProvider(process.env.OLLAMA_BASE_URL);
  }

  return new FallbackLocalProvider();
}
