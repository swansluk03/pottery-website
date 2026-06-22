import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { PageEditShell } from "@/components/admin/PageEditShell";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPageContent } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://barnowlpottery.com"
  ),
  title: {
    default: "Barn Owl Pottery",
    template: "%s | Barn Owl Pottery",
  },
  description:
    "Handmade ceramics by Kim Swanson. Browse bowls, dishes, and seasonal pieces — or get in touch about classes.",
  openGraph: {
    title: "Barn Owl Pottery",
    description:
      "Hand-thrown and hand-built pottery by Kim Swanson. Shop pieces or inquire about studio classes.",
    type: "website",
    images: ["/images/barn-owl-logo.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalContent = await getPageContent("global");

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f3ef] text-stone-900">
        <PageEditShell initialGlobalContent={globalContent}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PageEditShell>
      </body>
    </html>
  );
}
