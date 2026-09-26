import { NotificationProvider, NotificationPayload } from "../types";

export class TelegramNotificationProvider implements NotificationProvider {
  channel: "telegram" = "telegram";
  private botToken?: string;

  constructor(botToken?: string) {
    this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
  }

  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    if (!this.botToken) {
      console.log(`[Telegram Notification Sim] To: ${payload.recipientId} | Message: ${payload.title}`);
      return { success: true };
    }

    const textLines = [
      `🚀 *Opportunity Radar Alert*`,
      `*${payload.title}*`,
      payload.message,
      "",
      ...payload.matches.map(
        (m) => `⭐ *${m.matchScore}% Match* — ${m.title}\n💵 ${m.compensation || "Flexible"}\n🔗 [View Listing](${m.sourceUrl})`
      ),
    ];

    try {
      const res = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: payload.recipientId,
          text: textLines.join("\n\n"),
          parse_mode: "Markdown",
        }),
      });

      const data = await res.json();
      return { success: data.ok, error: data.description };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
