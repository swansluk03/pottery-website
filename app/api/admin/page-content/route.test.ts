import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRequireAdmin, mockPrisma, mockRevalidatePath } = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockPrisma: {
    pageContent: {
      upsert: vi.fn(),
    },
  },
  mockRevalidatePath: vi.fn(),
}));

vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: mockRequireAdmin,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

import { PUT } from "@/app/api/admin/page-content/route";

describe("admin page content routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({
      session: { user: { id: "admin" } },
      error: null,
    });
    mockPrisma.pageContent.upsert.mockResolvedValue({});
  });

  it("PUT upserts page content blocks", async () => {
    const request = new Request("http://localhost/api/admin/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: [
          {
            page: "home",
            blocks: {
              "hero.location": "Updated City",
            },
          },
        ],
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockPrisma.pageContent.upsert).toHaveBeenCalledWith({
      where: { page_key: { page: "home", key: "hero.location" } },
      create: { page: "home", key: "hero.location", value: "Updated City" },
      update: { value: "Updated City" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
  });
});
