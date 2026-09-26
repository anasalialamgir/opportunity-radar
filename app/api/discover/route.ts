import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // Retrieve user's profile to match against
  let userProfile = null;
  if (userId) {
    userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  // Base list of verified opportunities
  const opportunities = [
    {
      id: "opp-1",
      title: "Senior Full-Stack Engineer (Next.js & React)",
      company: "CloudScale Systems",
      location: "Worldwide / Remote",
      workType: "Remote",
      compensation: "$125,000 - $150,000 / yr",
      minHourlyPay: 60,
      minMonthlyPay: 10400,
      description: "Looking for an engineer proficient in React, Next.js, TypeScript, Node.js and Tailwind.",
      url: "https://cloudscale.example.com/careers/nextjs-dev",
      source: "Verified Direct Employer",
      isVerified: true,
      tags: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    },
    {
      id: "opp-2",
      title: "Frontend Developer (UI/UX Focused)",
      company: "ModernCraft Labs",
      location: "Remote / US & Europe",
      workType: "Remote",
      compensation: "$95,000 - $120,000 / yr",
      minHourlyPay: 50,
      minMonthlyPay: 8500,
      description: "Frontend developer focused on building interactive web applications with React and Tailwind.",
      url: "https://moderncraft.example.com/jobs/frontend",
      source: "Company Career Portal",
      isVerified: true,
      tags: ["React", "TypeScript", "Tailwind", "Figma"],
    },
    {
      id: "opp-3",
      title: "Senior Product Designer",
      company: "Nova Studios",
      location: "London, UK (Hybrid)",
      workType: "Hybrid",
      compensation: "£70,000 - £85,000 / yr",
      minHourlyPay: 45,
      minMonthlyPay: 6000,
      description: "Design consumer-facing products with Figma and design systems.",
      url: "https://nova.example.com/careers/designer",
      source: "Verified Direct Employer",
      isVerified: true,
      tags: ["Figma", "UI/UX Designer", "Design Systems"],
    },
  ];

  // Smart Matching Computation
  const scoredJobs = opportunities.map((job) => {
    let score = 20; // baseline
    const matchedSkills: string[] = [];

    if (userProfile) {
      const targetRoles = (userProfile.targetRoles || []).map((r: string) => r.toLowerCase());
      const jobTitle = job.title.toLowerCase();

      // 1. Role Match (up to 40 pts)
      for (const role of targetRoles) {
        if (role && (jobTitle.includes(role) || role.includes(jobTitle))) {
          score += 40;
          break;
        }
      }

      // 2. Skills Match (up to 30 pts)
      const userSkills = (userProfile.skills || []).map((s: string) => s.toLowerCase());
      const jobTags = job.tags.map((t) => t.toLowerCase());

      userSkills.forEach((skill: string) => {
        if (jobTags.some((tag) => tag.includes(skill) || skill.includes(tag))) {
          matchedSkills.push(skill);
        }
      });

      if (userSkills.length > 0) {
        score += Math.min(30, (matchedSkills.length / userSkills.length) * 30);
      }

      // 3. Work Setup Match (up to 20 pts)
      const userModel = (userProfile.workModel || "Remote").toLowerCase();
      if (userModel === "any" || userModel === job.workType.toLowerCase()) {
        score += 20;
      }
    } else {
      score = 75; // default fallback match score for guest view
    }

    return {
      ...job,
      matchScore: Math.min(99, Math.round(score)),
      matchedSkills,
    };
  });

  // Sort with highest matching opportunities first
  scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json({ opportunities: scoredJobs });
}
