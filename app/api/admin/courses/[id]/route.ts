import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { courseSchema } from "@/lib/validations";
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
    const data = courseSchema.parse(body);
    const slug = data.slug ?? slugify(data.title);

    const course = await prisma.course.update({
      where: { id },
      data: {
        slug,
        title: data.title,
        description: data.description,
        duration: data.duration,
        skillLevel: data.skillLevel,
        priceNote: data.priceNote,
        modules: data.modules,
      },
    });

    return NextResponse.json(mapCourse(course));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update course";
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
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete course";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
