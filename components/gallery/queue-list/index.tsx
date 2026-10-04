"use client";

import { useState } from "react";
import { ArrowUpIcon, CloseIcon, ClockIcon } from "@/components/atoms/Icons";

/* Follow-ups typed while the agent is busy. They send in order when it is
 * free; each can jump the line or be taken back. Order and contents belong to
 * the host. */

export type QueuedMessage = { id: string; text: string };

export type QueueListLabels = {
  title: (count: number) => string;
  sendNow: string;
  remove: string;
};

export const QUEUE_LABELS: QueueListLabels = {
  title: (count) => (count === 1 ? "1 message queued" : `${count} messages queued`),
  sendNow: "Send now",
  remove: "Remove",
};

export type QueueListProps = {
  items: readonly QueuedMessage[];
  labels?: Partial<QueueListLabels>;
  onSendNow?: (id: string) => void;
  onRemove?: (id: string) => void;
};

export function QueueList({ items, labels: labelOverrides, onSendNow, onRemove }: QueueListProps) {
  const labels = { ...QUEUE_LABELS, ...labelOverrides };
  if (items.length === 0) return null;
  return (
    <div className="w-full max-w-[420px] rounded-card bg-surface p-2 shadow-card">
      <p className="flex items-center gap-1.5 px-2 pb-1 pt-0.5 text-[11px] text-ink-3">
        <ClockIcon size={12} />
        {labels.title(items.length)}
      </p>
      <ul>
        {items.map((item) => (
          <li className="group flex items-center gap-2 rounded-control px-2 py-1.5 hover:bg-hover" key={item.id}>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{item.text}</span>
            {onSendNow ? (
              <button
                aria-label={labels.sendNow}
                className="grid size-6 place-items-center rounded-full text-ink-2 opacity-0 hover:bg-hover-2 focus-visible:opacity-100 group-hover:opacity-100"
                onClick={() => onSendNow(item.id)}
                title={labels.sendNow}
                type="button"
              >
                <ArrowUpIcon size={13} />
              </button>
            ) : null}
            {onRemove ? (
              <button
                aria-label={labels.remove}
                className="grid size-6 place-items-center rounded-full text-ink-2 opacity-0 hover:bg-hover-2 focus-visible:opacity-100 group-hover:opacity-100"
                onClick={() => onRemove(item.id)}
                title={labels.remove}
                type="button"
              >
                <CloseIcon size={13} />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

const SEED: QueuedMessage[] = [
  { id: "1", text: "Also update the changelog" },
  { id: "2", text: "Then open a PR against main" },
  { id: "3", text: "Tag the release once CI is green" },
];

export default function QueueListDemo() {
  const [items, setItems] = useState(SEED);
  const [note, setNote] = useState<string>();
  return (
    <div className="flex w-full flex-col items-center gap-2 pb-8">
      {items.length > 0 ? (
        <QueueList
          items={items}
          onRemove={(id) => setItems((list) => list.filter((item) => item.id !== id))}
          onSendNow={(id) => {
            setNote(`Sent “${items.find((item) => item.id === id)?.text}”`);
            setItems((list) => list.filter((item) => item.id !== id));
          }}
        />
      ) : (
        <button className="rounded-full bg-hover-2 px-3 py-1 text-[12px] text-ink" onClick={() => setItems(SEED)} type="button">
          Refill
        </button>
      )}
      {note ? <p className="text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
