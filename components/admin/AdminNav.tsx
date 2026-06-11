"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Shop" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/courses", label: "Classes" },
  { href: "/admin/page-text", label: "Page Text" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-stone-200 bg-white md:w-56 md:min-h-screen md:border-b-0 md:border-r">
      <div className="p-6">
        <p className="text-xs uppercase tracking-wider text-teal-700 font-medium">
          Admin
        </p>
        <h1 className="mt-1 font-serif text-xl text-stone-900">Barn Owl Pottery</h1>
      </div>
      <nav className="flex flex-wrap gap-1 px-4 pb-4 md:flex-col">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-700 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-stone-200 px-4 py-4">
        <Link
          href="/"
          className="block text-sm text-stone-500 hover:text-teal-700"
        >
          View site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-3 text-sm text-stone-500 hover:text-red-600"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
