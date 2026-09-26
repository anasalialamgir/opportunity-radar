import { NextResponse } from "next/server";
import { notificationRegistry } from "@/notifications/registry";
import { TelegramNotificationProvider } from "@/notifications/telegram/adapter";

// Register Telegram adapter
notificationRegistry.register(new TelegramNotificationProvider());

export async function POST(req: Request) {
  try {
    const { channel, recipient, matches } = await req.json();

    const result = await notificationRegistry.sendToAll([channel || "telegram"], {
      recipientId: recipient || "test_channel",
      title: "New Radar Matches Available",
      message: "Here are the top matches discovered based on your capabilities.",
      matches: matches || [
        {
          id: "test-1",
          title: "Remote Content & Video Editor",
          matchScore: 94,
          compensation: "$200 - $400",
          sourceUrl: "https://example.com/item/1",
        },
      ],
    });

    return NextResponse.json({ success: true, results: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
