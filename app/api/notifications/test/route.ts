import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ error: "Notifications are not configured." }, { status: 501 }); }
