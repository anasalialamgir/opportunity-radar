import { getAIProvider } from "./providers";

export interface ExtractedOpportunityResult {
  isOpportunity: boolean;
  category?: string;
  skills: string[];
  remote: boolean;
  compensation?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  deadline?: string | null;
  confidence: number;
}

export async function extractOpportunityData(text: string): Promise<ExtractedOpportunityResult> {
  const provider = getAIProvider();

  const prompt = `
Analyze the text below. Determine if this describes a legitimate earning opportunity (job, freelance, gig, grant, competition, research, contract).
If NOT an opportunity (e.g. blog post, generic news, advertisement), return: {"isOpportunity": false, "confidence": 0.99, "skills": [], "remote": false}

If it IS an opportunity, return strict JSON:
{
  "isOpportunity": true,
  "category": "freelance | job | contract | grant | other",
  "skills": ["string"],
  "remote": true | false,
  "compensation": {
    "min": 100,
    "max": 500,
    "currency": "USD"
  },
  "deadline": null,
  "confidence": 0.95
}

TEXT:
"""
${text.slice(0, 3000)}
"""
`;

  try {
    const result = await provider.structuredOutput<ExtractedOpportunityResult>({
      prompt,
      systemPrompt: "You are an opportunity extraction engine. Return only JSON.",
      temperature: 0.1,
    });
    return result;
  } catch (error) {
    // Graceful fallback heuristics
    const isOpp = /looking for|hiring|bounty|budget|compensation|\$|freelance/i.test(text);
    return {
      isOpportunity: isOpp,
      skills: [],
      remote: /remote/i.test(text),
      confidence: 0.7,
    };
  }
}
