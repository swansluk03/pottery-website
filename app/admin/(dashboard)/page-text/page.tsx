import Link from "next/link";

const editPages = [
  {
    label: "Homepage",
    href: "/?edit=true",
    description: "Hero image, banner image, about logo, featured work, gallery preview, and text",
  },
  {
    label: "Shop",
    href: "/shop?edit=true",
    description: "Shop page heading and intro text",
  },
  {
    label: "Gallery",
    href: "/gallery?edit=true",
    description: "Gallery intro and bottom call-to-action",
  },
  {
    label: "Classes",
    href: "/courses?edit=true",
    description: "Classes page heading and intro text",
  },
  {
    label: "Contact",
    href: "/contact?edit=true",
    description: "Contact page intro and footer note",
  },
];

export default function AdminPageTextPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Page text</h1>
      <p className="mt-2 text-stone-600">
        Open a page to edit its marketing copy inline. Header, footer, and site-wide
        text can be edited from any page.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {editPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-teal-700"
          >
            <h2 className="font-serif text-xl text-stone-900">{page.label}</h2>
            <p className="mt-3 text-sm text-stone-600">{page.description}</p>
            <p className="mt-4 text-sm font-medium text-teal-700">Edit page text →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
