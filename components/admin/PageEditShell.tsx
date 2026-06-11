"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageEditProvider } from "@/components/admin/page-edit-context";
import { PageEditToolbar } from "@/components/admin/PageEditToolbar";

type PageEditShellProps = {
  children: ReactNode;
  initialGlobalContent: Record<string, string>;
};

function PageEditShellInner({ children, initialGlobalContent }: PageEditShellProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const wantsEdit = searchParams.get("edit") === "true";
  const [editMode, setEditMode] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!wantsEdit) {
      setEditMode(false);
      setVerified(false);
      return;
    }

    let cancelled = false;

    async function verifyAdmin() {
      const response = await fetch("/api/admin/me");
      if (cancelled) {
        return;
      }

      if (!response.ok) {
        const callbackUrl = encodeURIComponent(`${pathname}?edit=true`);
        router.replace(`/admin/login?callbackUrl=${callbackUrl}`);
        return;
      }

      setEditMode(true);
      setVerified(true);
    }

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [wantsEdit, pathname, router]);

  if (wantsEdit && !verified) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-stone-500">
        Checking admin access…
      </div>
    );
  }

  return (
    <PageEditProvider editMode={editMode} initialGlobalContent={initialGlobalContent}>
      {editMode && (
        <div className="border-b border-teal-700 bg-teal-900 px-4 py-2 text-center text-sm text-teal-100">
          Page text editing is on — click highlighted text to change it
        </div>
      )}
      {children}
      <PageEditToolbar />
      {editMode && <div className="h-24" aria-hidden />}
    </PageEditProvider>
  );
}

function PageEditShellFallback({
  children,
  initialGlobalContent,
}: PageEditShellProps) {
  return (
    <PageEditProvider editMode={false} initialGlobalContent={initialGlobalContent}>
      {children}
    </PageEditProvider>
  );
}

export function PageEditShell(props: PageEditShellProps) {
  return (
    <Suspense fallback={<PageEditShellFallback {...props} />}>
      <PageEditShellInner {...props} />
    </Suspense>
  );
}
