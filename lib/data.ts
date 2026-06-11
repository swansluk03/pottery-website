import { prisma } from "@/lib/prisma";
import {
  mapCourse,
  mapGalleryImage,
  mapProduct,
  mapSiteSettings,
} from "@/lib/mappers";
import {
  PAGE_CONTENT_DEFAULTS,
  type PageId,
} from "@/lib/page-content-defaults";
import type { Course, GalleryImage, Product, SiteInfo } from "@/types";

export async function getPageContent(page: PageId): Promise<Record<string, string>> {
  const defaults = PAGE_CONTENT_DEFAULTS[page];
  const rows = await prisma.pageContent.findMany({ where: { page } });
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return { ...defaults, ...stored };
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const content = await getPageContent("global");

  return {
    name: content["site.name"],
    tagline: content["site.tagline"],
    email: content["site.email"],
    story: content["site.story"],
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { title: "asc" },
  });
  return products.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { title: "asc" },
  });
  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? mapProduct(product) : undefined;
}

export async function getProductsByCategory(category?: string): Promise<Product[]> {
  if (!category) {
    return getProducts();
  }

  const products = await prisma.product.findMany({
    where: {
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
    orderBy: { title: "asc" },
  });

  return products.map(mapProduct);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });
  return images.map(mapGalleryImage);
}

export async function getCourses(): Promise<Course[]> {
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
  });
  return courses.map(mapCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const course = await prisma.course.findUnique({ where: { slug } });
  return course ? mapCourse(course) : undefined;
}
