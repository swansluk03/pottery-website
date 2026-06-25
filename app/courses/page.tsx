import { EditableText } from "@/components/admin/EditableText";
import { PageEditPage } from "@/components/admin/PageEditPage";
import { CourseCard } from "@/components/courses/CourseCard";
import { getCourses, getPageContent } from "@/lib/data";

export default async function CoursesPage() {
  const [courses, pageContent] = await Promise.all([
    getCourses(),
    getPageContent("courses"),
  ]);

  return (
    <PageEditPage page="courses" initialContent={pageContent}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <EditableText
            page="courses"
            contentKey="intro.label"
            defaultValue="Classes"
            as="p"
            className="text-xs uppercase tracking-wider text-teal-700 font-medium"
          />
          <EditableText
            page="courses"
            contentKey="intro.heading"
            defaultValue="Learn pottery with Kim"
            as="h1"
            className="mt-2 font-serif text-3xl text-stone-900 sm:text-4xl"
          />
          <EditableText
            page="courses"
            contentKey="intro.description"
            defaultValue="Small-group classes and workshops in the studio. Send a message for current schedule, pricing, and availability."
            as="p"
            className="mt-4 text-stone-600 leading-7"
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </PageEditPage>
  );
}
