import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapGalleryImage } from "@/lib/mappers";
import { galleryImageSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = galleryImageSchema.parse(body);

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        src: data.src,
        alt: data.alt,
        order: data.order,
      },
    });

    return NextResponse.json(mapGalleryImage(image));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update gallery image";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const { id } = await context.params;
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete gallery image";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
