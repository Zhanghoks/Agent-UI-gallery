"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertIcon, ChartIcon, CloseIcon, FileIcon, MarkdownIcon, TableIcon, type IconProps } from "@/components/atoms/Icons";

/* Chips for files on a message. An upload shows a bar under the name; a failed
 * one says so in words and offers a retry. Removing is a callback. The host
 * does the uploading — this view only draws what it is told. */

export type AttachmentKind = "file" | "markdown" | "image" | "table";

export type Attachment = {
  id: string;
  name: string;
  kind: AttachmentKind;
  /** Already formatted, e.g. "42 kB". */
  size?: string;
  /** 0–1 while uploading. */
  progress?: number;
  error?: string;
};

export type AttachmentTrayLabels = { remove: string; retry: string };

export const ATTACHMENT_LABELS: AttachmentTrayLabels = { remove: "Remove", retry: "Retry" };

const ICON: Record<AttachmentKind, (props: IconProps) => ReactNode> = {
  file: FileIcon,
  markdown: MarkdownIcon,
  image: ChartIcon,
  table: TableIcon,
};

export type AttachmentTrayProps = {
  items: readonly Attachment[];
  labels?: Partial<AttachmentTrayLabels>;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
};

export function AttachmentTray({ items, labels: labelOverrides, onRemove, onRetry }: AttachmentTrayProps) {
  const labels = { ...ATTACHMENT_LABELS, ...labelOverrides };
  if (items.length === 0) return null;
  return (
    <ul className="flex w-full max-w-[460px] flex-wrap gap-1.5">
      {items.map((item) => {
        const Icon = item.error ? AlertIcon : ICON[item.kind];
        const uploading = item.progress !== undefined && item.progress < 1 && !item.error;
        return (
          <li
            className={`relative flex max-w-[210px] items-center gap-2 overflow-hidden rounded-control py-1.5 pl-2 pr-1.5 shadow-btn ${item.error ? "bg-red-tint" : "bg-surface"}`}
            key={item.id}
          >
            <span className={`grid size-6 shrink-0 place-items-center rounded-chip ${item.error ? "text-red" : "bg-inset text-ink-2"}`}>
              <Icon size={13} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] text-ink">{item.name}</span>
              <span className={`block truncate text-[10.5px] ${item.error ? "text-red" : "text-ink-3"}`}>{item.error ?? item.size ?? ""}</span>
            </span>
            {item.error && onRetry ? (
              <button className="shrink-0 rounded-full px-1.5 text-[11px] text-ink-2 hover:bg-hover-2" onClick={() => onRetry(item.id)} type="button">
                {labels.retry}
              </button>
            ) : null}
            {onRemove ? (
              <button
                aria-label={`${labels.remove} ${item.name}`}
                className="grid size-5 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-hover-2 hover:text-ink"
                onClick={() => onRemove(item.id)}
                type="button"
              >
                <CloseIcon size={11} />
              </button>
            ) : null}
            {uploading ? (
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line">
                <span className="block h-full bg-accent transition-[width]" style={{ width: `${Math.round((item.progress ?? 0) * 100)}%` }} />
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function AttachmentTrayDemo() {
  const [progress, setProgress] = useState(0.1);
  const [items, setItems] = useState<Attachment[]>([
    { id: "1", name: "requirements.md", kind: "markdown", size: "4.2 kB", progress: 1 },
    { id: "2", name: "orders-2026-09.csv", kind: "table", size: "1.8 MB" },
    { id: "3", name: "screenshot.png", kind: "image", error: "Upload failed" },
    { id: "4", name: "design-notes.pdf", kind: "file", size: "620 kB", progress: 0.1 },
  ]);
  useEffect(() => {
    if (progress >= 1) return;
    const timer = setTimeout(() => setProgress((value) => Math.min(1, value + 0.12)), 450);
    return () => clearTimeout(timer);
  }, [progress]);
  const shown = items.map((item) => (item.id === "4" ? { ...item, progress } : item));
  return (
    <div className="w-full pb-8">
      <AttachmentTray
        items={shown}
        onRemove={(id) => setItems((list) => list.filter((item) => item.id !== id))}
        onRetry={(id) => setItems((list) => list.map((item) => (item.id === id ? { ...item, error: undefined, size: "96 kB" } : item)))}
      />
    </div>
  );
}
