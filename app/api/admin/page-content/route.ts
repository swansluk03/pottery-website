import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { PUBLIC_PATHS, type PageId } from "@/lib/page-content-defaults";
import { pageContentBatchSchema } from "@/lib/validations";

function revalidatePages(pages: string[]) {
  const paths = new Set<string>();

  for (const page of pages) {
    const path = PUBLIC_PATHS[page as PageId];
    if (path) {
      paths.add(path);
    }
  }

  paths.add("/");

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const { updates } = pageContentBatchSchema.parse(body);

    await Promise.all(
      updates.flatMap(({ page, blocks }) =>
        Object.entries(blocks).map(([key, value]) =>
          prisma.pageContent.upsert({
            where: { page_key: { page, key } },
            create: { page, key, value },
            update: { value },
          })
        )
      )
    );

    revalidatePages(updates.map((update) => update.page));

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update page content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
