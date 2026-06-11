import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteInfo } from "@/lib/data";
import { contactSchema } from "@/lib/validations";

const inquiryLabels = {
  general: "General inquiry",
  purchase: "Purchase inquiry",
  class: "Class inquiry",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL ?? (await getSiteInfo()).email;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Email is not configured yet. Set RESEND_API_KEY and CONTACT_EMAIL in your environment.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const inquiryLabel = inquiryLabels[data.type];
    const subject =
      data.subject?.trim() ||
      `${inquiryLabel} from ${data.name}`.slice(0, 120);

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Barn Owl Pottery <onboarding@resend.dev>",
      to: contactEmail,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
