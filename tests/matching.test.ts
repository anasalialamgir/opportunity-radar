import { test } from "node:test";
import { strict as assert } from "node:assert";
import { computeOpportunityMatch } from "../lib/ai/matching";
const python = { skills: ["Python", "SQL", "Data Analysis"], capabilities: [], experienceTitles: ["Data Analyst"], country: "Pakistan", locationPreference: "remote" };
test("relevant role ranks above an unrelated listing", () => {
  const relevant = computeOpportunityMatch({ id: "a", title: "Remote Data Analyst", description: "Python SQL Data Analysis", remote: true, location: "Worldwide" }, python);
  const unrelated = computeOpportunityMatch({ id: "b", title: "Senior Graphic Designer", description: "Figma and print design", remote: true, location: "Worldwide" }, python);
  assert.ok(relevant.score >= 70, JSON.stringify(relevant));
  assert.ok(relevant.score > unrelated.score + 50);
  assert.ok(unrelated.score < 20);
});
test("no CV means no invented fit", () => {
  const result = computeOpportunityMatch({ id: "a", title: "Python Developer", description: "Python", remote: true }, { skills: [], capabilities: [] });
  assert.equal(result.score, 0);
});
test("location eligibility and remote preference reduce score", () => {
  const base = { id: "a", title: "Data Analyst", description: "SQL", remote: true, location: "Worldwide" };
  const worldwide = computeOpportunityMatch(base, python);
  const restricted = computeOpportunityMatch({ ...base, location: "US only" }, python);
  const onsite = computeOpportunityMatch({ ...base, remote: false }, python);
  assert.ok(worldwide.score > restricted.score && restricted.score > onsite.score);
  assert.ok(restricted.concerns.some(s => s.includes("eligibility")));
});
test("a stated career goal influences ordering", () => {
  const seeker = { skills: ["Research"], capabilities: [], targetRoles: ["Regulatory Affairs Specialist"] };
  const target = computeOpportunityMatch({ id: "a", title: "Regulatory Affairs Specialist", description: "Regulatory submissions", remote: true }, seeker);
  const other = computeOpportunityMatch({ id: "b", title: "Marketing Specialist", description: "Research campaigns", remote: true }, seeker);
  assert.ok(target.score > other.score);
  assert.ok(target.reasons.some(r => r.includes("target role")));
});
