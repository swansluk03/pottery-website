import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, galleryCount, courseCount] = await Promise.all([
    prisma.product.count(),
    prisma.galleryImage.count(),
    prisma.course.count(),
  ]);

  const cards = [
    {
      title: "Shop items",
      count: productCount,
      href: "/admin/products",
      description: "Add, edit, or remove pieces for sale",
    },
    {
      title: "Gallery images",
      count: galleryCount,
      href: "/admin/gallery",
      description: "Manage portfolio photos",
    },
    {
      title: "Classes",
      count: courseCount,
      href: "/admin/courses",
      description: "Update class listings and modules",
    },
    {
      title: "Page text",
      count: null,
      href: "/admin/page-text",
      description: "Edit marketing copy directly on each page",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Dashboard</h1>
      <p className="mt-2 text-stone-600">
        Manage Barn Owl Pottery content from one place.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-teal-700"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-stone-900">{card.title}</h2>
              {card.count !== null && (
                <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
                  {card.count}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-stone-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
