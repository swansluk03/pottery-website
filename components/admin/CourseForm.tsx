"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course, CourseModule } from "@/types";
import { Button } from "@/components/ui/Button";

type CourseFormProps = {
  course?: Course;
};

function emptyModule(): CourseModule {
  return { title: "", lessons: [""] };
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [duration, setDuration] = useState(course?.duration ?? "");
  const [skillLevel, setSkillLevel] = useState(course?.skillLevel ?? "Beginner");
  const [priceNote, setPriceNote] = useState(
    course?.priceNote ?? "Contact for pricing and schedule"
  );
  const [modules, setModules] = useState<CourseModule[]>(
    course?.modules ?? [emptyModule()]
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateModule(index: number, updated: CourseModule) {
    setModules(modules.map((module, moduleIndex) => (moduleIndex === index ? updated : module)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || undefined,
      description,
      duration,
      skillLevel,
      priceNote,
      modules: modules.map((module) => ({
        title: module.title,
        lessons: module.lessons.filter(Boolean),
      })),
    };

    const url = course?.id
      ? `/api/admin/courses/${course.id}`
      : "/api/admin/courses";
    const method = course?.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Failed to save course");
      setSaving(false);
      return;
    }

    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-stone-700">Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Slug</label>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={4}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-stone-700">Duration</label>
          <input
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Skill level</label>
          <input
            value={skillLevel}
            onChange={(event) => setSkillLevel(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Price note</label>
          <input
            value={priceNote}
            onChange={(event) => setPriceNote(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-stone-900">Modules</h3>
          <button
            type="button"
            onClick={() => setModules([...modules, emptyModule()])}
            className="text-sm text-teal-700 hover:text-teal-800"
          >
            Add module
          </button>
        </div>

        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="rounded-2xl border border-stone-200 p-4">
            <input
              value={module.title}
              onChange={(event) =>
                updateModule(moduleIndex, { ...module, title: event.target.value })
              }
              placeholder="Module title"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
            />
            <div className="mt-3 space-y-2">
              {module.lessons.map((lesson, lessonIndex) => (
                <input
                  key={lessonIndex}
                  value={lesson}
                  onChange={(event) => {
                    const lessons = [...module.lessons];
                    lessons[lessonIndex] = event.target.value;
                    updateModule(moduleIndex, { ...module, lessons });
                  }}
                  placeholder="Lesson"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  updateModule(moduleIndex, {
                    ...module,
                    lessons: [...module.lessons, ""],
                  })
                }
                className="text-sm text-teal-700"
              >
                Add lesson
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : course ? "Update class" : "Create class"}
      </Button>
    </form>
  );
}
