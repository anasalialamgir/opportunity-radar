import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      email,
      name,
      country,
      timeZone,
      locationPreference,
      hoursPerWeek,
      targetMonthlyIncome,
      minimumCompensation,
      currency,
      employmentPreferences,
      languages,
      capabilities, // strings from "What else can you do?"
      skills,       // array of skill names
    } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name || undefined },
      create: { email, name: name || "Explorer" },
    });

    // Upsert Profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        country,
        timeZone,
        locationPreference,
        hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : undefined,
        targetMonthlyIncome: targetMonthlyIncome ? parseFloat(targetMonthlyIncome) : undefined,
        minimumCompensation: minimumCompensation ? parseFloat(minimumCompensation) : undefined,
        currency: currency || "USD",
        employmentPreferences: employmentPreferences || [],
        languages: languages || [],
      },
      create: {
        userId: user.id,
        country,
        timeZone,
        locationPreference,
        hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : 40,
        targetMonthlyIncome: targetMonthlyIncome ? parseFloat(targetMonthlyIncome) : null,
        minimumCompensation: minimumCompensation ? parseFloat(minimumCompensation) : null,
        currency: currency || "USD",
        employmentPreferences: employmentPreferences || [],
        languages: languages || [],
      },
    });

    // Add user capabilities ("What else can you do?")
    if (Array.isArray(capabilities) && capabilities.length > 0) {
      await prisma.userCapability.deleteMany({ where: { profileId: profile.id } });
      await prisma.userCapability.createMany({
        data: capabilities
          .filter((c: string) => c.trim().length > 0)
          .map((c: string) => ({
            profileId: profile.id,
            description: c.trim(),
          })),
      });
    }

    // Add basic skills if provided
    if (Array.isArray(skills) && skills.length > 0) {
      await prisma.skill.deleteMany({ where: { profileId: profile.id } });
      await prisma.skill.createMany({
        data: skills
          .filter((s: string) => s.trim().length > 0)
          .map((s: string) => ({
            profileId: profile.id,
            name: s.trim(),
          })),
      });
    }

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
