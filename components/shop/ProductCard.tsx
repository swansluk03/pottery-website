import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:border-teal-200"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-teal-700 font-medium">
          {product.category}
        </p>
        <h3 className="mt-1 font-serif text-lg text-stone-900 group-hover:text-teal-800 transition">
          {product.title}
        </h3>
        <p className="mt-2 text-sm font-medium text-stone-700">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
