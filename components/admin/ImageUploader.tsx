"use client";

import { useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");

    try {
      const signatureResponse = await fetch("/api/admin/upload", {
        method: "POST",
      });

      if (!signatureResponse.ok) {
        const payload = await signatureResponse.json();
        throw new Error(payload.error ?? "Upload is not configured");
      }

      const { timestamp, signature, cloudName, apiKey, folder } =
        await signatureResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const result = await uploadResponse.json();
      onChange([...images, result.secure_url as string]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  function addManualUrl() {
    if (!manualUrl.trim()) {
      return;
    }

    onChange([...images, manualUrl.trim()]);
    setManualUrl("");
  }

  function removeImage(index: number) {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative h-24 w-24 overflow-hidden rounded-xl bg-stone-100"
          >
            <Image src={image} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-1 top-1 rounded-full bg-stone-900/70 px-2 py-0.5 text-xs text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-teal-700 hover:text-teal-700">
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadFile(file);
              }
            }}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(event) => setManualUrl(event.target.value)}
          placeholder="/images/example.png or Cloudinary URL"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addManualUrl}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
        >
          Add URL
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
