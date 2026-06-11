import { Suspense } from "react";
import { PageEditPage } from "@/components/admin/PageEditPage";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFooterNote, ContactIntro } from "@/components/contact/ContactIntro";
import { getPageContent } from "@/lib/data";

export default async function ContactPage() {
  const pageContent = await getPageContent("contact");

  return (
    <PageEditPage page="contact" initialContent={pageContent}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ContactIntro />

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-stone-100" />}>
            <ContactForm />
          </Suspense>
        </div>

        <ContactFooterNote />
      </div>
    </PageEditPage>
  );
}
