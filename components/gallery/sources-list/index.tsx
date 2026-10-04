"use client";

import { useState } from "react";
import { ChevronDownIcon, LinkIcon } from "@/components/atoms/Icons";

/* The pages behind an answer. Folded, it is one line with a count; open, it is a
 * numbered list. The numbers are the ones an answer cites inline. Open a source
 * with the host's callback; without it the row is plain text. */

export type Source = { id: string; title: string; domain: string; snippet?: string };

export type SourcesListLabels = { title: (count: number) => string };

export const SOURCES_LABELS: SourcesListLabels = {
  title: (count) => (count === 1 ? "Used 1 source" : `Used ${count} sources`),
};

export type SourcesListProps = {
  sources: readonly Source[];
  open?: boolean;
  labels?: Partial<SourcesListLabels>;
  onOpenSource?: (id: string) => void;
};

export function SourcesList({ sources, open: initiallyOpen = false, labels: labelOverrides, onOpenSource }: SourcesListProps) {
  const labels = { ...SOURCES_LABELS, ...labelOverrides };
  const [open, setOpen] = useState(initiallyOpen);
  if (sources.length === 0) return null;
  return (
    <div className="w-full max-w-[420px] rounded-card bg-surface p-2 shadow-card">
      <button
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-control px-2 py-1 text-left hover:bg-hover"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <LinkIcon className="text-ink-3" size={13} />
        <span className="flex-1 text-[12.5px] text-ink">{labels.title(sources.length)}</span>
        <ChevronDownIcon className={`text-ink-3 transition-transform ${open ? "rotate-180" : ""}`} size={13} />
      </button>
      {open ? (
        <ol className="mt-1">
          {sources.map((source, index) => {
            const body = (
              <>
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-inset font-mono text-[10.5px] text-ink-2">{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] text-ink">{source.title}</span>
                  <span className="block truncate text-[11px] text-ink-3">{source.domain}</span>
                  {source.snippet ? <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-snug text-ink-2">{source.snippet}</span> : null}
                </span>
              </>
            );
            return (
              <li key={source.id}>
                {onOpenSource ? (
                  <button className="flex w-full items-start gap-2.5 rounded-control px-2 py-1.5 text-left hover:bg-hover" onClick={() => onOpenSource(source.id)} type="button">
                    {body}
                  </button>
                ) : (
                  <div className="flex items-start gap-2.5 px-2 py-1.5">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

const SOURCES: Source[] = [
  { id: "1", title: "Server-sent events — MDN Web Docs", domain: "developer.mozilla.org", snippet: "Server-sent events let a server push updates to a page over one long-lived HTTP connection." },
  { id: "2", title: "Route Handlers — Next.js", domain: "nextjs.org", snippet: "Route Handlers return a standard Response, including a streaming one." },
  { id: "3", title: "Backpressure in streams", domain: "streams.spec.whatwg.org" },
];

export default function SourcesListDemo() {
  const [note, setNote] = useState<string>();
  return (
    <div className="flex w-full flex-col items-center gap-2 pb-8">
      <SourcesList onOpenSource={(id) => setNote(`Opened source ${id}`)} open sources={SOURCES} />
      {note ? <p className="text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
