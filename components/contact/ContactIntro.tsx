"use client";

import Link from "next/link";
import { EditableText } from "@/components/admin/EditableText";
import { usePageEdit } from "@/components/admin/page-edit-context";

export function ContactIntro() {
  const { getValue } = usePageEdit();
  const email = getValue("global", "site.email", "barnowlpottery@gmail.com");

  return (
    <>
      <EditableText
        page="contact"
        contentKey="intro.label"
        defaultValue="Contact"
        as="p"
        className="text-xs uppercase tracking-wider text-teal-700 font-medium"
      />
      <EditableText
        page="contact"
        contentKey="intro.heading"
        defaultValue="Get in touch"
        as="h1"
        className="mt-2 font-serif text-4xl text-stone-900"
      />
      <p className="mt-4 text-stone-600 leading-7">
        <EditableText
          page="contact"
          contentKey="intro.descriptionPrefix"
          defaultValue="Interested in a piece, a class, or a custom order? Send a message and Kim will reply to"
          as="span"
        />{" "}
        <a href={`mailto:${email}`} className="font-medium text-teal-700 hover:underline">
          <EditableText
            page="global"
            contentKey="site.email"
            defaultValue="barnowlpottery@gmail.com"
            as="span"
          />
        </a>
        <EditableText
          page="contact"
          contentKey="intro.descriptionSuffix"
          defaultValue="."
          as="span"
        />
      </p>
    </>
  );
}

export function ContactFooterNote() {
  const { getValue } = usePageEdit();
  const email = getValue("global", "site.email", "barnowlpottery@gmail.com");

  return (
    <p className="mt-6 text-sm text-stone-500">
      <EditableText
        page="contact"
        contentKey="footerNote"
        defaultValue="Prefer to email directly?"
        as="span"
      />{" "}
      <Link href={`mailto:${email}`} className="text-teal-700 hover:underline">
        <EditableText
          page="global"
          contentKey="site.email"
          defaultValue="barnowlpottery@gmail.com"
          as="span"
        />
      </Link>
    </p>
  );
}
