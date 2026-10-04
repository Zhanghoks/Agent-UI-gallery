"use client";

import { useEffect, useState } from "react";
import { RefreshIcon, StopIcon, WorkflowIcon } from "@/components/atoms/Icons";
import {
  ARTIFACT_LABELS,
  WorkflowArtifactIndex,
  WorkflowArtifactStrip,
  WorkflowDeliverable,
  type ArtifactLabels,
  type WorkflowArtifactData,
} from "@/components/gallery/workflow-artifact";
import {
  TIMELINE_LABELS,
  WorkflowLamp,
  WorkflowTimeline,
  statusClass,
  type RunStatus,
  type TimelineLabels,
  type WorkflowTimelineModel,
} from "@/components/gallery/workflow-timeline";

/* Conversation card for one workflow run. Running shows the timeline;
 * completed shows a receipt. Without a live model the card is one neutral line. */

export type WorkflowRunFigures = {
  duration?: string;
  tokens?: string;
  actors?: string;
  phases?: string;
};

export type WorkflowRunCardLabels = {
  kind: string;
  cold: string;
  waiting: string;
  running: string;
  completed: string;
  failed: string;
  stopped: string;
  questions: (count: number) => string;
  open: string;
  cancel: string;
  resume: string;
  duration: string;
  tokens: string;
  actors: string;
  phases: string;
  missing: string;
  more: (count: number) => string;
};

export const RUN_CARD_LABELS: WorkflowRunCardLabels = {
  kind: "Workflow",
  cold: "This run is no longer live.",
  waiting: "Waiting",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  stopped: "Stopped",
  questions: (count) => (count === 1 ? "1 question" : `${count} questions`),
  open: "Open",
  cancel: "Stop",
  resume: "Resume",
  duration: "Duration",
  tokens: "Tokens",
  actors: "Actors",
  phases: "Phases",
  missing: "—",
  more: (count) => `${count} more`,
};

function runWord(status: RunStatus | undefined, labels: WorkflowRunCardLabels): string | undefined {
  if (status === "pending") return labels.waiting;
  if (status === "running") return labels.running;
  if (status === "completed") return labels.completed;
  if (status === "errored") return labels.failed;
  if (status === "stopped") return labels.stopped;
  return undefined;
}

export type WorkflowRunCardProps = {
  name: string;
  /** Absent, or a model with live: false, draws the cold line. */
  status?: RunStatus;
  model?: WorkflowTimelineModel;
  detail?: string;
  pendingQuestions?: number;
  artifacts?: readonly WorkflowArtifactData[];
  deliverable?: WorkflowArtifactData;
  figures?: WorkflowRunFigures;
  layout?: "running" | "completed";
  labels?: Partial<WorkflowRunCardLabels>;
  /** Copy for the embedded timeline. Card words (waiting, running, failed) are the default. */
  timelineLabels?: Partial<TimelineLabels>;
  /** Copy for the embedded artifacts. `labels.more` is the default overflow line. */
  artifactLabels?: Partial<ArtifactLabels>;
  onOpenRun?: () => void;
  onOpenStation?: (stationId: string) => void;
  onOpenActor?: (actorId: string) => void;
  onOpenWorkspace?: (actorId: string) => void;
  onOpenArtifact?: (artifactId: string) => void;
  /** Station id when the door is on the timeline; omitted on the receipt index. */
  onOpenMore?: (stationId?: string) => void;
  onResume?: () => void;
  onCancel?: () => void;
};

function TextButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button type="button" className="rounded-full px-2 py-0.5 text-[11px] text-ink-2 hover:bg-hover" onClick={onClick}>
      {children}
    </button>
  );
}

function Header({
  name,
  status,
  detail,
  pendingQuestions,
  labels,
  onOpenRun,
  onResume,
  onCancel,
}: {
  name: string;
  status?: RunStatus;
  detail?: string;
  pendingQuestions?: number;
  labels: WorkflowRunCardLabels;
  onOpenRun?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}) {
  const word = runWord(status, labels);
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
          <WorkflowIcon size={13} />
          <span>{labels.kind}</span>
        </div>
        <p className="mt-0.5 truncate text-[14px] font-medium text-ink">{name}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {status ? <WorkflowLamp status={status} /> : null}
        {word ? <span className={`text-[12px] ${statusClass(status)}`}>{word}</span> : null}
        {detail ? <span className="font-mono text-[11px] text-ink-3">{detail}</span> : null}
        {pendingQuestions && pendingQuestions > 0 ? (
          <span className="rounded-full bg-orange-tint px-1.5 py-0.5 text-[11px] text-orange">
            {labels.questions(pendingQuestions)}
          </span>
        ) : null}
        {onOpenRun ? <TextButton onClick={onOpenRun}>{labels.open}</TextButton> : null}
        {status === "running" && onCancel ? (
          <button type="button" className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-ink-2 hover:bg-hover" onClick={onCancel}>
            <StopIcon size={11} />
            {labels.cancel}
          </button>
        ) : null}
        {(status === "stopped" || status === "errored") && onResume ? (
          <button type="button" className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-ink-2 hover:bg-hover" onClick={onResume}>
            <RefreshIcon size={11} />
            {labels.resume}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Figure({ label, value, missing }: { label: string; value?: string; missing: string }) {
  const shown = value !== undefined && value !== "" ? value : missing;
  return (
    <div>
      <div className="font-mono text-[13px] text-ink">{shown}</div>
      <div className="text-[11px] text-ink-3">{label}</div>
    </div>
  );
}

export function WorkflowRunCard({
  name,
  status,
  model,
  detail,
  pendingQuestions,
  artifacts = [],
  deliverable,
  figures,
  layout = "running",
  labels: labelOverrides,
  timelineLabels: timelineLabelOverrides,
  artifactLabels: artifactLabelOverrides,
  onOpenRun,
  onOpenStation,
  onOpenActor,
  onOpenWorkspace,
  onOpenArtifact,
  onOpenMore,
  onResume,
  onCancel,
}: WorkflowRunCardProps) {
  const labels = { ...RUN_CARD_LABELS, ...labelOverrides };
  const timelineLabels: TimelineLabels = {
    ...TIMELINE_LABELS,
    waiting: labels.waiting,
    running: labels.running,
    failed: labels.failed,
    more: labels.more,
    ...timelineLabelOverrides,
  };
  const artifactLabels: ArtifactLabels = {
    ...ARTIFACT_LABELS,
    more: labels.more,
    ...artifactLabelOverrides,
  };
  const showPhases = figures !== undefined && "phases" in figures;
  const cold = layout === "running" && !model?.live;
  return (
    <div className="w-full max-w-[520px] rounded-card bg-surface p-3 shadow-card">
      {cold ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-ink-2">
            {name} — {labels.cold}
          </p>
          {onOpenRun ? <TextButton onClick={onOpenRun}>{labels.open}</TextButton> : null}
        </div>
      ) : (
        <>
          <Header
            detail={detail}
            labels={labels}
            name={name}
            onCancel={onCancel}
            onOpenRun={onOpenRun}
            onResume={onResume}
            pendingQuestions={pendingQuestions}
            status={status}
          />
          {layout === "completed" ? (
            <div className="mt-3 flex flex-col gap-3">
              {deliverable ? (
                <WorkflowDeliverable artifact={deliverable} labels={artifactLabels} onOpen={onOpenArtifact} />
              ) : null}
              {artifacts.length > 0 ? (
                <div className="border-t border-line pt-2">
                  <WorkflowArtifactIndex
                    artifacts={artifacts}
                    labels={artifactLabels}
                    onOpen={onOpenArtifact}
                    onOpenMore={onOpenMore ? () => onOpenMore() : undefined}
                  />
                </div>
              ) : null}
              <div className={`grid gap-2 border-t border-line pt-2 ${showPhases ? "grid-cols-4" : "grid-cols-3"}`}>
                <Figure label={labels.duration} missing={labels.missing} value={figures?.duration} />
                <Figure label={labels.tokens} missing={labels.missing} value={figures?.tokens} />
                <Figure label={labels.actors} missing={labels.missing} value={figures?.actors} />
                {showPhases ? <Figure label={labels.phases} missing={labels.missing} value={figures?.phases} /> : null}
              </div>
            </div>
          ) : model ? (
            <div className="mt-3 flex flex-col gap-3">
              <WorkflowTimeline
                labels={timelineLabels}
                model={model}
                onOpenActor={onOpenActor}
                onOpenMore={onOpenMore}
                onOpenStation={onOpenStation}
                onOpenWorkspace={onOpenWorkspace}
              />
              {artifacts.length > 0 ? (
                <WorkflowArtifactStrip artifacts={artifacts} labels={artifactLabels} onOpen={onOpenArtifact} />
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

const CARD_ARTIFACTS: WorkflowArtifactData[] = [
  { id: "brief", kind: "markdown", title: "Brief", version: 1, description: "What this run was asked to settle.", preview: <p className="p-2 text-[11px] text-ink-2">Renew the cold-chain certificates before Friday.</p> },
  { id: "spend", kind: "chart", title: "Spend", version: 2, detail: "6 series" },
  { id: "vendors", kind: "table", title: "Vendors", detail: "12 rows" },
  { id: "notes", kind: "file", title: "notes.txt" },
];

const REST: WorkflowArtifactData[] = [
  { id: "spend", kind: "chart", title: "Spend", version: 2, detail: "6 series" },
  { id: "vendors", kind: "table", title: "Vendors", detail: "12 rows" },
  { id: "notes", kind: "file", title: "notes.txt" },
  { id: "pulse", kind: "metrics", title: "Pulse", version: 3 },
  { id: "board", kind: "board", title: "Launch board" },
  { id: "log", kind: "file", title: "run.log", version: 2 },
  { id: "appendix", kind: "markdown", title: "Appendix" },
];

function cardModel(phase: number): { status?: RunStatus; model?: WorkflowTimelineModel; detail?: string; pendingQuestions?: number } {
  if (phase === 0) return {};
  const base = {
    live: true,
    arcs: [] as WorkflowTimelineModel["arcs"],
    rails: [] as WorkflowTimelineModel["rails"],
  };
  const step = (id: string, name: string, status: WorkflowTimelineModel["stations"][number]["status"]): WorkflowTimelineModel["stations"][number] => ({
    id,
    name,
    track: 0,
    status,
    visited: status === "running" || status === "done" || status === "failed",
    actors: [{ id: "ada", name: "Ada", lane: "agent", avatarIndex: 0, status: status === "pending" ? undefined : status }],
  });
  if (phase === 1) {
    return {
      status: "running",
      detail: "1/3",
      model: { ...base, stations: [step("gather", "Gather", "running"), step("draft", "Draft", "pending"), step("publish", "Publish", "pending")], rails: [{ from: 0, to: 1, ink: "march" }] },
    };
  }
  if (phase === 3) {
    return {
      status: "errored",
      detail: "2/3",
      model: {
        ...base,
        stations: [step("gather", "Gather", "done"), step("draft", "Draft", "failed"), step("publish", "Publish", "pending")],
        rails: [
          { from: 0, to: 1, ink: "strong" },
          { from: 1, to: 2, ink: "faint" },
        ],
      },
    };
  }
  if (phase >= 4) {
    return {
      status: "stopped",
      detail: "2/3",
      model: {
        ...base,
        stations: [step("gather", "Gather", "done"), step("draft", "Draft", "pending"), step("publish", "Publish", "pending")],
        rails: [{ from: 0, to: 1, ink: "strong" }, { from: 1, to: 2, ink: "faint" }],
      },
    };
  }
  return {
    status: "running",
    detail: "2/3",
    pendingQuestions: 1,
    model: {
      ...base,
      stations: [step("gather", "Gather", "done"), step("draft", "Draft", "running"), step("publish", "Publish", "pending")],
      rails: [
        { from: 0, to: 1, ink: "strong" },
        { from: 1, to: 2, ink: "march" },
      ],
    },
  };
}

export default function WorkflowRunCardDemo({ variant }: { variant?: string }) {
  const [phase, setPhase] = useState(0);
  const [note, setNote] = useState<string>();
  const completed = variant === "Completed";
  useEffect(() => {
    if (completed || phase >= 4) return;
    const timer = setTimeout(() => setPhase((current) => current + 1), phase === 0 ? 800 : 1400);
    return () => clearTimeout(timer);
  }, [completed, phase]);
  if (completed) {
    return (
      <div className="pb-8">
      <WorkflowRunCard
        artifacts={REST}
        deliverable={CARD_ARTIFACTS[0]}
        figures={{ duration: "4m 12s", tokens: "18.4k", actors: "3" }}
        layout="completed"
        name="Renew certificates"
        onOpenArtifact={() => setNote("Opened an artifact")}
        onOpenMore={() => setNote("Opened the rest")}
        onOpenRun={() => setNote("Opened the run")}
        status="completed"
      />
      </div>
    );
  }
  const frame = cardModel(phase);
  return (
    <div className="w-full pb-8">
      <WorkflowRunCard
        artifacts={phase === 0 ? [] : CARD_ARTIFACTS}
        detail={frame.detail}
        layout="running"
        model={frame.model}
        name="Renew certificates"
        onCancel={() => setNote("Stop")}
        onResume={() => setNote("Resume")}
        onOpenArtifact={() => setNote("Opened an artifact")}
        onOpenRun={() => setNote("Opened the run")}
        pendingQuestions={frame.pendingQuestions}
        status={frame.status}
      />
      {note ? <p className="mt-2 text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
