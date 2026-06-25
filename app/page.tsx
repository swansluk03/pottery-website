import Link from "next/link";
import Image from "next/image";
import { EditableHomeImage } from "@/components/admin/EditableHomeImage";
import { EditableMailtoButton } from "@/components/admin/EditableMailtoButton";
import { EditableText } from "@/components/admin/EditableText";
import { PageEditPage } from "@/components/admin/PageEditPage";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts, getGalleryImages, getPageContent } from "@/lib/data";

export default async function HomePage() {
  const [featuredProducts, galleryPreview, pageContent] = await Promise.all([
    getFeaturedProducts(),
    getGalleryImages().then((images) => images.slice(0, 6)),
    getPageContent("home"),
  ]);

  return (
    <PageEditPage page="home" initialContent={pageContent}>
      <div>
        <section className="relative overflow-hidden bg-stone-900">
          <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:py-28">
              <EditableText
                page="home"
                contentKey="hero.location"
                defaultValue="Olympia, WA"
                as="p"
                className="text-xs uppercase tracking-[0.3em] text-teal-400 font-medium"
              />
              <h1 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                <EditableText
                  page="home"
                  contentKey="hero.titleLine1"
                  defaultValue="Barn Owl"
                  as="span"
                />
                <br />
                <EditableText
                  page="home"
                  contentKey="hero.titleLine2"
                  defaultValue="Pottery"
                  as="span"
                />
              </h1>
              <EditableText
                page="home"
                contentKey="hero.description"
                defaultValue="Hand-thrown bowls, hand-built dishes, and seasonal pieces by Kim Swanson. Each piece is glazed and fired in the studio."
                as="p"
                className="mt-5 max-w-md text-base leading-7 text-stone-300"
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/shop">
                  <Button className="bg-teal-700 hover:bg-teal-600 text-white">
                    <EditableText
                      page="home"
                      contentKey="hero.ctaShop"
                      defaultValue="Shop Pieces"
                      as="span"
                    />
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button
                    variant="secondary"
                    className="border-stone-600 bg-transparent text-stone-200 hover:bg-stone-800 hover:border-stone-400"
                  >
                    <EditableText
                      page="home"
                      contentKey="hero.ctaGallery"
                      defaultValue="View Gallery"
                      as="span"
                    />
                  </Button>
                </Link>
              </div>
            </div>

            <EditableHomeImage
              page="home"
              imageKey="hero.image"
              altKey="hero.imageAlt"
              defaultSrc="/images/bowl-collection.png"
              defaultAlt="Hand-thrown pottery bowls by Barn Owl Pottery"
              variant="hero"
              priority
              quality={92}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <EditableText
                page="home"
                contentKey="featured.label"
                defaultValue="Available Work"
                as="p"
                className="text-xs uppercase tracking-wider text-teal-700 font-medium"
              />
              <EditableText
                page="home"
                contentKey="featured.heading"
                defaultValue="Pieces from the studio"
                as="h2"
                className="mt-2 font-serif text-3xl text-stone-900"
              />
            </div>
            <Link href="/shop" className="text-sm font-medium text-stone-500 hover:text-teal-700 transition">
              <EditableText
                page="home"
                contentKey="featured.link"
                defaultValue="View all →"
                as="span"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="relative h-72 sm:h-96 overflow-hidden">
          <EditableHomeImage
            page="home"
            imageKey="banner.image"
            altKey="banner.imageAlt"
            defaultSrc="/images/teal-spiral-bowl.png"
            defaultAlt="Teal spiral bowl by Barn Owl Pottery"
            variant="banner"
            quality={92}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <EditableText
                page="home"
                contentKey="banner.label"
                defaultValue="Each piece is one of a kind"
                as="p"
                className="text-xs uppercase tracking-widest text-teal-300 mb-3"
              />
              <EditableText
                page="home"
                contentKey="banner.heading"
                defaultValue="Made by hand. Finished by fire."
                as="h2"
                className="font-serif text-3xl sm:text-4xl"
              />
              <Link href="/contact" className="mt-6 inline-block">
                <Button className="bg-teal-700 hover:bg-teal-600 mt-4">
                  <EditableText
                    page="home"
                    contentKey="banner.cta"
                    defaultValue="Inquire About a Piece"
                    as="span"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <EditableText
                page="home"
                contentKey="gallery.label"
                defaultValue="Gallery"
                as="p"
                className="text-xs uppercase tracking-wider text-teal-700 font-medium"
              />
              <EditableText
                page="home"
                contentKey="gallery.heading"
                defaultValue="From the studio"
                as="h2"
                className="mt-2 font-serif text-3xl text-stone-900"
              />
            </div>
            <Link href="/gallery" className="text-sm font-medium text-stone-500 hover:text-teal-700 transition">
              <EditableText
                page="home"
                contentKey="gallery.link"
                defaultValue="Full gallery →"
                as="span"
              />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {galleryPreview.map((image) => (
              <Link
                key={image.id ?? image.src}
                href="/gallery"
                className="relative aspect-square overflow-hidden rounded-xl bg-stone-200 group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-stone-900 px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex items-start gap-5">
              <EditableHomeImage
                page="home"
                imageKey="about.logo"
                altKey="about.logoAlt"
                defaultSrc="/images/barn-owl-logo.png"
                defaultAlt="Barn Owl Pottery logo"
                variant="logo"
              />
              <div>
                <EditableText
                  page="home"
                  contentKey="about.label"
                  defaultValue="About"
                  as="p"
                  className="text-xs uppercase tracking-wider text-teal-400 font-medium"
                />
                <EditableText
                  page="home"
                  contentKey="about.heading"
                  defaultValue="Kim Swanson"
                  as="h2"
                  className="mt-2 font-serif text-2xl text-white"
                />
                <EditableText
                  page="global"
                  contentKey="site.story"
                  defaultValue="Barn Owl Pottery is Kim Swanson's small studio in Olympia, WA."
                  as="p"
                  className="mt-3 leading-7 text-stone-400 text-sm"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-stone-700 bg-stone-800 p-8">
              <EditableText
                page="home"
                contentKey="contact.heading"
                defaultValue="Get in touch"
                as="h3"
                className="font-serif text-2xl text-white"
              />
              <EditableText
                page="home"
                contentKey="contact.description"
                defaultValue="Questions about a piece, interest in a class, or a custom order? Send a message and Kim will reply directly."
                as="p"
                className="mt-3 text-sm text-stone-400 leading-6"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button className="bg-teal-700 hover:bg-teal-600">
                    <EditableText
                      page="home"
                      contentKey="contact.cta"
                      defaultValue="Contact Kim"
                      as="span"
                    />
                  </Button>
                </Link>
                <EditableMailtoButton
                  page="home"
                  labelKey="contact.emailCta"
                  defaultLabel="Email directly"
                  className="border-stone-600 bg-transparent text-stone-300 hover:bg-stone-700"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageEditPage>
  );
}
