import { Suspense } from "react";
import { EditableText } from "@/components/admin/EditableText";
import { PageEditPage } from "@/components/admin/PageEditPage";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { getPageContent, getProductsByCategory } from "@/lib/data";

type ShopPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams;
  const [products, pageContent] = await Promise.all([
    getProductsByCategory(category),
    getPageContent("shop"),
  ]);

  return (
    <PageEditPage page="shop" initialContent={pageContent}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <EditableText
            page="shop"
            contentKey="intro.label"
            defaultValue="Shop"
            as="p"
            className="text-xs uppercase tracking-wider text-teal-700 font-medium"
          />
          <EditableText
            page="shop"
            contentKey="intro.heading"
            defaultValue="Available pieces"
            as="h1"
            className="mt-2 font-serif text-4xl text-stone-900"
          />
          <EditableText
            page="shop"
            contentKey="intro.description"
            defaultValue={
              'Each piece is handmade and one of a kind. Use "Inquire to Purchase" to reach Kim directly — she\'ll confirm availability and arrange payment.'
            }
            as="p"
            className="mt-4 text-stone-600 leading-7"
          />
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="h-10" />}>
            <ProductFilters />
          </Suspense>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </PageEditPage>
  );
}
