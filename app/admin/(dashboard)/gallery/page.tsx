import { getGalleryImages } from "@/lib/data";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Gallery</h1>
      <p className="mt-2 text-stone-600">
        Upload new photos or edit alt text for existing gallery images.
      </p>
      <div className="mt-8">
        <GalleryManager initialImages={images} />
      </div>
    </div>
  );
}
