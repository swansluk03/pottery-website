"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

function isSafeRedirect(url: string) {
  return url.startsWith("/") && !url.startsWith("//");
}

function getSafeRedirectUrl(callbackUrl: string | null) {
  if (callbackUrl && isSafeRedirect(callbackUrl)) {
    return callbackUrl;
  }

  return "/admin";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(getSafeRedirectUrl(params.get("callbackUrl")));
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((session) => {
        if (session?.user) {
          router.replace(callbackUrl);
        }
      });
  }, [router, callbackUrl]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f3ef] px-4">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-teal-700 font-medium">
          Barn Owl Pottery
        </p>
        <h1 className="mt-2 font-serif text-3xl text-stone-900">Admin login</h1>
        <p className="mt-3 text-sm text-stone-600">
          Sign in to manage shop items, gallery images, classes, and page text.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
