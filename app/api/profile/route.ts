import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";

const list = (value: unknown) => Array.isArray(value) ? value.filter((s): s is string => typeof s === "string" && !!s.trim()).map(s => s.trim().slice(0, 150)).slice(0, 80) : [];
const num = (value: unknown) => value === "" || value == null ? null : Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null;
export async function GET() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id }, include: { profile: { include: { skills: true, experiences: true, userCapabilities: true } } } });
  return NextResponse.json({ user: { name: user?.name, email: user?.email }, profile: user?.profile });
}
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const data = await req.json();
    const profile = await prisma.$transaction(async tx => {
      if (typeof data.name === "string") await tx.user.update({ where: { id: userId }, data: { name: data.name.trim().slice(0, 120) } });
      const p = await tx.profile.upsert({ where: { userId }, create: { userId }, update: {} });
      await tx.profile.update({ where: { id: p.id }, data: {
        country: typeof data.country === "string" ? data.country.slice(0, 100) : undefined,
        timeZone: typeof data.timeZone === "string" ? data.timeZone.slice(0, 100) : undefined,
        locationPreference: ["remote", "hybrid", "local", "any"].includes(data.locationPreference) ? data.locationPreference : "any",
        hoursPerWeek: num(data.hoursPerWeek), targetMonthlyIncome: num(data.targetMonthlyIncome), minimumCompensation: num(data.minimumCompensation),
        currency: typeof data.currency === "string" ? data.currency.slice(0, 3).toUpperCase() : "USD",
        employmentPreferences: list(data.employmentPreferences), targetRoles: list(data.targetRoles), languages: list(data.languages),
      } });
      if (Array.isArray(data.capabilities)) {
        await tx.userCapability.deleteMany({ where: { profileId: p.id } });
        if (list(data.capabilities).length) await tx.userCapability.createMany({ data: list(data.capabilities).map(description => ({ profileId: p.id, description })) });
      }
      if (Array.isArray(data.skills)) {
        await tx.skill.deleteMany({ where: { profileId: p.id } });
        if (list(data.skills).length) await tx.skill.createMany({ data: list(data.skills).map(name => ({ profileId: p.id, name })) });
      }
      await tx.opportunityMatch.deleteMany({ where: { userId } });
      return p;
    });
    return NextResponse.json({ success: true, profileId: profile.id });
  } catch { return NextResponse.json({ error: "Could not save profile." }, { status: 400 }); }
}
