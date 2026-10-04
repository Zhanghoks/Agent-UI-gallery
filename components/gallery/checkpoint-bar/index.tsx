"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FlagIcon, UndoIcon } from "@/components/atoms/Icons";

/* A marker the agent drops before it changes files. Restoring is destructive,
 * so the button asks once in place before it calls back. After a restore the
 * bar says so and stops offering it. */

export type CheckpointBarLabels = {
  restore: string;
  confirm: string;
  cancel: string;
  restored: string;
  changes: (count: number) => string;
};

export const CHECKPOINT_LABELS: CheckpointBarLabels = {
  restore: "Restore",
  confirm: "Discard later changes and restore?",
  cancel: "Cancel",
  restored: "Restored",
  changes: (count) => (count === 1 ? "1 file changed since" : `${count} files changed since`),
};

export type CheckpointBarProps = {
  /** Already formatted, e.g. "12:04". */
  time: string;
  label?: string;
  changedFiles?: number;
  restored?: boolean;
  labels?: Partial<CheckpointBarLabels>;
  onRestore?: () => void;
};

export function CheckpointBar({ time, label, changedFiles, restored, labels: labelOverrides, onRestore }: CheckpointBarProps) {
  const labels = { ...CHECKPOINT_LABELS, ...labelOverrides };
  const [asking, setAsking] = useState(false);
  return (
    <div className="flex w-full max-w-[460px] items-center gap-3 text-[11px] text-ink-3">
      <span className="h-px flex-1 bg-line" />
      <span className="inline-flex shrink-0 items-center gap-1.5">
        <FlagIcon size={12} />
        <span className="text-ink-2">{label ?? "Checkpoint"}</span>
        <span className="font-mono">{time}</span>
        {changedFiles !== undefined && changedFiles > 0 ? <span>· {labels.changes(changedFiles)}</span> : null}
      </span>
      {restored ? (
        <span className="shrink-0 text-green">{labels.restored}</span>
      ) : onRestore ? (
        asking ? (
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="text-ink-2">{labels.confirm}</span>
            <Button
              onClick={() => {
                setAsking(false);
                onRestore();
              }}
              size="xs"
              variant="primary"
            >
              {labels.restore}
            </Button>
            <Button onClick={() => setAsking(false)} size="xs" variant="quiet">
              {labels.cancel}
            </Button>
          </span>
        ) : (
          <button
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-ink-2 hover:bg-hover-2"
            onClick={() => setAsking(true)}
            type="button"
          >
            <UndoIcon size={11} />
            {labels.restore}
          </button>
        )
      ) : null}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function CheckpointBarDemo() {
  const [restored, setRestored] = useState(false);
  return (
    <div className="w-full pb-8">
      <CheckpointBar changedFiles={4} onRestore={() => setRestored(true)} restored={restored} time="12:04" />
    </div>
  );
}
