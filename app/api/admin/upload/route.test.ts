import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRequireAdmin, mockGetUploadSignature } = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockGetUploadSignature: vi.fn(),
}));

vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: mockRequireAdmin,
}));

vi.mock("@/lib/cloudinary", () => ({
  getUploadSignature: mockGetUploadSignature,
}));

import { POST } from "@/app/api/admin/upload/route";

describe("admin upload route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({
      session: { user: { id: "admin" } },
      error: null,
    });
  });

  it("returns signed upload params when Cloudinary is configured", async () => {
    mockGetUploadSignature.mockReturnValue({
      timestamp: 1234567890,
      signature: "signed-value",
      cloudName: "demo",
      apiKey: "key",
      folder: "barn-owl-pottery",
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.signature).toBe("signed-value");
    expect(data.folder).toBe("barn-owl-pottery");
  });

  it("returns 503 when Cloudinary is not configured", async () => {
    mockGetUploadSignature.mockReturnValue(null);

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toContain("Cloudinary");
  });
});
