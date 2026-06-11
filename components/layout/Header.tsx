"use client";

import Link from "next/link";
import Image from "next/image";
import { EditableText } from "@/components/admin/EditableText";

const navLinks = [
  { href: "/gallery", labelKey: "nav.gallery", defaultLabel: "Gallery" },
  { href: "/shop", labelKey: "nav.shop", defaultLabel: "Shop" },
  { href: "/courses", labelKey: "nav.classes", defaultLabel: "Classes" },
  { href: "/contact", labelKey: "nav.contact", defaultLabel: "Contact" },
] as const;

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-700/30 group-hover:ring-teal-700 transition">
            <Image
              src="/images/barn-owl-logo.png"
              alt="Barn Owl Pottery"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <span className="font-serif text-xl text-stone-900 leading-tight">
            <EditableText
              page="global"
              contentKey="header.nameLine1"
              defaultValue="Barn Owl"
              as="span"
            />
            <br className="hidden sm:block" />
            <EditableText
              page="global"
              contentKey="header.nameLine2"
              defaultValue="Pottery"
              as="span"
              className="text-sm font-sans font-normal text-teal-700 tracking-wide hidden sm:block"
            />
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition hover:text-teal-700"
            >
              <EditableText
                page="global"
                contentKey={link.labelKey}
                defaultValue={link.defaultLabel}
                as="span"
              />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
