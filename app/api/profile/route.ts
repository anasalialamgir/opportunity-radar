import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const data = await request.json();

  const updatedProfile = await prisma.userProfile.upsert({
    where: { userId },
    update: {
      targetRoles: Array.isArray(data.targetRoles) ? data.targetRoles : [],
      seniorityLevel: data.seniorityLevel || "Mid-level",
      workModel: data.workModel || "Remote",
      preferredLocations: Array.isArray(data.preferredLocations) ? data.preferredLocations : [],
      openToRelocate: Boolean(data.openToRelocate),
      currency: data.currency || "USD",
      minHourlyPay: Number(data.minHourlyPay) || 0,
      minMonthlyPay: Number(data.minMonthlyPay) || 0,
      skills: Array.isArray(data.skills) ? data.skills : [],
      rawCvText: data.rawCvText || null,
      cvFileName: data.cvFileName || null,
      emailAlertsEnabled: Boolean(data.emailAlertsEnabled),
      alertFrequency: data.alertFrequency || "instant",
      smsAlertsEnabled: Boolean(data.smsAlertsEnabled),
      phoneNumber: data.phoneNumber || null,
      carrierGatewayDomain: data.carrierGatewayDomain || null,
    },
    create: {
      userId,
      targetRoles: Array.isArray(data.targetRoles) ? data.targetRoles : [],
      seniorityLevel: data.seniorityLevel || "Mid-level",
      workModel: data.workModel || "Remote",
      preferredLocations: Array.isArray(data.preferredLocations) ? data.preferredLocations : [],
      openToRelocate: Boolean(data.openToRelocate),
      currency: data.currency || "USD",
      minHourlyPay: Number(data.minHourlyPay) || 0,
      minMonthlyPay: Number(data.minMonthlyPay) || 0,
      skills: Array.isArray(data.skills) ? data.skills : [],
      rawCvText: data.rawCvText || null,
      cvFileName: data.cvFileName || null,
      emailAlertsEnabled: Boolean(data.emailAlertsEnabled),
      alertFrequency: data.alertFrequency || "instant",
      smsAlertsEnabled: Boolean(data.smsAlertsEnabled),
      phoneNumber: data.phoneNumber || null,
      carrierGatewayDomain: data.carrierGatewayDomain || null,
    },
  });

  return NextResponse.json({ success: true, profile: updatedProfile });
}
