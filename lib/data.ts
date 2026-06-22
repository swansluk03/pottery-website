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

  if (!process.env.DATABASE_URL) {
    return defaults;
  }

  try {
    const rows = await prisma.pageContent.findMany({ where: { page } });
    const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    return { ...defaults, ...stored };
  } catch {
    return defaults;
  }
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
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { title: "asc" },
    });
    return products.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { title: "asc" },
    });
    return products.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    return product ? mapProduct(product) : undefined;
  } catch {
    return undefined;
  }
}

export async function getProductsByCategory(category?: string): Promise<Product[]> {
  if (!category) {
    return getProducts();
  }

  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
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
  } catch {
    return [];
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
    return images.map(mapGalleryImage);
  } catch {
    return [];
  }
}

export async function getCourses(): Promise<Course[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { title: "asc" },
    });
    return courses.map(mapCourse);
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    return course ? mapCourse(course) : undefined;
  } catch {
    return undefined;
  }
}
