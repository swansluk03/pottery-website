import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRequireAdmin, mockPrisma } = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockPrisma: {
    galleryImage: {
      findMany: vi.fn(),
      aggregate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: mockRequireAdmin,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

import { GET, POST } from "@/app/api/admin/gallery/route";
import { DELETE, PUT } from "@/app/api/admin/gallery/[id]/route";

describe("admin gallery routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({
      session: { user: { id: "admin" } },
      error: null,
    });
  });

  it("GET returns gallery images", async () => {
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

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].alt).toBe("Bowls");
  });

  it("POST creates a gallery image with next order", async () => {
    mockPrisma.galleryImage.aggregate.mockResolvedValue({ _max: { order: 2 } });
    mockPrisma.galleryImage.create.mockResolvedValue({
      id: "g2",
      src: "/images/new.png",
      alt: "New image",
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        src: "/images/new.png",
        alt: "New image",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.order).toBe(3);
  });

  it("PUT updates gallery alt text", async () => {
    mockPrisma.galleryImage.update.mockResolvedValue({
      id: "g1",
      src: "/images/bowl-collection.png",
      alt: "Updated alt",
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/admin/gallery/g1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        src: "/images/bowl-collection.png",
        alt: "Updated alt",
        order: 0,
      }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "g1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.alt).toBe("Updated alt");
  });

  it("DELETE removes a gallery image", async () => {
    mockPrisma.galleryImage.delete.mockResolvedValue({ id: "g1" });

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "g1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
