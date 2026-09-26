import { getAIProvider } from "./providers";
import { StructuredCV } from "./types";

export async function parseCVContent(rawCvText: string): Promise<StructuredCV> {
  const provider = getAIProvider();

  const prompt = `
Extract structured information from the following CV/Resume text.
Return ONLY valid JSON matching this exact schema:

{
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "domain": ["string"]
  },
  "experience": [
    {
      "title": "string",
      "company": "string",
      "years": 1,
      "summary": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": 2024
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": 2024
    }
  ],
  "languages": ["string"],
  "links": {
    "github": "string",
    "linkedin": "string",
    "portfolio": "string",
    "website": "string"
  },
  "location": "string"
}

CV TEXT:
"""
${rawCvText.slice(0, 10000)}
"""
`;

  return await provider.structuredOutput<StructuredCV>({
    prompt,
    systemPrompt: "You are a professional HR and resume parsing engine. Output strict JSON only.",
    temperature: 0.1,
  });
}
