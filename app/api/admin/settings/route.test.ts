import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRequireAdmin, mockPrisma } = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockPrisma: {
    siteSetting: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: mockRequireAdmin,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

import { GET, PUT } from "@/app/api/admin/settings/route";

describe("admin settings routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({
      session: { user: { id: "admin" } },
      error: null,
    });
  });

  it("GET returns mapped site settings", async () => {
    mockPrisma.siteSetting.findMany.mockResolvedValue([
      { key: "name", value: "Barn Owl Pottery" },
      { key: "tagline", value: "Handmade ceramics" },
      { key: "email", value: "barnowlpottery@gmail.com" },
      { key: "story", value: "Studio story" },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Barn Owl Pottery");
  });

  it("PUT upserts site settings", async () => {
    mockPrisma.siteSetting.upsert.mockResolvedValue({});
    mockPrisma.siteSetting.findMany.mockResolvedValue([
      { key: "name", value: "Updated Name" },
      { key: "tagline", value: "Updated tagline" },
      { key: "email", value: "updated@example.com" },
      { key: "story", value: "Updated story" },
    ]);

    const request = new Request("http://localhost/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Updated Name",
        tagline: "Updated tagline",
        email: "updated@example.com",
        story: "Updated story",
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.email).toBe("updated@example.com");
    expect(mockPrisma.siteSetting.upsert).toHaveBeenCalledTimes(4);
  });
});
