import nodemailer from "nodemailer";

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
  // Configured via standard SMTP environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "apikey",
      pass: process.env.SMTP_PASS || process.env.RESEND_API_KEY || "",
    },
  });

  const subject = `[Opportunity Radar] Verified Match: ${payload.jobTitle} at ${payload.company}`;
  const textBody = `A new high-match opportunity has been verified on Opportunity Radar:\n\nRole: ${payload.jobTitle}\nCompany: ${payload.company}\nCompensation: ${payload.compensation}\nApply here: ${payload.url}`;

  // 1. Send Email Notification
  if (payload.toEmail) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "alerts@opportunityradar.app",
        to: payload.toEmail,
        subject,
        text: textBody,
      });
    } catch (err) {
      console.error("Failed to send email alert:", err);
    }
  }

  // 2. Deliver Free Carrier SMS (Zero Cost Open-Source Solution)
  if (payload.smsConfig?.phoneNumber && payload.smsConfig?.gatewayDomain) {
    const cleanNumber = payload.smsConfig.phoneNumber.replace(/\D/g, "");
    const smsEmailRecipient = `${cleanNumber}@${payload.smsConfig.gatewayDomain}`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "alerts@opportunityradar.app",
        to: smsEmailRecipient,
        subject: "New Job Match",
        text: `Opportunity Radar: ${payload.jobTitle} at ${payload.company} (${payload.compensation}). Link: ${payload.url}`,
      });
    } catch (smsErr) {
      console.error("Failed to deliver carrier SMS alert:", smsErr);
    }
  }
}
