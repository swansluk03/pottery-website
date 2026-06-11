"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { InquiryType } from "@/types";

const inquiryOptions: { value: InquiryType; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "purchase", label: "Purchase a piece" },
  { value: "class", label: "Classes or workshops" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const defaultType = (searchParams.get("type") as InquiryType) ?? "general";
  const defaultSubject = searchParams.get("subject") ?? "";
  const defaultMessage = searchParams.get("message") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<InquiryType>(
    inquiryOptions.some((option) => option.value === defaultType)
      ? defaultType
      : "general"
  );
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, type, subject, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
        <h2 className="font-serif text-2xl">Message sent</h2>
        <p className="mt-2 text-sm">
          Thanks for reaching out. I&apos;ll get back to you by email soon.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-900"
          required
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-900"
          required
        />
      </div>

      <select
        value={type}
        onChange={(event) => setType(event.target.value as InquiryType)}
        className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-900"
      >
        {inquiryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Subject (optional)"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-900"
      />

      <textarea
        placeholder="Tell me what you're interested in..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="min-h-36 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-900"
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
