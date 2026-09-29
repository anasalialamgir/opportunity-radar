import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const origin = "http://localhost:3000";
const cookies = new Map();
async function request(path, options = {}) {
  const response = await fetch(origin + path, { ...options, redirect: "manual", headers: { ...options.headers, Cookie: [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ") } });
  const setCookies = response.headers.getSetCookie?.() || [];
  for (const cookie of setCookies) {
    const [name, value] = cookie.split(";", 1)[0].split("=");
    if (name) cookies.set(name, value || "");
  }
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: response.status, data };
}
const json = (value) => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
const email = `smoke-${Date.now()}@example.test`, password = "Integration-test-password-123!";
const prisma = new PrismaClient();
async function mailedToken(subject, route) {
  for (let attempt = 0; attempt < 40; attempt++) {
    let messages = [];
    try { messages = readFileSync(process.env.SMOKE_MAIL_FILE || "/tmp/radar-smtp.jsonl", "utf8").trim().split("\n").filter(Boolean).map(JSON.parse); } catch { /* SMTP sink may be starting */ }
    const message = messages.find(item => item.subject === subject);
    const token = message?.text?.match(new RegExp(`${route}\\?token=([a-f0-9]{64})`))?.[1];
    if (token) return token;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`No ${subject} message received`);
}
try {
  const health = await request("/api/health"); assert.equal(health.status, 200);
  const signup = await request("/api/signup", { method: "POST", ...json({ name: "Smoke Tester", email, password }) }); assert.equal(signup.status, 201, JSON.stringify(signup));
  assert.equal(signup.data.emailSent, true);
  const verifyToken = await mailedToken("Verify your Opportunity Radar email", "verify-email");
  const verified = await request("/api/account/verify", { method: "POST", ...json({ token: verifyToken }) }); assert.equal(verified.status, 200);
  const reusedVerification = await request("/api/account/verify", { method: "POST", ...json({ token: verifyToken }) }); assert.equal(reusedVerification.status, 400);
  const csrf = await request("/api/auth/csrf"); assert.equal(csrf.status, 200); assert.ok(csrf.data.csrfToken);
  const form = new URLSearchParams({ csrfToken: csrf.data.csrfToken, email, password, json: "true" });
  const login = await request("/api/auth/callback/credentials", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form.toString() });
  assert.ok(login.status === 200 || login.status === 302, JSON.stringify(login));
  const profile = await request("/api/profile"); assert.equal(profile.data.user.email, email);
  assert.equal(profile.data.user.emailVerified, true);
  const saved = await request("/api/profile", { method: "POST", ...json({ name: "Smoke Tester", country: "Pakistan", locationPreference: "remote", targetRoles: ["Regulatory Affairs Specialist"], skills: ["Regulatory Affairs", "Dossier Preparation"], capabilities: [], languages: ["English"] }) }); assert.equal(saved.status, 200, JSON.stringify(saved));
  const opp = await prisma.opportunity.create({ data: { title: "Remote Regulatory Affairs Specialist", description: "Regulatory Affairs and Dossier Preparation for a global medical products team.", category: "job", source: "Jobicy", sourceUrl: `https://jobicy.com/jobs/smoke-${Date.now()}`, company: "Integration Test", location: "Worldwide", remote: true, publishedAt: new Date() } });
  const match = await request("/api/match", { method: "POST" }); assert.equal(match.status, 200, JSON.stringify(match)); assert.ok(match.data.matches.some(item => item.opportunityId === opp.id && item.matchScore > 50));
  const jobs = await request("/api/opportunities"); assert.equal(jobs.status, 200); assert.ok(jobs.data.opportunities.some(item => item.id === opp.id));
  const save = await request("/api/opportunities/status", { method: "POST", ...json({ opportunityId: opp.id, action: "save" }) }); assert.equal(save.status, 200);
  const pipeline = await request("/api/opportunities/status"); assert.ok(pipeline.data.items.some(item => item.id === opp.id));
  const alert = await request("/api/alerts", { method: "POST", ...json({ keyword: "Regulatory", minimumScore: 50 }) }); assert.equal(alert.status, 201, JSON.stringify(alert));
  const alerts = await request("/api/alerts"); assert.ok(alerts.data.alerts.some(item => item.id === alert.data.alert.id));
  const paused = await request(`/api/alerts/${alert.data.alert.id}`, { method: "PATCH", ...json({ enabled: false }) }); assert.equal(paused.status, 200);
  const unauthorizedCron = await request("/api/cron/scan", { method: "POST" }); assert.equal(unauthorizedCron.status, 401);
  const exportResult = await request("/api/account/data"); assert.equal(exportResult.data.email, email);
  const resetRequest = await request("/api/account/request-reset", { method: "POST", ...json({ email }) }); assert.equal(resetRequest.status, 200);
  const resetToken = await mailedToken("Reset your Opportunity Radar password", "reset-password");
  const newPassword = "Changed-integration-password-123!";
  const reset = await request("/api/account/reset", { method: "POST", ...json({ token: resetToken, password: newPassword }) }); assert.equal(reset.status, 200);
  const reusedReset = await request("/api/account/reset", { method: "POST", ...json({ token: resetToken, password: newPassword }) }); assert.equal(reusedReset.status, 400);
  const revoked = await request("/api/profile"); assert.equal(revoked.status, 401);
  cookies.clear();
  const newCsrf = await request("/api/auth/csrf");
  const newForm = new URLSearchParams({ csrfToken: newCsrf.data.csrfToken, email, password: newPassword, json: "true" });
  const newLogin = await request("/api/auth/callback/credentials", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: newForm.toString() });
  assert.ok(newLogin.status === 200 || newLogin.status === 302, JSON.stringify(newLogin));
  const restored = await request("/api/profile"); assert.equal(restored.data.user.email, email);
  const deleted = await request("/api/account/data", { method: "DELETE", ...json({ password: newPassword }) }); assert.equal(deleted.status, 200);
  const after = await request("/api/profile"); assert.equal(after.status, 401);
  console.log("Database-backed verification, reset, account, matching, pipeline, alert and deletion smoke flow passed.");
} finally { await prisma.$disconnect(); }
