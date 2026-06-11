import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  const products = await prisma.product.findMany({
    orderBy: { title: "asc" },
  });

  return NextResponse.json(products.map(mapProduct));
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const data = productSchema.parse(body);
    const slug = data.slug ?? slugify(data.title);

    const product = await prisma.product.create({
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

    return NextResponse.json(mapProduct(product), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
