import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { Button } from "@/components/ui/Button";
import { DeleteCourseButton } from "@/components/admin/DeleteCourseButton";

export default async function AdminCoursesPage() {
  const courses = (await prisma.course.findMany({ orderBy: { title: "asc" } })).map(
    mapCourse
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Classes</h1>
          <p className="mt-2 text-stone-600">Manage pottery class listings.</p>
        </div>
        <Link href="/admin/courses/new">
          <Button>Add class</Button>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5"
          >
            <div>
              <h2 className="font-serif text-xl text-stone-900">{course.title}</h2>
              <p className="mt-1 text-sm text-stone-500">
                {course.duration} · {course.skillLevel}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/courses/${course.id}`}
                className="text-teal-700 hover:text-teal-800"
              >
                Edit
              </Link>
              {course.id && <DeleteCourseButton id={course.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
