"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { PageId } from "@/lib/page-content-defaults";

type PageContentState = Partial<Record<PageId, Record<string, string>>>;

type PageEditContextValue = {
  editMode: boolean;
  content: PageContentState;
  dirtyPages: Set<PageId>;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
  registerPage: (page: PageId, initial: Record<string, string>) => void;
  getValue: (page: PageId, key: string, defaultValue: string) => string;
  updateBlock: (page: PageId, key: string, value: string) => void;
  save: () => Promise<void>;
  cancel: () => void;
  exitEdit: () => void;
  isSaving: boolean;
  error: string | null;
};

const PageEditContext = createContext<PageEditContextValue | null>(null);

export function usePageEdit() {
  const context = useContext(PageEditContext);
  if (!context) {
    throw new Error("usePageEdit must be used within PageEditProvider");
  }
  return context;
}

type PageEditProviderProps = {
  children: ReactNode;
  editMode: boolean;
  initialGlobalContent: Record<string, string>;
};

export function PageEditProvider({
  children,
  editMode,
  initialGlobalContent,
}: PageEditProviderProps) {
  const router = useRouter();
  const [content, setContent] = useState<PageContentState>({
    global: initialGlobalContent,
  });
  const [originalContent, setOriginalContent] = useState<PageContentState>({
    global: initialGlobalContent,
  });
  const [dirtyPages, setDirtyPages] = useState<Set<PageId>>(new Set());
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPage = useCallback((page: PageId, initial: Record<string, string>) => {
    setContent((current) => ({
      ...current,
      [page]: initial,
    }));
    setOriginalContent((current) => ({
      ...current,
      [page]: initial,
    }));
  }, []);

  const getValue = useCallback(
    (page: PageId, key: string, defaultValue: string) => {
      return content[page]?.[key] ?? defaultValue;
    },
    [content]
  );

  const updateBlock = useCallback((page: PageId, key: string, value: string) => {
    setContent((current) => ({
      ...current,
      [page]: {
        ...current[page],
        [key]: value,
      },
    }));
    setDirtyPages((current) => new Set(current).add(page));
    setError(null);
  }, []);

  const save = useCallback(async () => {
    if (dirtyPages.size === 0) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updates = Array.from(dirtyPages).map((page) => ({
        page,
        blocks: content[page] ?? {},
      }));

      const response = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save changes");
      }

      setOriginalContent(content);
      setDirtyPages(new Set());
      router.refresh();
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Failed to save changes";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [content, dirtyPages, router]);

  const cancel = useCallback(() => {
    setContent(originalContent);
    setDirtyPages(new Set());
    setActiveKey(null);
    setError(null);
  }, [originalContent]);

  const exitEdit = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    router.push(url.pathname + url.search);
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      editMode,
      content,
      dirtyPages,
      activeKey,
      setActiveKey,
      registerPage,
      getValue,
      updateBlock,
      save,
      cancel,
      exitEdit,
      isSaving,
      error,
    }),
    [
      editMode,
      content,
      dirtyPages,
      activeKey,
      registerPage,
      getValue,
      updateBlock,
      save,
      cancel,
      exitEdit,
      isSaving,
      error,
    ]
  );

  return (
    <PageEditContext.Provider value={value}>{children}</PageEditContext.Provider>
  );
}
