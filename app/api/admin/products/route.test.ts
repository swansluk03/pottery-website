import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRequireAdmin, mockPrisma } = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockPrisma: {
    product: {
      findMany: vi.fn(),
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

import { GET, POST } from "@/app/api/admin/products/route";
import { DELETE, PUT } from "@/app/api/admin/products/[id]/route";

describe("admin products routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({
      session: { user: { id: "admin" } },
      error: null,
    });
  });

  it("GET returns products for authenticated admin", async () => {
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

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].slug).toBe("teal-bowl");
  });

  it("GET rejects unauthenticated requests", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: null,
      error: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      }),
    });

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("POST creates a product", async () => {
    mockPrisma.product.create.mockResolvedValue({
      id: "p2",
      slug: "new-bowl",
      title: "New Bowl",
      description: "A new bowl",
      price: 4200,
      category: "Bowls",
      available: true,
      featured: false,
      images: ["/images/bowl-collection.png"],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Bowl",
        description: "A new bowl",
        price: 4200,
        category: "Bowls",
        available: true,
        images: ["/images/bowl-collection.png"],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.slug).toBe("new-bowl");
  });

  it("PUT updates a product", async () => {
    mockPrisma.product.update.mockResolvedValue({
      id: "p1",
      slug: "updated-bowl",
      title: "Updated Bowl",
      description: "Updated",
      price: 5000,
      category: "Bowls",
      available: true,
      featured: false,
      images: ["/images/bowl-collection.png"],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/admin/products/p1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Bowl",
        description: "Updated",
        price: 5000,
        category: "Bowls",
        available: true,
        images: ["/images/bowl-collection.png"],
      }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "p1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe("Updated Bowl");
  });

  it("DELETE removes a product", async () => {
    mockPrisma.product.delete.mockResolvedValue({ id: "p1" });

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "p1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
