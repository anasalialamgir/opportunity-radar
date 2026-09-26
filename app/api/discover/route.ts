import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const workType = searchParams.get("workType") || ""; // Remote, Hybrid, Onsite
  const location = searchParams.get("location")?.toLowerCase() || "";
  const minMonthlyPay = Number(searchParams.get("minMonthlyPay")) || 0;
  const minHourlyPay = Number(searchParams.get("minHourlyPay")) || 0;

  // Retrieve base opportunities
  let opportunities = await prisma.opportunity.findMany({
    orderBy: { postedDate: "desc" },
    take: 50,
  });

  // Fallback demo dataset with verified statuses if database is initially empty
  if (opportunities.length === 0) {
    opportunities = [
      {
        id: "opp-1",
        title: "Senior Full-Stack Engineer",
        company: "RemoteTech Solutions",
        location: "Global / Remote",
        workType: "Remote",
        compensation: "$120,000 - $145,000 / yr",
        minHourlyPay: 60,
        minMonthlyPay: 10000,
        currency: "USD",
        description: "Looking for an experienced Next.js and TypeScript developer. Full remote setup.",
        url: "https://remotetech.example.com/careers/fullstack",
        source: "Company Verified Career Portal",
        isVerified: true,
        matchScore: 94,
        tags: ["TypeScript", "Next.js", "React", "PostgreSQL"],
        postedDate: new Date(),
        createdAt: new Date(),
      },
      {
        id: "opp-2",
        title: "Growth Marketing Specialist",
        company: "VenturePulse",
        location: "London, UK",
        workType: "Hybrid",
        compensation: "£4,500 - £6,000 / mo",
        minHourlyPay: 35,
        minMonthlyPay: 4500,
        currency: "GBP",
        description: "Manage multi-channel growth campaigns and conversion rate optimization.",
        url: "https://venturepulse.example.com/jobs/marketing",
        source: "Verified Direct Employer",
        isVerified: true,
        matchScore: 88,
        tags: ["SEO", "Content Marketing", "Analytics"],
        postedDate: new Date(),
        createdAt: new Date(),
      },
      {
        id: "opp-3",
        title: "Lead UI/UX Product Designer",
        company: "DesignCore Studio",
        location: "New York, NY",
        workType: "Onsite",
        compensation: "$110,000 - $130,000 / yr",
        minHourlyPay: 55,
        minMonthlyPay: 9200,
        currency: "USD",
        description: "Lead product design initiatives across mobile and web interfaces.",
        url: "https://designcore.example.com/jobs/uiux",
        source: "Verified Direct Employer",
        isVerified: true,
        matchScore: 82,
        tags: ["Figma", "Design Systems", "Prototyping"],
        postedDate: new Date(),
        createdAt: new Date(),
      }
    ];
  }

  // Filter based on user preference and validity
  const filtered = opportunities.filter((job) => {
    // 1. Source & Validity verification: must have valid URL and be marked verified
    if (!job.isVerified || !job.url.startsWith("http")) return false;

    // 2. Work Type filter
    if (workType && workType !== "All" && job.workType.toLowerCase() !== workType.toLowerCase()) {
      return false;
    }

    // 3. Location filter
    if (location && !job.location.toLowerCase().includes(location)) {
      return false;
    }

    // 4. Pay requirements check
    if (minMonthlyPay > 0 && job.minMonthlyPay && job.minMonthlyPay < minMonthlyPay) {
      return false;
    }
    if (minHourlyPay > 0 && job.minHourlyPay && job.minHourlyPay < minHourlyPay) {
      return false;
    }

    // 5. Query matching
    if (query) {
      const matchTitle = job.title.toLowerCase().includes(query);
      const matchCompany = job.company.toLowerCase().includes(query);
      const matchTags = job.tags.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchCompany && !matchTags) return false;
    }

    return true;
  });

  return NextResponse.json({ opportunities: filtered, total: filtered.length });
}
