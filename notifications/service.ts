// Uses native web fetch built into Node.js / Next.js (Zero external npm packages required)

interface AlertPayload {
  toEmail: string;
  smsConfig?: {
    phoneNumber?: string;
    gatewayDomain?: string;
  };
  jobTitle: string;
  company: string;
  compensation: string;
  url: string;
}

export async function dispatchOpportunityAlert(payload: AlertPayload) {
  const subject = `[Opportunity Radar] Verified Match: ${payload.jobTitle} at ${payload.company}`;
  const textBody = `A new high-match opportunity has been verified on Opportunity Radar:\n\nRole: ${payload.jobTitle}\nCompany: ${payload.company}\nCompensation: ${payload.compensation}\nApply here: ${payload.url}`;

  // 1. Send Email Notification via standard REST API (e.g., Resend, Brevo, or SMTP Relay)
  if (process.env.RESEND_API_KEY && payload.toEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "alerts@resend.dev",
          to: payload.toEmail,
          subject,
          text: textBody,
        }),
      });
    } catch (err) {
      console.error("Failed to send email alert via REST API:", err);
    }
  }

  // 2. Free Open-Source Carrier SMS / Push Notification Delivery
  if (payload.smsConfig?.phoneNumber) {
    const cleanNumber = payload.smsConfig.phoneNumber.replace(/\D/g, "");
    const domain = payload.smsConfig.gatewayDomain || "vtext.com";
    const carrierAddress = `${cleanNumber}@${domain}`;

    // If an email-to-SMS gateway or webhook is used:
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "alerts@resend.dev",
            to: carrierAddress,
            subject: "Job Match",
            text: `Radar Alert: ${payload.jobTitle} at ${payload.company} (${payload.compensation}). Link: ${payload.url}`,
          }),
        });
      } catch (smsErr) {
        console.error("Failed to dispatch free SMS gateway notification:", smsErr);
      }
    }
  }
}
