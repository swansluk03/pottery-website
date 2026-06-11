"use client";

import { useState } from "react";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  buttonLabel?: string;
};

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  buttonLabel = "Delete",
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        {buttonLabel}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-serif text-xl text-stone-900">{title}</h3>
            <p className="mt-3 text-sm text-stone-600">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : buttonLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
