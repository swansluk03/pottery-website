"use client";

import Link from "next/link";
import Image from "next/image";
import { EditableText } from "@/components/admin/EditableText";
import { usePageEdit } from "@/components/admin/page-edit-context";

export function Footer() {
  const { getValue } = usePageEdit();
  const email = getValue("global", "site.email", "barnowlpottery@gmail.com");

  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-teal-600/50">
              <Image
                src="/images/barn-owl-logo.png"
                alt="Barn Owl Pottery"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <EditableText
                page="global"
                contentKey="site.name"
                defaultValue="Barn Owl Pottery"
                as="p"
                className="font-serif text-lg text-white"
              />
              <EditableText
                page="global"
                contentKey="footer.byline"
                defaultValue="by Kim Swanson"
                as="p"
                className="text-xs text-stone-400"
              />
            </div>
          </div>
          <EditableText
            page="global"
            contentKey="site.tagline"
            defaultValue="Handmade ceramics by Kim Swanson"
            as="p"
            className="max-w-xs text-sm text-stone-400 leading-6"
          />
          <a
            href={`mailto:${email}`}
            className="text-sm text-teal-400 hover:text-teal-300 transition"
          >
            <EditableText
              page="global"
              contentKey="site.email"
              defaultValue="barnowlpottery@gmail.com"
              as="span"
            />
          </a>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <EditableText
              page="global"
              contentKey="footer.exploreLabel"
              defaultValue="Explore"
              as="span"
              className="font-medium text-white text-xs uppercase tracking-wider"
            />
            <Link href="/gallery" className="hover:text-teal-400 transition">
              <EditableText
                page="global"
                contentKey="nav.gallery"
                defaultValue="Gallery"
                as="span"
              />
            </Link>
            <Link href="/shop" className="hover:text-teal-400 transition">
              <EditableText
                page="global"
                contentKey="nav.shop"
                defaultValue="Shop"
                as="span"
              />
            </Link>
            <Link href="/courses" className="hover:text-teal-400 transition">
              <EditableText
                page="global"
                contentKey="nav.classes"
                defaultValue="Classes"
                as="span"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <EditableText
              page="global"
              contentKey="footer.connectLabel"
              defaultValue="Connect"
              as="span"
              className="font-medium text-white text-xs uppercase tracking-wider"
            />
            <Link href="/contact" className="hover:text-teal-400 transition">
              <EditableText
                page="global"
                contentKey="nav.contact"
                defaultValue="Contact"
                as="span"
              />
            </Link>
            <a
              href="https://www.facebook.com/barnowlpotteryoly/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400 transition"
            >
              <EditableText
                page="global"
                contentKey="footer.facebook"
                defaultValue="Facebook"
                as="span"
              />
            </a>
            <a href={`mailto:${email}`} className="hover:text-teal-400 transition">
              <EditableText
                page="global"
                contentKey="footer.emailLink"
                defaultValue="Email"
                as="span"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-800 px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-6xl text-xs text-stone-500">
          © {new Date().getFullYear()}{" "}
          <EditableText
            page="global"
            contentKey="footer.copyright"
            defaultValue="Barn Owl Pottery · Kim Swanson · Olympia, WA"
            as="span"
          />
        </p>
      </div>
    </footer>
  );
}
