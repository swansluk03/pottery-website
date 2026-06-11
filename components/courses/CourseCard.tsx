import Link from "next/link";
import type { Course } from "@/types";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:border-teal-200"
    >
      <p className="text-xs uppercase tracking-wider text-teal-700 font-medium">
        {course.skillLevel}
      </p>
      <h3 className="mt-2 font-serif text-2xl text-stone-900">{course.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">
        {course.description}
      </p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-stone-500">{course.duration}</span>
        <span className="font-medium text-teal-700">{course.priceNote}</span>
      </div>
    </Link>
  );
}
