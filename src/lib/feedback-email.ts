import { SUPPORT_EMAIL } from "@/lib/constants";

type FeedbackEmailParams = {
  message: string;
  locale: string;
  fingerprint: string;
  ip: string;
  pageUrl?: string;
};

export async function sendFeedbackEmail(params: FeedbackEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.log("[feedback] RESEND_API_KEY not set — email skipped, stored in Firestore only");
    return false;
  }

  const from =
    process.env.FEEDBACK_FROM_EMAIL?.trim() || "Signature Swipe <onboarding@resend.dev>";

  const body = [
    "Landing page feedback — missing info prompt",
    "",
    `Message: ${params.message || "(empty)"}`,
    `Locale: ${params.locale}`,
    `Fingerprint: ${params.fingerprint}`,
    `IP: ${params.ip}`,
    params.pageUrl ? `Page: ${params.pageUrl}` : "",
    `Time: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [SUPPORT_EMAIL],
        subject: "Landing feedback — missing info",
        text: body,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.log("[feedback] Resend error:", response.status, errText);
      return false;
    }

    return true;
  } catch (error) {
    console.log("[feedback] Resend request failed:", error);
    return false;
  }
}
