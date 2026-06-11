"use client";

import { usePageEdit } from "@/components/admin/page-edit-context";
import type { PageId } from "@/lib/page-content-defaults";

type EditableTag = "p" | "h1" | "h2" | "h3" | "span";

type EditableTextProps = {
  page: PageId;
  contentKey: string;
  defaultValue: string;
  as?: EditableTag;
  className?: string;
};

export function EditableText({
  page,
  contentKey,
  defaultValue,
  as: Tag = "span",
  className = "",
}: EditableTextProps) {
  const { editMode, getValue, updateBlock, activeKey, setActiveKey } = usePageEdit();
  const value = getValue(page, contentKey, defaultValue);
  const blockId = `${page}:${contentKey}`;
  const isActive = activeKey === blockId;

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const editClassName = [
    className,
    "editable-text",
    isActive ? "editable-text-active" : "editable-text-idle",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={editClassName}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={`Edit ${contentKey}`}
      onFocus={() => setActiveKey(blockId)}
      onBlur={(event) => {
        const nextValue = event.currentTarget.textContent ?? "";
        updateBlock(page, contentKey, nextValue);
        setActiveKey(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && Tag !== "p") {
          event.preventDefault();
        }
        if (event.key === "Escape") {
          event.currentTarget.textContent = value;
          event.currentTarget.blur();
        }
      }}
    >
      {value}
    </Tag>
  );
}
