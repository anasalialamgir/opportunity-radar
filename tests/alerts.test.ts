import { test } from "node:test";
import { strict as assert } from "node:assert";
import { alertMatches } from "../lib/alerts";
import { tokenHash } from "../lib/account-tokens";
test("alert keywords are case-insensitive and wildcard covers all", () => {
  assert.equal(alertMatches("regulatory affairs", "Senior Regulatory Affairs Officer", "Submissions"), true);
  assert.equal(alertMatches("designer", "Regulatory Officer", "Submissions"), false);
  assert.equal(alertMatches("*", "Any role", ""), true);
});
test("only a token hash is stored", () => {
  assert.equal(tokenHash("a").length, 64);
  assert.notEqual(tokenHash("a"), tokenHash("b"));
});
