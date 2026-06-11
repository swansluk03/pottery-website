import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapSiteSettings } from "@/lib/mappers";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json(mapSiteSettings(settings));
}

export async function PUT(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const data = siteSettingsSchema.parse(body);

    const entries = Object.entries(data) as [string, string][];

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json(mapSiteSettings(settings));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
