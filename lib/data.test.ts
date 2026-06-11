import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    siteSetting: { findMany: vi.fn() },
    pageContent: { findMany: vi.fn() },
    product: { findMany: vi.fn(), findUnique: vi.fn() },
    galleryImage: { findMany: vi.fn() },
    course: { findMany: vi.fn(), findUnique: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

import {
  getCourseBySlug,
  getCourses,
  getFeaturedProducts,
  getGalleryImages,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  getPageContent,
  getSiteInfo,
} from "@/lib/data";

describe("data helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getSiteInfo maps global page content into site info", async () => {
    mockPrisma.pageContent.findMany.mockResolvedValue([
      { key: "site.name", value: "Barn Owl Pottery" },
      { key: "site.tagline", value: "Handmade ceramics" },
      { key: "site.email", value: "barnowlpottery@gmail.com" },
      { key: "site.story", value: "Studio story" },
    ]);

    const site = await getSiteInfo();

    expect(site).toEqual({
      name: "Barn Owl Pottery",
      tagline: "Handmade ceramics",
      email: "barnowlpottery@gmail.com",
      story: "Studio story",
    });
  });

  it("getPageContent merges stored values with defaults", async () => {
    mockPrisma.pageContent.findMany.mockResolvedValue([
      { key: "intro.heading", value: "Custom heading" },
    ]);

    const content = await getPageContent("shop");

    expect(content["intro.heading"]).toBe("Custom heading");
    expect(content["intro.label"]).toBe("Shop");
  });

  it("getProducts returns mapped products", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "p1",
        slug: "teal-bowl",
        title: "Teal Bowl",
        description: "Desc",
        price: 5500,
        category: "Bowls",
        available: true,
        featured: true,
        images: ["/images/teal-spiral-bowl.png"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const products = await getProducts();

    expect(products).toHaveLength(1);
    expect(products[0]?.slug).toBe("teal-bowl");
  });

  it("getFeaturedProducts filters featured items", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    await getFeaturedProducts();

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { featured: true },
      orderBy: { title: "asc" },
    });
  });

  it("getProductBySlug returns a single product", async () => {
    mockPrisma.product.findUnique.mockResolvedValue({
      id: "p1",
      slug: "teal-bowl",
      title: "Teal Bowl",
      description: "Desc",
      price: 5500,
      category: "Bowls",
      available: true,
      featured: false,
      images: ["/images/teal-spiral-bowl.png"],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await getProductBySlug("teal-bowl");

    expect(product?.title).toBe("Teal Bowl");
  });

  it("getProductsByCategory filters by category", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    await getProductsByCategory("Bowls");

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: {
        category: {
          equals: "Bowls",
          mode: "insensitive",
        },
      },
      orderBy: { title: "asc" },
    });
  });

  it("getGalleryImages returns mapped gallery images", async () => {
    mockPrisma.galleryImage.findMany.mockResolvedValue([
      {
        id: "g1",
        src: "/images/bowl-collection.png",
        alt: "Bowls",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const images = await getGalleryImages();

    expect(images[0]?.alt).toBe("Bowls");
  });

  it("getCourses and getCourseBySlug return mapped courses", async () => {
    const courseRecord = {
      id: "c1",
      slug: "wheel-throwing",
      title: "Wheel Throwing",
      description: "Learn wheel throwing",
      duration: "6 weeks",
      skillLevel: "Beginner",
      priceNote: "Contact for pricing",
      modules: [{ title: "Centering", lessons: ["Finding center"] }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.course.findMany.mockResolvedValue([courseRecord]);
    mockPrisma.course.findUnique.mockResolvedValue(courseRecord);

    const courses = await getCourses();
    const course = await getCourseBySlug("wheel-throwing");

    expect(courses[0]?.slug).toBe("wheel-throwing");
    expect(course?.title).toBe("Wheel Throwing");
  });
});
