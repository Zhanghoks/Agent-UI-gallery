"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BranchIcon, ChevronRightIcon, DiamondIcon, FileIcon, SearchIcon, TerminalIcon, type IconProps } from "@/components/atoms/Icons";

/* Script transcript for one workflow phase. Read rows are a summary only.
 * Other rows expand to a body the host provides. A running row says "now"
 * instead of a frozen offset. Expand state stays with the caller. */

export type LogKind = "read" | "search" | "git" | "terminal" | "step";
export type LogStatus = "pending" | "running" | "done" | "failed";

export type WorkspaceLogEntry = {
  id: string;
  kind: LogKind;
  status: LogStatus;
  verb: string;
  object: string;
  results?: string[];
  /** Relative to the first row, e.g. "+1:12". Replaced while the row is running. */
  offset?: string;
  body?: ReactNode;
};

export type WorkspaceLogLabels = {
  now: string;
  read: string;
  search: string;
  git: string;
  terminal: string;
  step: string;
};

export const WORKSPACE_LOG_LABELS: WorkspaceLogLabels = {
  now: "now",
  read: "Read",
  search: "Search",
  git: "Git",
  terminal: "Terminal",
  step: "Step",
};

const KIND_ICON: Record<LogKind, (props: IconProps) => ReactNode> = {
  read: FileIcon,
  search: SearchIcon,
  git: BranchIcon,
  terminal: TerminalIcon,
  step: DiamondIcon,
};

function tileClass(status: LogStatus): string {
  if (status === "failed") return "bg-red-tint text-red";
  if (status === "running") return "bg-orange-tint text-orange";
  return "bg-inset text-ink-2";
}

function LogRow({
  entry,
  labels,
  open,
  onToggle,
}: {
  entry: WorkspaceLogEntry;
  labels: WorkspaceLogLabels;
  open: boolean;
  onToggle?: (id: string) => void;
}) {
  const Icon = KIND_ICON[entry.kind];
  const expandable = entry.kind !== "read" && entry.body !== undefined && entry.body !== null;
  const time = entry.status === "running" ? labels.now : entry.offset;
  const summary = (
    <>
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${tileClass(entry.status)}`}>
        <Icon size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-1.5">
          {expandable ? (
            <ChevronRightIcon
              className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-90" : ""}`}
              size={12}
            />
          ) : null}
          <span className="text-[12px] text-ink-2">{entry.verb}</span>
          <span className="truncate font-mono text-[12.5px] text-ink">{entry.object}</span>
        </span>
        {entry.results && entry.results.length > 0 ? (
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-3">
            {entry.results.map((part, index) => (
              <span key={part} className="inline-flex items-center gap-1.5">
                {index > 0 ? <span aria-hidden className="size-[3px] rounded-full bg-ink-3" /> : null}
                <span className={part.startsWith("exit") && entry.status === "failed" ? "text-red" : undefined}>{part}</span>
              </span>
            ))}
          </span>
        ) : null}
      </span>
      {time ? <span className="shrink-0 font-mono text-[11px] text-ink-3">{time}</span> : null}
    </>
  );
  return (
    <div className="rounded-lg">
      {expandable ? (
        <button
          type="button"
          aria-expanded={open}
          className="flex w-full items-start gap-2 rounded-lg px-1 py-1 text-left hover:bg-hover"
          onClick={() => onToggle?.(entry.id)}
        >
          {summary}
        </button>
      ) : (
        <div className="flex items-start gap-2 px-1 py-1">{summary}</div>
      )}
      {expandable && open ? <div className="mt-1 ml-9 text-[12px] text-ink-2">{entry.body}</div> : null}
    </div>
  );
}

export type WorkflowWorkspaceLogProps = {
  entries: readonly WorkspaceLogEntry[];
  labels?: Partial<WorkspaceLogLabels>;
  openId?: string;
  onToggle?: (id: string) => void;
};

export function WorkflowWorkspaceLog({ entries, labels: labelOverrides, openId, onToggle }: WorkflowWorkspaceLogProps) {
  const labels = { ...WORKSPACE_LOG_LABELS, ...labelOverrides };
  return (
    <div className="flex w-full max-w-[520px] flex-col rounded-card bg-surface p-2 shadow-card">
      {entries.map((entry) => (
        <LogRow entry={entry} key={entry.id} labels={labels} open={openId === entry.id} onToggle={onToggle} />
      ))}
    </div>
  );
}

const ENTRIES: WorkspaceLogEntry[] = [
  { id: "read", kind: "read", status: "done", verb: "Read", object: "notes.md", results: ["41 lines"], offset: "+0:02" },
  {
    id: "search",
    kind: "search",
    status: "failed",
    verb: "Search",
    object: "vendors",
    results: ["exit 1"],
    offset: "+0:20",
    body: "No matches under docs/.",
  },
  {
    id: "git",
    kind: "git",
    status: "done",
    verb: "Commit",
    object: "main",
    results: ["3 files"],
    offset: "+0:40",
    body: "cert-renewal: refresh vendor certificates",
  },
  {
    id: "terminal",
    kind: "terminal",
    status: "running",
    verb: "Run",
    object: "npm test",
    offset: "+1:12",
    body: "catalog.test.mjs  ·  37 passed",
  },
  { id: "step", kind: "step", status: "pending", verb: "Plan", object: "publish", offset: "+1:12" },
];

export default function WorkflowWorkspaceLogDemo() {
  const [tick, setTick] = useState(0);
  const [openId, setOpenId] = useState<string>();
  useEffect(() => {
    if (tick >= 2) return;
    const timer = setTimeout(() => setTick((current) => current + 1), 1200);
    return () => clearTimeout(timer);
  }, [tick]);
  const terminalStatus: LogStatus = tick === 0 ? "running" : tick === 1 ? "failed" : "done";
  const entries = ENTRIES.map((entry) =>
    entry.id === "terminal"
      ? {
          ...entry,
          status: terminalStatus,
          results: terminalStatus === "failed" ? ["exit 1"] : terminalStatus === "done" ? ["passed"] : undefined,
        }
      : entry,
  );
  return (
    <WorkflowWorkspaceLog
      entries={entries}
      openId={openId}
      onToggle={(id) => setOpenId((current) => (current === id ? undefined : id))}
    />
  );
}
