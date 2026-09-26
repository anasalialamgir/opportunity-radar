import { ExampleJobBoardSource } from "./source";

async function runTests() {
  console.log("Running ExampleJobBoardSource tests...");

  const source = new ExampleJobBoardSource();

  // Test 1: Health check
  const health = await source.healthCheck();
  if (health.status !== "healthy") {
    throw new Error(`Health check failed: ${health.message}`);
  }
  console.log("✓ Health check passed");

  // Test 2: Search returns valid items
  const results = await source.search({ limit: 5 });
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Expected search to return array of raw opportunities");
  }

  // Test 3: Required fields exist
  for (const item of results) {
    if (!item.title || !item.sourceUrl || !item.sourceName) {
      throw new Error(`Item missing required fields: ${JSON.stringify(item)}`);
    }
  }
  console.log("✓ Opportunity format validation passed");

  console.log("All source tests completed successfully!");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
