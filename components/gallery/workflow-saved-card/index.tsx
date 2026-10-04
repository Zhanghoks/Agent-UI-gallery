"use client";

import { useState } from "react";
import { PlayIcon, RefreshIcon } from "@/components/atoms/Icons";
import { WorkflowLamp, statusClass, type RunStatus } from "@/components/gallery/workflow-timeline";

/* A workflow kept for reuse. The card shows what it is (name, scope, one
 * description), how the last run went, and which arguments it takes. Run and
 * open are callbacks; without them the card is a quiet label. */

export type SavedWorkflowCardData = {
  id: string;
  name: string;
  scope: "project" | "global";
  description: string;
  /** Argument names, shown as chips. */
  args?: readonly string[];
  /** Absent means the workflow has never run. */
  lastRun?: { status: RunStatus; when: string };
};

export type SavedWorkflowCardLabels = {
  project: string;
  global: string;
  never: string;
  run: string;
  running: string;
  open: string;
  waiting: string;
  completed: string;
  failed: string;
  stopped: string;
  moreArgs: (count: number) => string;
};

export const SAVED_CARD_LABELS: SavedWorkflowCardLabels = {
  project: "Project",
  global: "Global",
  never: "Never run",
  run: "Run",
  running: "Running",
  open: "Open",
  waiting: "Waiting",
  completed: "Completed",
  failed: "Failed",
  stopped: "Stopped",
  moreArgs: (count) => `+${count}`,
};

const ARG_CHIPS = 3;

function lastRunWord(status: RunStatus, labels: SavedWorkflowCardLabels): string {
  if (status === "pending") return labels.waiting;
  if (status === "running") return labels.running;
  if (status === "completed") return labels.completed;
  if (status === "errored") return labels.failed;
  return labels.stopped;
}

export type SavedWorkflowCardProps = {
  workflow: SavedWorkflowCardData;
  /** True while a run started from this card is being created. Disables Run. */
  busy?: boolean;
  labels?: Partial<SavedWorkflowCardLabels>;
  onRun?: (id: string) => void;
  onOpen?: (id: string) => void;
};

export function SavedWorkflowCard({ workflow, busy, labels: labelOverrides, onRun, onOpen }: SavedWorkflowCardProps) {
  const labels = { ...SAVED_CARD_LABELS, ...labelOverrides };
  const args = workflow.args ?? [];
  const shown = args.slice(0, ARG_CHIPS);
  const hidden = args.length - shown.length;
  const last = workflow.lastRun;
  return (
    <div
      className={`flex min-h-[132px] w-full max-w-[340px] flex-col rounded-card bg-surface p-3 shadow-card ${onOpen ? "cursor-pointer hover:bg-inset" : ""}`}
      onClick={onOpen ? () => onOpen(workflow.id) : undefined}
      onKeyDown={onOpen ? (event) => event.key === "Enter" && onOpen(workflow.id) : undefined}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-[13px] font-medium text-ink">{workflow.name}</p>
          <p className="mt-0.5 text-[11px] text-ink-3">{workflow.scope === "project" ? labels.project : labels.global}</p>
        </div>
        {onRun ? (
          <button
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-hover-2 px-2.5 py-1 text-[12px] text-ink hover:bg-line-strong disabled:opacity-50"
            disabled={busy}
            onClick={(event) => {
              event.stopPropagation();
              onRun(workflow.id);
            }}
            type="button"
          >
            {busy ? <RefreshIcon className="animate-spin" size={12} /> : <PlayIcon size={12} />}
            {busy ? labels.running : labels.run}
          </button>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-ink-2">{workflow.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        {last ? (
          <span className={`inline-flex min-w-0 items-center gap-1.5 text-[11px] ${statusClass(last.status)}`}>
            <WorkflowLamp status={last.status} />
            <span className="truncate">
              {lastRunWord(last.status, labels)} · {last.when}
            </span>
          </span>
        ) : (
          <span className="text-[11px] text-ink-3">{labels.never}</span>
        )}
        {shown.length > 0 ? (
          <span className="flex min-w-0 shrink items-center gap-1">
            {shown.map((arg) => (
              <span className="truncate rounded-chip bg-inset px-1.5 py-0.5 font-mono text-[10.5px] text-ink-2" key={arg}>
                {arg}
              </span>
            ))}
            {hidden > 0 ? <span className="text-[10.5px] text-ink-3">{labels.moreArgs(hidden)}</span> : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const DEMO: SavedWorkflowCardData[] = [
  {
    id: "release-audit",
    name: "release-audit",
    scope: "project",
    description: "Scan a release diff with three parallel reviewers, fix what blocks, and write the report.",
    args: ["since", "fix"],
    lastRun: { status: "completed", when: "26m ago" },
  },
  {
    id: "deploy-staging",
    name: "deploy-staging",
    scope: "global",
    description: "Build, push and roll an image out to staging.",
    args: ["tag", "region", "dryRun", "notify"],
    lastRun: { status: "errored", when: "3h ago" },
  },
  {
    id: "dependency-sweep",
    name: "dependency-sweep",
    scope: "global",
    description: "Group outdated packages by risk and bump the safe ones.",
    lastRun: { status: "stopped", when: "yesterday" },
  },
];

export default function SavedWorkflowCardDemo({ variant }: { variant?: string }) {
  const [busyId, setBusyId] = useState<string>();
  const [note, setNote] = useState<string>();
  const never = variant === "Never run";
  const cards = never ? [{ ...DEMO[0]!, lastRun: undefined }] : DEMO;
  const run = (id: string) => {
    setBusyId(id);
    setNote(`Started ${id}`);
    setTimeout(() => setBusyId(undefined), 1500);
  };
  return (
    <div className="flex w-full flex-col items-center gap-3 pb-8">
      {cards.map((workflow) => (
        <SavedWorkflowCard
          busy={busyId === workflow.id}
          key={workflow.id}
          onOpen={(id) => setNote(`Opened ${id}`)}
          onRun={run}
          workflow={workflow}
        />
      ))}
      {note ? <p className="text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
