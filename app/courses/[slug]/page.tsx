import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/data";
import { CourseInquireButton } from "@/components/courses/CourseInquireButton";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-amber-800">
          {course.skillLevel}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-stone-900">{course.title}</h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
          <span>{course.duration}</span>
          <span>{course.priceNote}</span>
        </div>
        <p className="mt-6 leading-7 text-stone-600">{course.description}</p>
        <div className="mt-8">
          <CourseInquireButton course={course} />
        </div>
      </div>

      <section className="mt-12 rounded-3xl border border-stone-200 bg-white p-8">
        <h2 className="font-serif text-2xl text-stone-900">What you&apos;ll cover</h2>
        <div className="mt-6 space-y-6">
          {course.modules.map((module, index) => (
            <div key={module.title} className="rounded-2xl bg-stone-50 p-5">
              <h3 className="font-medium text-stone-900">
                Module {index + 1}: {module.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-600">
                {module.lessons.map((lesson) => (
                  <li key={lesson}>• {lesson}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
