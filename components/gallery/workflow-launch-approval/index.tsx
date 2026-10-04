"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { ChevronRightIcon, ShieldIcon, WorkflowIcon } from "@/components/atoms/Icons";
import { WorkflowTimeline, type WorkflowTimelineModel } from "@/components/gallery/workflow-timeline";

/* The question before a workflow runs. The timeline is the thing to decide on;
 * where the script came from and the arguments come first, the script text sits
 * behind a fold. Saving a workflow does not make it trusted — the badge only
 * says which file will run. Run, Refine and Deny are the host's callbacks. */

export type LaunchSource = {
  scope: "project" | "global";
  name: string;
  path?: string;
  args?: Readonly<Record<string, string | number | boolean>>;
};

export type LaunchApprovalLabels = {
  question: string;
  saved: string;
  project: string;
  global: string;
  args: string;
  phases: (count: number) => string;
  concurrency: (count: number) => string;
  script: string;
  run: string;
  deny: string;
  refine: string;
};

export const LAUNCH_APPROVAL_LABELS: LaunchApprovalLabels = {
  question: "Run this workflow?",
  saved: "Saved",
  project: "project",
  global: "global",
  args: "Arguments",
  phases: (count) => (count === 1 ? "1 phase" : `${count} phases`),
  concurrency: (count) => `Up to ${count} agents at once`,
  script: "Script",
  run: "Run",
  deny: "Deny",
  refine: "Refine",
};

export type WorkflowLaunchApprovalProps = {
  name: string;
  model: WorkflowTimelineModel;
  source?: LaunchSource;
  script?: string;
  maxConcurrency?: number;
  labels?: Partial<LaunchApprovalLabels>;
  onRun?: () => void;
  onDeny?: () => void;
  onRefine?: () => void;
};

function SourceBadge({ source, labels }: { source: LaunchSource; labels: LaunchApprovalLabels }) {
  const entries = Object.entries(source.args ?? {});
  return (
    <div className="space-y-1.5 rounded-control bg-inset px-2.5 py-2">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="shrink-0 text-[11px] font-medium text-ink-2">
          {labels.saved} · {source.scope === "project" ? labels.project : labels.global}
        </span>
        <span className="min-w-0 truncate font-mono text-[11px] text-ink-3">{source.name}</span>
      </div>
      {source.path ? <p className="truncate font-mono text-[10.5px] text-ink-3">{source.path}</p> : null}
      {entries.length > 0 ? (
        <dl aria-label={labels.args} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-0.5">
          {entries.map(([key, value]) => (
            <div className="contents" key={key}>
              <dt className="font-mono text-[11px] text-ink-3">{key}</dt>
              <dd className="min-w-0 break-words font-mono text-[11px] text-ink-2">{String(value)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

export function WorkflowLaunchApproval({
  name,
  model,
  source,
  script,
  maxConcurrency,
  labels: labelOverrides,
  onRun,
  onDeny,
  onRefine,
}: WorkflowLaunchApprovalProps) {
  const labels = { ...LAUNCH_APPROVAL_LABELS, ...labelOverrides };
  const [showScript, setShowScript] = useState(false);
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-3 rounded-card bg-surface p-3 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
            <ShieldIcon size={13} />
            <span>{labels.question}</span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-[14px] font-medium text-ink">
            <WorkflowIcon size={14} />
            {name}
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-ink-3">{labels.phases(model.stations.length)}</span>
      </div>
      {maxConcurrency ? <p className="text-[11px] text-ink-3">{labels.concurrency(maxConcurrency)}</p> : null}
      {source ? <SourceBadge labels={labels} source={source} /> : null}
      <WorkflowTimeline layout="spine" model={model} />
      {script ? (
        <div>
          <button
            aria-expanded={showScript}
            className="inline-flex items-center gap-1 text-[11px] text-ink-2 hover:text-ink"
            onClick={() => setShowScript((open) => !open)}
            type="button"
          >
            <ChevronRightIcon className={showScript ? "rotate-90" : undefined} size={12} />
            {labels.script}
          </button>
          {showScript ? (
            <pre className="mt-1.5 max-h-48 overflow-auto rounded-control bg-inset p-2.5 font-mono text-[11px] leading-relaxed text-ink-2">
              {script}
            </pre>
          ) : null}
        </div>
      ) : null}
      {onRun || onDeny || onRefine ? (
        <div className="flex items-center justify-end gap-2 pt-1">
          {onDeny ? (
            <Button onClick={onDeny} size="sm" variant="quiet">
              {labels.deny}
            </Button>
          ) : null}
          {onRefine ? (
            <Button onClick={onRefine} size="sm" variant="ghost">
              {labels.refine}
            </Button>
          ) : null}
          {onRun ? (
            <Button onClick={onRun} size="sm" variant="primary">
              {labels.run}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const PLAN: WorkflowTimelineModel = {
  live: false,
  stations: [
    { id: "scan", name: "Scan", visited: false, track: 0, actors: [] },
    { id: "review", name: "Review", visited: false, track: 0, actors: [] },
    { id: "fix", name: "Fix", visited: false, track: 0, actors: [] },
    { id: "report", name: "Report", visited: false, track: 0, actors: [] },
  ],
  rails: [
    { from: 0, to: 1, ink: "faint" },
    { from: 1, to: 2, ink: "faint" },
    { from: 2, to: 3, ink: "faint" },
  ],
  arcs: [],
};

const SCRIPT = `phase("Scan");
const files = await agent("scanner").ask("Map the diff since " + args.since);

phase("Review");
await Promise.all(["security", "perf", "a11y"].map((lens) =>
  agent(lens).ask("Review the changed files for " + lens)
));

phase("Fix");
if (args.fix) await agent("fixer").ask("Fix the blocking findings");

phase("Report");
return agent("writer").ask("Write the audit report");`;

export default function WorkflowLaunchApprovalDemo({ variant }: { variant?: string }) {
  const [outcome, setOutcome] = useState<"run" | "deny" | "refine">();
  const saved = variant === "Saved";
  if (outcome) {
    return (
      <p className="w-full max-w-[420px] rounded-card bg-surface p-3 text-[12px] text-ink-2 shadow-card">
        {outcome === "run" ? "Running release-audit…" : outcome === "deny" ? "Denied." : "Asked the agent to refine the plan."}
      </p>
    );
  }
  return (
    <WorkflowLaunchApproval
      maxConcurrency={saved ? undefined : 3}
      model={PLAN}
      name="release-audit"
      onDeny={() => setOutcome("deny")}
      onRefine={() => setOutcome("refine")}
      onRun={() => setOutcome("run")}
      script={SCRIPT}
      source={
        saved
          ? { scope: "project", name: "release-audit", path: ".agent/workflows/release-audit.js", args: { since: "v2.3", fix: true } }
          : undefined
      }
    />
  );
}
