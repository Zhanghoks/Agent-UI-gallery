"use client";

import { useState } from "react";
import { RefreshIcon } from "@/components/atoms/Icons";
import { WorkflowLamp, statusClass, type RunStatus } from "@/components/gallery/workflow-timeline";

/* The run directory: runs still going on top, ended runs under them.
 * Figures that are not known draw a dash, never a zero. A row opens only
 * when the host gives onOpenRun; Resume only shows on a resumable row. */

export type RunHistoryRow = {
  id: string;
  name: string;
  status: RunStatus;
  /** Already formatted, e.g. "3h ago". */
  when: string;
  duration?: string;
  tokens?: string;
  actors?: string;
  resumable?: boolean;
};

export type RunHistoryLabels = {
  running: string;
  earlier: string;
  empty: string;
  truncated: (count: number) => string;
  resume: string;
  duration: string;
  tokens: string;
  actors: string;
  missing: string;
  waiting: string;
  runningWord: string;
  completed: string;
  failed: string;
  stopped: string;
};

export const RUN_HISTORY_LABELS: RunHistoryLabels = {
  running: "Running",
  earlier: "Earlier",
  empty: "No runs yet.",
  truncated: (count) => `Showing the latest ${count}.`,
  resume: "Resume",
  duration: "Time",
  tokens: "Tokens",
  actors: "Actors",
  missing: "—",
  waiting: "Waiting",
  runningWord: "Running",
  completed: "Completed",
  failed: "Failed",
  stopped: "Stopped",
};

const isLive = (status: RunStatus) => status === "pending" || status === "running";

function word(status: RunStatus, labels: RunHistoryLabels): string {
  if (status === "pending") return labels.waiting;
  if (status === "running") return labels.runningWord;
  if (status === "completed") return labels.completed;
  if (status === "errored") return labels.failed;
  return labels.stopped;
}

function Row({
  row,
  labels,
  onOpenRun,
  onResume,
}: {
  row: RunHistoryRow;
  labels: RunHistoryLabels;
  onOpenRun?: (id: string) => void;
  onResume?: (id: string) => void;
}) {
  const figure = (value?: string) => (value && value !== "" ? value : labels.missing);
  return (
    <div
      className={`group flex items-center gap-3 rounded-control px-2 py-1.5 ${onOpenRun ? "cursor-pointer hover:bg-hover" : ""}`}
      onClick={onOpenRun ? () => onOpenRun(row.id) : undefined}
      onKeyDown={onOpenRun ? (event) => event.key === "Enter" && onOpenRun(row.id) : undefined}
      role={onOpenRun ? "button" : undefined}
      tabIndex={onOpenRun ? 0 : undefined}
    >
      <WorkflowLamp status={row.status} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-ink">{row.name}</p>
        <p className={`text-[11px] ${statusClass(row.status)}`}>
          {word(row.status, labels)} <span className="text-ink-3">· {row.when}</span>
        </p>
      </div>
      <dl className="hidden shrink-0 items-center gap-3 font-mono text-[11px] text-ink-2 sm:flex">
        <div title={labels.duration}>{figure(row.duration)}</div>
        <div title={labels.tokens}>{figure(row.tokens)}</div>
        <div title={labels.actors}>{figure(row.actors)}</div>
      </dl>
      {row.resumable && onResume ? (
        <button
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-ink-2 hover:bg-hover-2"
          onClick={(event) => {
            event.stopPropagation();
            onResume(row.id);
          }}
          type="button"
        >
          <RefreshIcon size={11} />
          {labels.resume}
        </button>
      ) : null}
    </div>
  );
}

export type WorkflowRunHistoryProps = {
  runs: readonly RunHistoryRow[];
  /** True when the list was cut at `limit`. */
  truncatedAt?: number;
  labels?: Partial<RunHistoryLabels>;
  onOpenRun?: (id: string) => void;
  onResume?: (id: string) => void;
};

export function WorkflowRunHistory({ runs, truncatedAt, labels: labelOverrides, onOpenRun, onResume }: WorkflowRunHistoryProps) {
  const labels = { ...RUN_HISTORY_LABELS, ...labelOverrides };
  const live = runs.filter((run) => isLive(run.status));
  const ended = runs.filter((run) => !isLive(run.status));
  const section = (title: string, rows: RunHistoryRow[]) =>
    rows.length === 0 ? null : (
      <section>
        <h3 className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-ink-3">{title}</h3>
        {rows.map((row) => (
          <Row key={row.id} labels={labels} onOpenRun={onOpenRun} onResume={onResume} row={row} />
        ))}
      </section>
    );
  return (
    <div className="w-full max-w-[520px] rounded-card bg-surface p-2 shadow-card">
      {runs.length === 0 ? <p className="px-2 py-6 text-center text-[12px] text-ink-3">{labels.empty}</p> : null}
      {section(labels.running, live)}
      {section(labels.earlier, ended)}
      {truncatedAt ? <p className="px-2 pt-2 text-[11px] text-ink-3">{labels.truncated(truncatedAt)}</p> : null}
    </div>
  );
}

const DEMO_RUNS: RunHistoryRow[] = [
  { id: "a", name: "db-migration", status: "running", when: "just now", tokens: "41.7k", actors: "4" },
  { id: "b", name: "release-audit", status: "completed", when: "26m ago", duration: "3m 29s", tokens: "196.7k", actors: "6" },
  { id: "c", name: "deploy-staging", status: "errored", when: "3h ago", duration: "2m 47s", tokens: "27.9k", actors: "2", resumable: true },
  { id: "d", name: "dependency-sweep", status: "stopped", when: "yesterday", duration: "36s", tokens: "15.3k", actors: "2", resumable: true },
  { id: "e", name: "weekly-digest", status: "completed", when: "6d ago", duration: "47s", actors: "2" },
];

export default function WorkflowRunHistoryDemo({ variant }: { variant?: string }) {
  const [note, setNote] = useState<string>();
  return (
    <div className="w-full pb-8">
      <WorkflowRunHistory
        onOpenRun={(id) => setNote(`Opened run ${id}`)}
        onResume={(id) => setNote(`Resumed run ${id}`)}
        runs={variant === "Empty" ? [] : DEMO_RUNS}
      />
      {note ? <p className="mt-2 text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
