import { NextResponse } from "next/server";
import { parseCVContent } from "@/lib/ai/cv-parser";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, rawText } = await req.json();

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: "CV text cannot be empty." }, { status: 400 });
    }

    // Parse CV through AI Provider abstraction
    const parsedData = await parseCVContent(rawText);

    // If an email was provided, store or link to the user profile
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });

      if (user?.profile) {
        const profileId = user.profile.id;

        // Save raw text
        await prisma.profile.update({
          where: { id: profileId },
          data: { rawCvText: rawText },
        });

        // Add skills
        const allSkills = [
          ...parsedData.skills.technical,
          ...parsedData.skills.soft,
          ...parsedData.skills.domain,
        ];

        for (const skillName of allSkills) {
          await prisma.skill.create({
            data: {
              profileId,
              name: skillName,
              category: parsedData.skills.technical.includes(skillName) ? "technical" : "soft",
            },
          });
        }

        // Add experiences
        for (const exp of parsedData.experience) {
          await prisma.experience.create({
            data: {
              profileId,
              title: exp.title,
              company: exp.company || null,
              years: exp.years || null,
              summary: exp.summary || null,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to parse CV" }, { status: 500 });
  }
}
