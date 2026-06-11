"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type DeleteCourseButtonProps = {
  id: string;
};

export function DeleteCourseButton({ id }: DeleteCourseButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <ConfirmDialog
      title="Delete class?"
      message="This class will be removed from the public site."
      onConfirm={handleDelete}
    />
  );
}
