import { describe, expect, it } from "vitest";
import {
  contactSchema,
  courseSchema,
  galleryImageSchema,
  productSchema,
  siteSettingsSchema,
} from "@/lib/validations";

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "Kim Swanson",
      email: "kim@example.com",
      type: "general",
      message: "Hello, I have a question about your pottery.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short messages", () => {
    const result = contactSchema.safeParse({
      name: "Kim",
      email: "kim@example.com",
      type: "general",
      message: "Hi",
    });

    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  it("accepts valid product data", () => {
    const result = productSchema.safeParse({
      title: "Teal Bowl",
      description: "A beautiful hand-thrown bowl.",
      price: 5500,
      category: "Bowls",
      available: true,
      featured: true,
      images: ["/images/teal-spiral-bowl.png"],
    });

    expect(result.success).toBe(true);
  });

  it("requires at least one image", () => {
    const result = productSchema.safeParse({
      title: "Teal Bowl",
      description: "A beautiful hand-thrown bowl.",
      price: 5500,
      category: "Bowls",
      available: true,
      images: [],
    });

    expect(result.success).toBe(false);
  });
});

describe("galleryImageSchema", () => {
  it("accepts valid gallery image data", () => {
    const result = galleryImageSchema.safeParse({
      src: "/images/bowl-collection.png",
      alt: "Collection of bowls",
      order: 0,
    });

    expect(result.success).toBe(true);
  });
});

describe("courseSchema", () => {
  it("accepts valid course data", () => {
    const result = courseSchema.safeParse({
      title: "Wheel Throwing Foundations",
      description: "Learn the basics of wheel throwing.",
      duration: "6 weeks",
      skillLevel: "Beginner",
      priceNote: "Contact for pricing",
      modules: [{ title: "Centering", lessons: ["Finding center"] }],
    });

    expect(result.success).toBe(true);
  });
});

describe("siteSettingsSchema", () => {
  it("accepts valid site settings", () => {
    const result = siteSettingsSchema.safeParse({
      name: "Barn Owl Pottery",
      tagline: "Handmade ceramics by Kim Swanson",
      email: "barnowlpottery@gmail.com",
      story: "A small studio in Olympia, WA.",
    });

    expect(result.success).toBe(true);
  });
});
