"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EditableText } from "@/components/admin/EditableText";

const navLinks = [
  { href: "/gallery", labelKey: "nav.gallery", defaultLabel: "Gallery" },
  { href: "/shop", labelKey: "nav.shop", defaultLabel: "Shop" },
  { href: "/courses", labelKey: "nav.classes", defaultLabel: "Classes" },
  { href: "/contact", labelKey: "nav.contact", defaultLabel: "Contact" },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-teal-700/30 transition group-hover:ring-teal-700">
            <Image
              src="/images/barn-owl-logo.png"
              alt="Barn Owl Pottery"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <span className="min-w-0 font-serif text-lg leading-tight text-stone-900 sm:text-xl">
            <EditableText
              page="global"
              contentKey="header.nameLine1"
              defaultValue="Barn Owl"
              as="span"
            />
            <span className="sm:hidden"> </span>
            <br className="hidden sm:block" />
            <EditableText
              page="global"
              contentKey="header.nameLine2"
              defaultValue="Pottery"
              as="span"
              className="font-sans text-sm font-normal tracking-wide text-teal-700 sm:block"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-stone-600 transition hover:bg-stone-100 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-stone-200 bg-white px-4 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-3.5 text-base font-medium text-stone-700 transition hover:bg-stone-50 hover:text-teal-700"
              onClick={() => setMenuOpen(false)}
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
      )}
    </header>
  );
}
