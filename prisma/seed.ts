import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";
import productsData from "../data/products.json";
import galleryData from "../data/gallery.json";
import coursesData from "../data/courses.json";
import siteData from "../data/site.json";
import {
  PAGE_CONTENT_DEFAULTS,
  PAGE_IDS,
} from "../lib/page-content-defaults";

config({ path: resolve(process.cwd(), ".env.local") });

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.course.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.pageContent.deleteMany();

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        available: product.available,
        featured: product.featured ?? false,
        images: product.images,
      },
    });
  }

  for (const [index, image] of galleryData.entries()) {
    await prisma.galleryImage.create({
      data: {
        src: image.src,
        alt: image.alt,
        order: index,
      },
    });
  }

  for (const course of coursesData) {
    await prisma.course.create({
      data: {
        slug: course.slug,
        title: course.title,
        description: course.description,
        duration: course.duration,
        skillLevel: course.skillLevel,
        priceNote: course.priceNote,
        modules: course.modules,
      },
    });
  }

  const siteEntries = Object.entries(siteData) as [string, string][];
  for (const [key, value] of siteEntries) {
    await prisma.siteSetting.create({
      data: { key, value },
    });
  }

  const siteOverrides: Record<string, string> = {
    "site.name": siteData.name,
    "site.tagline": siteData.tagline,
    "site.email": siteData.email,
    "site.story": siteData.story,
  };

  for (const page of PAGE_IDS) {
    const defaults = PAGE_CONTENT_DEFAULTS[page];
    const entries = Object.entries(defaults);

    for (const [key, defaultValue] of entries) {
      const value =
        page === "global" && key in siteOverrides
          ? siteOverrides[key]
          : defaultValue;

      await prisma.pageContent.create({
        data: { page, key, value },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
