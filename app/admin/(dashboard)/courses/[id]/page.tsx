import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { CourseForm } from "@/components/admin/CourseForm";

type EditCoursePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Edit class</h1>
      <p className="mt-2 text-stone-600">{course.title}</p>
      <div className="mt-8">
        <CourseForm course={mapCourse(course)} />
      </div>
    </div>
  );
}
