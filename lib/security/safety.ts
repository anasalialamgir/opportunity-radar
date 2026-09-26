export interface SafetyCheckResult {
  isSafe: boolean;
  warnings: string[];
}

export function evaluateOpportunitySafety(
  title: string,
  description: string
): SafetyCheckResult {
  const warnings: string[] = [];
  const text = `${title} ${description}`.toLowerCase();

  // 1. Upfront payment requests
  const upfrontPatterns = [
    /pay\s+(an?\s+)?(upfront|registration|application|training|equipment)\s+fee/i,
    /send\s+\$?\d+\s+to\s+start/i,
    /purchase\s+our\s+starter\s+kit/i,
    /wire\s+transfer/i,
    /crypto\s+deposit/i,
  ];

  if (upfrontPatterns.some((pattern) => pattern.test(text))) {
    warnings.push("⚠️ Potential risk: Listing requests an upfront payment, fee, or deposit.");
  }

  // 2. Unrealistic earnings claims
  const unrealisticPatterns = [
    /earn\s+\$?\d{4,}\s+(per|a)\s+day/i,
    /get\s+rich\s+quick/i,
    /guaranteed\s+income\s+no\s+experience/i,
    /\$10,?000\s+(weekly|per\s+week)\s+guaranteed/i,
  ];

  if (unrealisticPatterns.some((pattern) => pattern.test(text))) {
    warnings.push("⚠️ Suspicious claim: Unrealistic earning guarantees detected.");
  }

  // 3. Requests for sensitive personal information
  const sensitiveInfoPatterns = [
    /send\s+(your\s+)?(passport|id\s+card|social\s+security|ssn|bank\s+login|password)/i,
    /provide\s+banking\s+credentials/i,
  ];

  if (sensitiveInfoPatterns.some((pattern) => pattern.test(text))) {
    warnings.push("🚨 High risk: Never share passwords, government IDs, or banking credentials.");
  }

  return {
    isSafe: warnings.length === 0,
    warnings,
  };
}
