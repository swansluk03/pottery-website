"use client";

import { useEffect, type ReactNode } from "react";
import { usePageEdit } from "@/components/admin/page-edit-context";
import type { PageId } from "@/lib/page-content-defaults";

type PageEditPageProps = {
  page: PageId;
  initialContent: Record<string, string>;
  children: ReactNode;
};

export function PageEditPage({ page, initialContent, children }: PageEditPageProps) {
  const { registerPage } = usePageEdit();

  useEffect(() => {
    registerPage(page, initialContent);
  }, [page, registerPage, initialContent]);

  return <>{children}</>;
}
