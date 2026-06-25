import Link from "next/link";
import Image from "next/image";
import { EditableText } from "@/components/admin/EditableText";
import { PageEditPage } from "@/components/admin/PageEditPage";
import { Button } from "@/components/ui/Button";
import { getGalleryImages, getPageContent } from "@/lib/data";

export default async function GalleryPage() {
  const [images, pageContent] = await Promise.all([
    getGalleryImages(),
    getPageContent("gallery"),
  ]);

  return (
    <PageEditPage page="gallery" initialContent={pageContent}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <EditableText
            page="gallery"
            contentKey="intro.label"
            defaultValue="Gallery"
            as="p"
            className="text-xs uppercase tracking-wider text-teal-700 font-medium"
          />
          <EditableText
            page="gallery"
            contentKey="intro.heading"
            defaultValue="Work from the studio"
            as="h1"
            className="mt-2 font-serif text-3xl text-stone-900 sm:text-4xl"
          />
          <EditableText
            page="gallery"
            contentKey="intro.description"
            defaultValue="Bowls, dishes, seasonal pieces, and craft fair highlights. All work by Kim Swanson."
            as="p"
            className="mt-4 text-stone-600 leading-7"
          />
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image) => (
            <div
              key={image.id ?? image.src}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-stone-200 shadow-sm"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={1000}
                className="h-auto w-full object-cover"
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-stone-900 px-6 py-10 text-center text-white sm:px-10">
          <EditableText
            page="gallery"
            contentKey="cta.heading"
            defaultValue="Like what you see?"
            as="h2"
            className="font-serif text-2xl sm:text-3xl"
          />
          <EditableText
            page="gallery"
            contentKey="cta.description"
            defaultValue="Inquire about availability, commissions, or upcoming classes."
            as="p"
            className="mt-3 text-stone-400"
          />
          <Link href="/contact" className="mt-6 inline-block">
            <Button className="bg-teal-700 hover:bg-teal-600 mt-4">
              <EditableText
                page="gallery"
                contentKey="cta.button"
                defaultValue="Contact Kim"
                as="span"
              />
            </Button>
          </Link>
        </div>
      </div>
    </PageEditPage>
  );
}
