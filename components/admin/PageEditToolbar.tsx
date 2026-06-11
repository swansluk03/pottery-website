"use client";

import { usePageEdit } from "@/components/admin/page-edit-context";
import { Button } from "@/components/ui/Button";

export function PageEditToolbar() {
  const { editMode, dirtyPages, save, cancel, exitEdit, isSaving, error } = usePageEdit();

  if (!editMode) {
    return null;
  }

  const hasChanges = dirtyPages.size > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-teal-800 bg-stone-900/95 px-4 py-3 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Editing page text</p>
          <p className="text-xs text-stone-400">
            Click any highlighted text to edit. Press Escape to cancel a block.
          </p>
          {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="border-stone-600 bg-transparent text-stone-200 hover:bg-stone-800"
            onClick={cancel}
            disabled={!hasChanges || isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-teal-700 hover:bg-teal-600"
            onClick={save}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="border-stone-600 bg-transparent text-stone-200 hover:bg-stone-800"
            onClick={exitEdit}
            disabled={isSaving}
          >
            Done editing
          </Button>
        </div>
      </div>
    </div>
  );
}
