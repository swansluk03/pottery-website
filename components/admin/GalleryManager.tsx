"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { GalleryImage } from "@/types";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";

type GalleryManagerProps = {
  initialImages: GalleryImage[];
};

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function addImage() {
    if (newImages.length === 0 || !altText.trim()) {
      setError("Choose an image and add alt text");
      return;
    }

    setSaving(true);
    setError("");

    const response = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src: newImages[0], alt: altText.trim() }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Failed to add image");
      setSaving(false);
      return;
    }

    const created = await response.json();
    setImages([...images, created]);
    setNewImages([]);
    setAltText("");
    router.refresh();
    setSaving(false);
  }

  async function updateAlt(image: GalleryImage, alt: string) {
    if (!image.id) {
      return;
    }

    await fetch(`/api/admin/gallery/${image.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src: image.src, alt, order: image.order }),
    });

    setImages(
      images.map((entry) => (entry.id === image.id ? { ...entry, alt } : entry))
    );
  }

  async function deleteImage(id: string) {
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setImages(images.filter((image) => image.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-xl text-stone-900">Add gallery image</h2>
        <div className="mt-4 space-y-4">
          <ImageUploader images={newImages} onChange={setNewImages} />
          <input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Alt text for accessibility"
            className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="button" onClick={addImage} disabled={saving}>
            {saving ? "Adding..." : "Add to gallery"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id ?? image.src}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <div className="relative aspect-[4/5] bg-stone-100">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="space-y-3 p-4">
              <input
                defaultValue={image.alt}
                onBlur={(event) => updateAlt(image, event.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
              {image.id && (
                <ConfirmDialog
                  title="Delete gallery image?"
                  message="This image will be removed from the public gallery."
                  onConfirm={() => deleteImage(image.id!)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
