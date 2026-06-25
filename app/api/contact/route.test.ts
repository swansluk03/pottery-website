import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetSiteInfo, mockSend } = vi.hoisted(() => ({
  mockGetSiteInfo: vi.fn(),
  mockSend: vi.fn(),
}));

vi.mock("@/lib/data", () => ({
  getSiteInfo: mockGetSiteInfo,
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: mockSend,
    };
  },
}));

import { POST } from "@/app/api/contact/route";

describe("contact route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSiteInfo.mockResolvedValue({
      name: "Barn Owl Pottery",
      tagline: "Handmade ceramics",
      email: "barnowlpottery@gmail.com",
      story: "Studio story",
    });
    mockSend.mockResolvedValue({ id: "email_123" });
    process.env.RESEND_API_KEY = "test_key";
    process.env.CONTACT_EMAIL = "contact@example.com";
  });

  it("sends a contact email for valid input", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kim Swanson",
        email: "kim@example.com",
        type: "general",
        message: "Hello, I would like to learn more about your classes.",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid input", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "",
        email: "not-an-email",
        type: "general",
        message: "short",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 503 when Resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kim Swanson",
        email: "kim@example.com",
        type: "general",
        message: "Hello, I would like to learn more about your classes.",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toContain("Email is not configured");
  });
});
