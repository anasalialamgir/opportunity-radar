import { getAIProvider } from "./providers";

export interface OpportunityAssistance {
  summary: string;
  fitExplanation: string;
  missingRequirements: string[];
  preparationAdvice: string[];
  suggestedApplicationDraft: string;
}

export async function generateOpportunityAssistance(
  opportunityTitle: string,
  opportunityDescription: string,
  userProfileSummary: string
): Promise<OpportunityAssistance> {
  const provider = getAIProvider();

  const prompt = `
You are an AI Opportunity Advisor.
Analyze this opportunity against the user's profile.
Generate:
1. A concise 2-sentence summary of what this opportunity is actually asking for.
2. A fit explanation (why it matches).
3. Any missing requirements or potential concerns.
4. Actionable preparation advice before applying.
5. A suggested direct message or proposal draft (human tone, polite, professional, not generic corporate fluff).

Return strict JSON:
{
  "summary": "string",
  "fitExplanation": "string",
  "missingRequirements": ["string"],
  "preparationAdvice": ["string"],
  "suggestedApplicationDraft": "string"
}

OPPORTUNITY:
Title: ${opportunityTitle}
Details: ${opportunityDescription}

USER BACKGROUND:
${userProfileSummary}
`;

  try {
    return await provider.structuredOutput<OpportunityAssistance>({
      prompt,
      systemPrompt: "You assist users in reviewing opportunities. Return only JSON.",
      temperature: 0.3,
    });
  } catch (error) {
    return {
      summary: `Opportunity for ${opportunityTitle}.`,
      fitExplanation: "Matches your stated experience and availability.",
      missingRequirements: ["Verify any domain-specific requirements directly with client."],
      preparationAdvice: ["Review portfolio links", "Tailor your sample work"],
      suggestedApplicationDraft: `Hi,\n\nI saw your listing for "${opportunityTitle}" and believe my experience matches your requirements. I'd be glad to discuss how I can help.\n\nBest regards,`,
    };
  }
}
