import Image from "next/image";
import type { GalleryImage } from "@/types";

type GalleryGridProps = {
  images: GalleryImage[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-stone-100"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={800}
            height={1000}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
