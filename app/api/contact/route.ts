import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSiteInfo } from "@/lib/data";
import { sendContactEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const contactEmail = process.env.CONTACT_EMAIL ?? (await getSiteInfo()).email;
    const fromAddress =
      process.env.EMAIL_FROM ?? "Barn Owl Pottery <onboarding@resend.dev>";

    const result = await sendContactEmail(data, {
      to: contactEmail,
      from: fromAddress,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    console.error("Contact form failed:", error);

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
