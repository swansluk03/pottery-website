import { CourseForm } from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Add class</h1>
      <p className="mt-2 text-stone-600">Create a new pottery class listing.</p>
      <div className="mt-8">
        <CourseForm />
      </div>
    </div>
  );
}
