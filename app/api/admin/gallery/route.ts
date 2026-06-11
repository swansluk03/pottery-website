import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapGalleryImage } from "@/lib/mappers";
import { galleryImageSchema } from "@/lib/validations";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(images.map(mapGalleryImage));
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const data = galleryImageSchema.parse(body);

    const maxOrder = await prisma.galleryImage.aggregate({
      _max: { order: true },
    });

    const image = await prisma.galleryImage.create({
      data: {
        src: data.src,
        alt: data.alt,
        order: data.order ?? (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json(mapGalleryImage(image), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create gallery image";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
