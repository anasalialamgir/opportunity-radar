import { evaluateOpportunitySafety } from "../lib/security/safety";
import { computeOpportunityMatch } from "../lib/ai/matching";

function runTests() {
  console.log("Starting Opportunity Radar Test Suite...\n");

  // Test 1: Scam Detection flags upfront fee
  const scamCheck = evaluateOpportunitySafety(
    "Easy Data Entry",
    "Please send a $50 registration fee via wire transfer to receive equipment."
  );
  if (scamCheck.isSafe || scamCheck.warnings.length === 0) {
    throw new Error("Failed: Scam detector did not catch upfront fee!");
  }
  console.log("✓ Scam Detector: Successfully flagged upfront registration fee.");

  // Test 2: Safe Listing passes inspection
  const safeCheck = evaluateOpportunitySafety(
    "Remote Python Developer",
    "Looking for someone with 2 years of experience to automate reports."
  );
  if (!safeCheck.isSafe) {
    throw new Error("Failed: Legitimate listing was falsely flagged as unsafe!");
  }
  console.log("✓ Scam Detector: Clean listing passed without false positives.");

  // Test 3: Match Engine gives high score for skill alignment
  const matchResult = computeOpportunityMatch(
    {
      id: "test-opp",
      title: "Remote Python & Excel Automation Specialist",
      description: "Automate financial spreadsheets and pipelines using Python.",
      remote: true,
      minCompensation: 600,
    },
    {
      skills: ["Python", "Excel"],
      capabilities: ["Automation"],
      locationPreference: "remote",
      minimumCompensation: 500,
    }
  );

  if (matchResult.score < 80) {
    throw new Error(`Failed: Expected score >= 80, got ${matchResult.score}`);
  }
  console.log(`✓ Match Engine: Produced score of ${matchResult.score}% with reasons:`);
  matchResult.reasons.forEach((r) => console.log(`    ${r}`));

  console.log("\nAll Phase 12 tests passed successfully!");
}

runTests();
