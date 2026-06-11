import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { InquireButton } from "@/components/shop/InquireButton";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100 shadow-md">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              quality={92}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-teal-700 font-medium">
            {product.category}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900">
            {product.title}
          </h1>
          <p className="mt-4 text-2xl font-medium text-stone-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 leading-7 text-stone-600">{product.description}</p>
          <p className="mt-4 text-sm">
            {product.available ? (
              <span className="text-teal-700 font-medium">Available — inquire to purchase</span>
            ) : (
              <span className="text-stone-400">Currently unavailable</span>
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <InquireButton product={product} />
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-teal-700 hover:text-teal-700"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
