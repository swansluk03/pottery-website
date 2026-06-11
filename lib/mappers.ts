import type { Course, CourseModule, GalleryImage, Product, SiteInfo } from "@/types";
import type { Course as PrismaCourse, GalleryImage as PrismaGalleryImage, Product as PrismaProduct } from "@prisma/client";

export function mapProduct(product: PrismaProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    available: product.available,
    featured: product.featured,
    images: product.images,
  };
}

export function mapGalleryImage(image: PrismaGalleryImage): GalleryImage {
  return {
    id: image.id,
    src: image.src,
    alt: image.alt,
    order: image.order,
  };
}

export function mapCourse(course: PrismaCourse): Course {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    duration: course.duration,
    skillLevel: course.skillLevel,
    priceNote: course.priceNote,
    modules: course.modules as CourseModule[],
  };
}

export function mapSiteSettings(settings: { key: string; value: string }[]): SiteInfo {
  const byKey = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

  return {
    name: byKey.name ?? "Barn Owl Pottery",
    tagline: byKey.tagline ?? "",
    email: byKey.email ?? "",
    story: byKey.story ?? "",
  };
}
