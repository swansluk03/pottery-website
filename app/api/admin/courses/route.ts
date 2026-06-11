import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { courseSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
  });

  return NextResponse.json(courses.map(mapCourse));
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const data = courseSchema.parse(body);
    const slug = data.slug ?? slugify(data.title);

    const course = await prisma.course.create({
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

    return NextResponse.json(mapCourse(course), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create course";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
