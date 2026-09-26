import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { opportunityId, userEmail, action, status } = await req.json();

    if (!opportunityId || !userEmail) {
      return NextResponse.json({ error: "opportunityId and userEmail are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "save") {
      await prisma.savedOpportunity.upsert({
        where: {
          userId_opportunityId: { userId: user.id, opportunityId },
        },
        update: { dismissed: false },
        create: { userId: user.id, opportunityId, dismissed: false },
      });
      return NextResponse.json({ success: true, message: "Saved" });
    }

    if (action === "dismiss") {
      await prisma.savedOpportunity.upsert({
        where: {
          userId_opportunityId: { userId: user.id, opportunityId },
        },
        update: { dismissed: true },
        create: { userId: user.id, opportunityId, dismissed: true },
      });
      return NextResponse.json({ success: true, message: "Dismissed" });
    }

    if (action === "applied") {
      await prisma.application.upsert({
        where: {
          userId_opportunityId: { userId: user.id, opportunityId },
        },
        update: { status: status || "Applied", appliedAt: new Date() },
        create: { userId: user.id, opportunityId, status: status || "Applied", appliedAt: new Date() },
      });
      return NextResponse.json({ success: true, message: "Marked as Applied" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
