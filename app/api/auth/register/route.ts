import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      targetRoles,
      seniorityLevel,
      workModel,
      preferredLocations,
      openToRelocate,
      currency,
      minHourlyPay,
      minMonthlyPay,
      skills,
      cvFileName,
      emailAlertsEnabled,
    } = body;

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { message: "A valid email and an 8+ character password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // Secure password hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and profile in a single atomic transaction
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email: normalizedEmail,
        password: hashedPassword,
        profile: {
          create: {
            targetRoles: Array.isArray(targetRoles) ? targetRoles : [],
            seniorityLevel: seniorityLevel || "Mid-level",
            workModel: workModel || "Remote",
            preferredLocations: Array.isArray(preferredLocations) ? preferredLocations : [],
            openToRelocate: Boolean(openToRelocate),
            currency: currency || "USD",
            minHourlyPay: Number(minHourlyPay) || 0,
            minMonthlyPay: Number(minMonthlyPay) || 0,
            skills: Array.isArray(skills) ? skills : [],
            cvFileName: cvFileName || null,
            emailAlertsEnabled: Boolean(emailAlertsEnabled),
            alertFrequency: "instant",
            smsAlertsEnabled: false,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during account creation. Please try again." },
      { status: 500 }
    );
  }
}
