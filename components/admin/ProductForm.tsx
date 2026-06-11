"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? String(product.price / 100) : ""
  );
  const [category, setCategory] = useState(product?.category ?? "Bowls");
  const [available, setAvailable] = useState(product?.available ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || undefined,
      description,
      price: Math.round(Number(price) * 100),
      category,
      available,
      featured,
      images,
    };

    const url = product?.id
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product?.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Failed to save product");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
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
          placeholder="auto-generated from title if blank"
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Price (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Category</label>
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => setAvailable(event.target.checked)}
          />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          Featured on homepage
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Images</label>
        <div className="mt-2">
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : product ? "Update product" : "Create product"}
      </Button>
    </form>
  );
}
