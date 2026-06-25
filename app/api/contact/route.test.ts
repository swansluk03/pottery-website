import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetSiteInfo, mockSendContactEmail } = vi.hoisted(() => ({
  mockGetSiteInfo: vi.fn(),
  mockSendContactEmail: vi.fn(),
}));

vi.mock("@/lib/data", () => ({
  getSiteInfo: mockGetSiteInfo,
}));

vi.mock("@/lib/email", () => ({
  sendContactEmail: mockSendContactEmail,
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
    mockSendContactEmail.mockResolvedValue({ ok: true, id: "email_123" });
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
    expect(mockSendContactEmail).toHaveBeenCalledOnce();
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
    expect(mockSendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 503 when Resend is not configured", async () => {
    mockSendContactEmail.mockResolvedValue({
      ok: false,
      status: 503,
      error:
        "Email is not configured yet. Set RESEND_API_KEY in your environment.",
    });

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

  it("returns 502 when Resend rejects the send", async () => {
    mockSendContactEmail.mockResolvedValue({
      ok: false,
      status: 502,
      error:
        "Unable to send your message right now. Please try again later or email us directly.",
    });

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

    expect(response.status).toBe(502);
    expect(data.error).toContain("Unable to send your message");
  });
});
