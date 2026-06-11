import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = (await prisma.product.findMany({ orderBy: { title: "asc" } })).map(
    mapProduct
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Shop items</h1>
          <p className="mt-2 text-stone-600">Manage products shown in the shop.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-stone-100">
                <td className="px-4 py-3">
                  {product.images[0] && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">{product.title}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  {product.available ? "Available" : "Unavailable"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-teal-700 hover:text-teal-800"
                    >
                      Edit
                    </Link>
                    {product.id && <DeleteProductButton id={product.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
