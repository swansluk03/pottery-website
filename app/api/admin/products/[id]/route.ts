import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

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
    const data = productSchema.parse(body);
    const slug = data.slug ?? slugify(data.title);

    const product = await prisma.product.update({
      where: { id },
      data: {
        slug,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        available: data.available,
        featured: data.featured ?? false,
        images: data.images,
      },
    });

    return NextResponse.json(mapProduct(product));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
