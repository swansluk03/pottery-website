"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type DeleteProductButtonProps = {
  id: string;
};

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <ConfirmDialog
      title="Delete product?"
      message="This product will be removed from the shop."
      onConfirm={handleDelete}
    />
  );
}
