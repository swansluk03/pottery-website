import { Resend } from "resend";

const inquiryLabels = {
  general: "General inquiry",
  purchase: "Purchase inquiry",
  class: "Class inquiry",
} as const;

export type ContactInquiryType = keyof typeof inquiryLabels;

export type ContactEmailInput = {
  name: string;
  email: string;
  type: ContactInquiryType;
  subject?: string;
  message: string;
};

export function getInquiryLabel(type: ContactInquiryType) {
  return inquiryLabels[type];
}

export function getResendApiKey() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return apiKey || null;
}

export function isTestSender(fromAddress: string) {
  return fromAddress.includes("@resend.dev");
}

export async function sendContactEmail(
  data: ContactEmailInput,
  options: { to: string; from: string }
) {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    return {
      ok: false as const,
      status: 503,
      error:
        "Email is not configured yet. Set RESEND_API_KEY in your environment.",
    };
  }

  const resend = new Resend(apiKey);
  const inquiryLabel = getInquiryLabel(data.type);
  const subject =
    data.subject?.trim() ||
    `${inquiryLabel} from ${data.name}`.slice(0, 120);

  const { data: result, error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    replyTo: data.email,
    subject,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Type: ${inquiryLabel}`,
      "",
      data.message,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend contact email failed:", error);

    return {
      ok: false as const,
      status: 502,
      error:
        "Unable to send your message right now. Please try again later or email us directly.",
    };
  }

  return { ok: true as const, id: result?.id };
}
