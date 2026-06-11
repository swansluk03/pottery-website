import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers";
import { ProductForm } from "@/components/admin/ProductForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Edit product</h1>
      <p className="mt-2 text-stone-600">{product.title}</p>
      <div className="mt-8">
        <ProductForm product={mapProduct(product)} />
      </div>
    </div>
  );
}
