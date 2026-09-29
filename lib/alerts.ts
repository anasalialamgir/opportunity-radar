import { prisma } from "@/lib/prisma";
import { sendMail, mailConfigured } from "@/lib/mailer";
import { scanForUser } from "@/lib/discovery/scan";

export function alertMatches(keyword: string, title: string, description: string): boolean {
  if (keyword === "*") return true;
  return `${title} ${description}`.toLowerCase().includes(keyword.toLowerCase());
}

export async function runAlertCycle() {
  if (!mailConfigured()) throw new Error("Email delivery is not configured.");
  const users = await prisma.user.findMany({ where: { emailVerified: { not: null }, alertRules: { some: { enabled: true } } }, include: { alertRules: { where: { enabled: true } } } });
  let sent = 0, errors = 0;
  for (const user of users) {
    if (!user.email || !user.alertRules.length) continue;
    try {
      await scanForUser(user.id);
      const matches = await prisma.opportunityMatch.findMany({ where: { userId: user.id, matchScore: { gt: 0 }, opportunity: { source: { in: ["Remotive", "Jobicy", "GitHub bounty"] }, publishedAt: { gte: new Date(Date.now() - 30 * 86400000) } } }, include: { opportunity: true }, orderBy: { matchScore: "desc" }, take: 100 });
      const already = await prisma.alertDelivery.findMany({ where: { userId: user.id, opportunityId: { in: matches.map(m => m.opportunityId) } }, select: { opportunityId: true } });
      const delivered = new Set(already.map(d => d.opportunityId));
      const selected = matches.filter(m => !delivered.has(m.opportunityId) && user.alertRules.some(rule => m.matchScore >= rule.minimumScore && alertMatches(rule.keyword, m.opportunity.title, m.opportunity.description))).slice(0, 10);
      if (!selected.length) continue;
      // Claim first so overlapping scheduler runs cannot send the same listing twice.
      const claimed: string[] = [];
      for (const match of selected) {
        try { await prisma.alertDelivery.create({ data: { userId: user.id, opportunityId: match.opportunityId } }); claimed.push(match.opportunityId); }
        catch (error: any) { if (error?.code !== "P2002") throw error; }
      }
      if (!claimed.length) continue;
      const ready = selected.filter(m => claimed.includes(m.opportunityId));
      const text = ready.map(m => `${m.matchScore}% fit · ${m.opportunity.title}\n${m.opportunity.company || "Company unstated"} · ${m.opportunity.location || "Location unstated"}\n${m.opportunity.sourceUrl}`).join("\n\n");
      try {
        await sendMail(user.email, `${ready.length} new Opportunity Radar match${ready.length === 1 ? "" : "es"}`, `New matches based on your alert rules:\n\n${text}\n\nReview each original listing for eligibility and availability. Manage alerts: ${process.env.NEXTAUTH_URL}/alerts`);
        try { await prisma.notification.create({ data: { userId: user.id, title: "New matches", content: text, channel: "email" } }); }
        catch (error) { console.error("Email sent but notification log failed", user.id, error); }
        sent++;
      } catch (error) {
        await prisma.alertDelivery.deleteMany({ where: { userId: user.id, opportunityId: { in: claimed } } });
        throw error;
      }
    } catch (error) { errors++; console.error("Alert cycle failed for user", user.id, error); }
  }
  return { users: users.length, sent, errors };
}
