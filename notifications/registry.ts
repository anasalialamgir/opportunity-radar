import { NotificationProvider, NotificationPayload } from "./types";

class NotificationRegistry {
  private providers: Map<string, NotificationProvider> = new Map();

  register(provider: NotificationProvider) {
    this.providers.set(provider.channel, provider);
  }

  get(channel: string): NotificationProvider | undefined {
    return this.providers.get(channel);
  }

  async sendToAll(channels: string[], payload: NotificationPayload) {
    const results = [];
    for (const ch of channels) {
      const provider = this.providers.get(ch);
      if (provider) {
        try {
          const res = await provider.send(payload);
          results.push({ channel: ch, ...res });
        } catch (err: any) {
          results.push({ channel: ch, success: false, error: err.message });
        }
      }
    }
    return results;
  }
}

export const notificationRegistry = new NotificationRegistry();
