export interface OpportunityDigestItem {
  id: string;
  title: string;
  company?: string;
  matchScore: number;
  compensation?: string;
  sourceUrl: string;
}

export interface NotificationPayload {
  recipientId: string; // Email address, Telegram chat ID, or webhook
  recipientName?: string;
  title: string;
  message: string;
  matches: OpportunityDigestItem[];
}

export interface NotificationProvider {
  channel: "email" | "telegram" | "discord" | "webhook";
  send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }>;
}
