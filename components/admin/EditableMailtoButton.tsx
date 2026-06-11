"use client";

import { EditableText } from "@/components/admin/EditableText";
import { usePageEdit } from "@/components/admin/page-edit-context";
import { Button } from "@/components/ui/Button";
import type { PageId } from "@/lib/page-content-defaults";

type EditableMailtoButtonProps = {
  page: PageId;
  labelKey: string;
  defaultLabel: string;
  className?: string;
};

export function EditableMailtoButton({
  page,
  labelKey,
  defaultLabel,
  className = "",
}: EditableMailtoButtonProps) {
  const { getValue } = usePageEdit();
  const email = getValue("global", "site.email", "barnowlpottery@gmail.com");

  return (
    <a href={`mailto:${email}`}>
      <Button variant="secondary" className={className}>
        <EditableText page={page} contentKey={labelKey} defaultValue={defaultLabel} as="span" />
      </Button>
    </a>
  );
}
