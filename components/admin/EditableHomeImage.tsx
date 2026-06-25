"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { usePageEdit } from "@/components/admin/page-edit-context";
import type { PageId } from "@/lib/page-content-defaults";

type HomeImageVariant = "hero" | "banner" | "logo";

type EditableHomeImageProps = {
  page: PageId;
  imageKey: string;
  altKey: string;
  defaultSrc: string;
  defaultAlt: string;
  variant: HomeImageVariant;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
};

async function uploadImageFile(file: File): Promise<string> {
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
  return result.secure_url as string;
}

function ImagePreviewFrame({
  variant,
  src,
  alt,
}: {
  variant: HomeImageVariant;
  src: string;
  alt: string;
}) {
  if (variant === "logo") {
    return (
      <div className="flex items-center gap-4 rounded-xl bg-stone-100 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-teal-600">
          <Image src={src} alt={alt} fill className="object-cover" sizes="80px" />
        </div>
        <p className="text-xs text-stone-500">About section logo (80×80 circle)</p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
        <p className="bg-stone-800 px-3 py-1.5 text-xs text-stone-300">
          Hero image — right side on desktop, full width on mobile
        </p>
        <div className="grid lg:grid-cols-2">
          <div className="hidden bg-stone-900 px-4 py-8 lg:block">
            <div className="h-4 w-24 rounded bg-stone-700" />
            <div className="mt-4 h-8 w-40 rounded bg-stone-700" />
            <div className="mt-3 h-3 w-full max-w-xs rounded bg-stone-800" />
          </div>
          <div className="relative h-40 sm:h-48 lg:h-52">
            <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-stone-900/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <p className="bg-stone-800 px-3 py-1.5 text-xs text-stone-300">
        Full-width banner — text appears centered over the image
      </p>
      <div className="relative h-40 sm:h-48">
        <Image src={src} alt={alt} fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50 px-4 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-teal-300">
              Sample overlay text
            </p>
            <p className="mt-1 font-serif text-lg text-white sm:text-xl">
              Made by hand. Finished by fire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditableHomeImage({
  page,
  imageKey,
  altKey,
  defaultSrc,
  defaultAlt,
  variant,
  priority,
  quality,
  sizes,
  className = "",
}: EditableHomeImageProps) {
  const { editMode, getValue, updateBlock, activeKey, setActiveKey } = usePageEdit();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blockId = `${page}:${imageKey}`;
  const isActive = activeKey === blockId;
  const src = getValue(page, imageKey, defaultSrc);
  const alt = getValue(page, altKey, defaultAlt);

  function setImageSrc(nextSrc: string) {
    updateBlock(page, imageKey, nextSrc);
  }

  function setImageAlt(nextAlt: string) {
    updateBlock(page, altKey, nextAlt);
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError("");

    try {
      const url = await uploadImageFile(file);
      setImageSrc(url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const imageNode =
    variant === "logo" ? (
      <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-teal-600 ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="80px" />
      </div>
    ) : variant === "hero" ? (
      <div className={`relative h-72 lg:h-auto min-h-[18rem] ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          quality={quality}
          sizes={sizes}
        />
        <div className="absolute inset-0 bg-stone-900/20" />
      </div>
    ) : (
      <div
        className={`${
          editMode ? "relative h-full w-full" : "absolute inset-0"
        } ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          quality={quality}
          sizes={sizes}
        />
      </div>
    );

  if (!editMode) {
    return imageNode;
  }

  return (
    <>
      <div
        className={`${
          variant === "banner"
            ? "absolute inset-0"
            : variant === "logo"
              ? "relative shrink-0 rounded-full"
              : "relative w-full"
        } ${isActive ? "editable-image-active" : "editable-image-idle"}`}
      >
        <button
          type="button"
          className={`group relative block h-full w-full text-left ${
            variant === "logo" ? "rounded-full" : ""
          }`}
          onClick={() => setActiveKey(isActive ? null : blockId)}
          aria-label={`Edit ${imageKey}`}
        >
          {imageNode}
          {editMode && (
            <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-stone-900/0 pb-3 transition group-hover:bg-stone-900/40">
              <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                {isActive ? "Editing image…" : "Change image"}
              </span>
            </span>
          )}
        </button>
      </div>

      {isActive && (
        <div className="fixed inset-x-0 bottom-24 z-[70] px-4">
          <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-stone-900">Homepage image preview</p>
                <p className="mt-1 text-xs text-stone-500">
                  Adjust the image below, then save changes with the toolbar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveKey(null)}
                className="text-sm text-stone-500 hover:text-stone-800"
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <ImagePreviewFrame variant={variant} src={src} alt={alt} />
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-600">Image URL</label>
                <input
                  type="text"
                  value={src}
                  onChange={(event) => setImageSrc(event.target.value)}
                  placeholder="/images/example.png or Cloudinary URL"
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600">Alt text</label>
                <input
                  type="text"
                  value={alt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleFileUpload(file);
                    }
                    event.target.value = "";
                  }}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-teal-700 hover:text-teal-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : "Upload new image"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageSrc(defaultSrc);
                    setImageAlt(defaultAlt);
                  }}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                >
                  Reset to default
                </button>
              </div>

              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
