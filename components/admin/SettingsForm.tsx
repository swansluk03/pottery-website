"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteInfo } from "@/types";
import { Button } from "@/components/ui/Button";

type SettingsFormProps = {
  settings: SiteInfo;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [email, setEmail] = useState(settings.email);
  const [story, setStory] = useState(settings.story);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, tagline, email, story }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Failed to save settings");
      setSaving(false);
      return;
    }

    router.refresh();
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-stone-700">Site name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Tagline</label>
        <input
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Contact email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">About story</label>
        <textarea
          value={story}
          onChange={(event) => setStory(event.target.value)}
          required
          rows={6}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save site text"}
      </Button>
    </form>
  );
}
