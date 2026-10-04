"use client";

import { useEffect, useState } from "react";
import { ArrowUpRightIcon, TerminalIcon } from "@/components/atoms/Icons";

/* Controlled timeline. The host passes an already-built model — this view
 * does not derive stations from a script or a run projection. The same model
 * draws the horizontal timeline and the vertical spine. */

export type StepStatus = "pending" | "running" | "done" | "failed";
export type RunStatus = "pending" | "running" | "completed" | "errored" | "stopped";
export type LaneClass = "agent" | "workspace" | "unresolved";
export type RailInk = "faint" | "strong" | "march";
export type LampKind = "quiet" | "pending" | "running" | "done" | "failed";

export type TimelineActor = {
  id: string;
  name: string;
  lane: LaneClass;
  /** Absent and "pending" both draw with no status mark. */
  status?: StepStatus;
  /** Stable index into the nine-color face ring. Same index, same face. */
  avatarIndex?: number;
};

export type TimelineStation = {
  id: string;
  name: string;
  /** Absent when there is no live run — the station draws with no lamp. */
  status?: StepStatus;
  visited: boolean;
  /** 0 is the main line. A non-zero track is a branch beside it. */
  track: number;
  rounds?: number;
  steps?: { settled: number; observed: number };
  actors: TimelineActor[];
};

export type TimelineRail = {
  from: number;
  to: number;
  ink: RailInk;
};

export type TimelineArc = {
  from: number;
  to: number;
  ink: RailInk;
};

export type WorkflowTimelineModel = {
  stations: TimelineStation[];
  rails: TimelineRail[];
  arcs: TimelineArc[];
  live: boolean;
};

export type TimelineLabels = {
  waiting: string;
  running: string;
  done: string;
  failed: string;
  more: (count: number) => string;
  rounds: (count: number) => string;
};

export const TIMELINE_LABELS: TimelineLabels = {
  waiting: "Waiting",
  running: "Running",
  done: "Done",
  failed: "Failed",
  more: (count) => `${count} more`,
  rounds: (count) => `↻ ${count}`,
};

const FACE = [
  "oklch(0.62 0.16 25)",
  "oklch(0.64 0.14 55)",
  "oklch(0.68 0.13 95)",
  "oklch(0.62 0.12 150)",
  "oklch(0.6 0.1 195)",
  "oklch(0.58 0.12 235)",
  "oklch(0.56 0.14 275)",
  "oklch(0.58 0.15 320)",
  "oklch(0.6 0.13 350)",
];

const PINNED = 5;

export function lampKind(status: StepStatus | RunStatus | undefined): LampKind {
  if (status === undefined) return "quiet";
  if (status === "running") return "running";
  if (status === "done" || status === "completed") return "done";
  if (status === "failed" || status === "errored") return "failed";
  return "pending";
}

export function statusWord(status: StepStatus | undefined, labels: TimelineLabels): string | undefined {
  if (status === "running") return labels.running;
  if (status === "done") return labels.done;
  if (status === "failed") return labels.failed;
  if (status === "pending") return labels.waiting;
  return undefined;
}

export function statusClass(status: StepStatus | RunStatus | undefined): string {
  const kind = lampKind(status);
  if (kind === "running") return "text-orange";
  if (kind === "done") return "text-green";
  if (kind === "failed") return "text-red";
  return "text-ink-2";
}

export function faceColor(index = 0): string {
  const i = ((index % FACE.length) + FACE.length) % FACE.length;
  return FACE[i];
}

export function WorkflowLamp({ status }: { status?: StepStatus | RunStatus }) {
  const kind = lampKind(status);
  return <span aria-hidden className="wf-lamp" data-lamp={kind} />;
}

function ActorMark({ status }: { status?: StepStatus }) {
  if (status !== "running" && status !== "done" && status !== "failed") return <span className="wf-pill-tail" />;
  return (
    <span className="wf-pill-tail" aria-hidden>
      <span className="wf-lamp" data-lamp={lampKind(status)} style={{ width: 8, height: 8 }} />
    </span>
  );
}

export function WorkflowActorPill({
  actor,
  onOpen,
}: {
  actor: TimelineActor;
  onOpen?: (actorId: string) => void;
}) {
  const mark = <ActorMark status={actor.status} />;
  const face =
    actor.lane === "agent" ? (
      <span
        aria-hidden
        className="size-5 shrink-0 rounded-full"
        style={{ background: faceColor(actor.avatarIndex) }}
      />
    ) : actor.lane === "workspace" ? (
      <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-md bg-hover text-ink-2">
        <TerminalIcon size={12} />
      </span>
    ) : (
      <span aria-hidden className="size-5 shrink-0 rounded-full border border-dashed border-ink-3" />
    );
  const quiet = actor.status === undefined || actor.status === "pending";
  const body = (
    <>
      {face}
      <span className={`truncate ${quiet ? "text-ink-3" : "text-ink"}`}>{actor.name}</span>
      {mark}
    </>
  );
  if (!onOpen) {
    return <span className="wf-pill">{body}</span>;
  }
  return (
    <button type="button" className="wf-pill" onClick={() => onOpen(actor.id)}>
      {body}
    </button>
  );
}

function MoreDoor({
  count,
  labels,
  onOpen,
}: {
  count: number;
  labels: TimelineLabels;
  onOpen?: () => void;
}) {
  const body = (
    <>
      <span className="truncate">{labels.more(count)}</span>
      <ArrowUpRightIcon size={12} />
    </>
  );
  const className = "inline-flex items-center gap-1 text-[12px] text-ink-2";
  if (!onOpen) return <span className={className}>{body}</span>;
  return (
    <button type="button" className={className} onClick={onOpen}>
      {body}
    </button>
  );
}

function ActorRow({
  station,
  labels,
  onOpenActor,
  onOpenWorkspace,
  onOpenMore,
}: {
  station: TimelineStation;
  labels: TimelineLabels;
  onOpenActor?: (actorId: string) => void;
  onOpenWorkspace?: (actorId: string) => void;
  onOpenMore?: (stationId: string) => void;
}) {
  const shown = station.actors.slice(0, PINNED);
  const extra = station.actors.length - shown.length;
  return (
    <div className="mt-1.5 flex flex-col items-start gap-1">
      {shown.map((actor) => (
        <WorkflowActorPill
          actor={actor}
          key={`${station.id}:${actor.id}`}
          onOpen={
            actor.lane === "agent" ? onOpenActor : actor.lane === "workspace" ? onOpenWorkspace : undefined
          }
        />
      ))}
      {extra > 0 ? (
        <MoreDoor count={extra} labels={labels} onOpen={onOpenMore ? () => onOpenMore(station.id) : undefined} />
      ) : null}
    </div>
  );
}

function StationHead({
  station,
  labels,
  onOpenStation,
}: {
  station: TimelineStation;
  labels: TimelineLabels;
  onOpenStation?: (stationId: string) => void;
}) {
  const word = statusWord(station.status, labels);
  const name = (
    <span className={`truncate text-[13px] font-medium ${station.visited ? "text-ink" : "text-ink-3"}`}>
      {station.name}
    </span>
  );
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <WorkflowLamp status={station.status} />
        {onOpenStation ? (
          <button type="button" className="min-w-0 truncate text-left" onClick={() => onOpenStation(station.id)}>
            {name}
          </button>
        ) : (
          name
        )}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 pl-[16px] text-[11px]">
        {word ? <span className={statusClass(station.status)}>{word}</span> : null}
        {station.rounds !== undefined ? (
          <span className="font-mono text-ink-3">{labels.rounds(station.rounds)}</span>
        ) : null}
        {station.steps ? (
          <span className="font-mono text-ink-3">
            {station.steps.settled}/{station.steps.observed}
          </span>
        ) : null}
      </div>
    </div>
  );
}

type Segment =
  | { kind: "main"; station: TimelineStation; index: number }
  | { kind: "branch"; items: { station: TimelineStation; index: number }[] };

function segmentsOf(stations: TimelineStation[]): Segment[] {
  const out: Segment[] = [];
  let i = 0;
  while (i < stations.length) {
    if (stations[i].track === 0) {
      out.push({ kind: "main", station: stations[i], index: i });
      i += 1;
      continue;
    }
    const items: { station: TimelineStation; index: number }[] = [];
    while (i < stations.length && stations[i].track !== 0) {
      items.push({ station: stations[i], index: i });
      i += 1;
    }
    out.push({ kind: "branch", items });
  }
  return out;
}

function indicesOf(segment: Segment): number[] {
  return segment.kind === "main" ? [segment.index] : segment.items.map((item) => item.index);
}

function connectorInk(rails: TimelineRail[], left: Segment, right: Segment): RailInk {
  const from = new Set(indicesOf(left));
  const to = new Set(indicesOf(right));
  const links = rails.filter(
    (rail) => (from.has(rail.from) && to.has(rail.to)) || (to.has(rail.from) && from.has(rail.to)),
  );
  if (links.some((rail) => rail.ink === "march")) return "march";
  if (links.some((rail) => rail.ink === "strong")) return "strong";
  return "faint";
}

function inkClass(ink: RailInk): string {
  if (ink === "march") return "text-orange";
  if (ink === "strong") return "text-ink-2";
  return "text-ink-3";
}

const COL = 132;
const GAP = 24;

type TimelineViewProps = {
  model: WorkflowTimelineModel;
  labels: TimelineLabels;
  onOpenStation?: (stationId: string) => void;
  onOpenActor?: (actorId: string) => void;
  onOpenWorkspace?: (actorId: string) => void;
  onOpenMore?: (stationId: string) => void;
};

function HorizontalTimeline({
  model,
  labels,
  onOpenStation,
  onOpenActor,
  onOpenWorkspace,
  onOpenMore,
}: TimelineViewProps) {
  const segments = segmentsOf(model.stations);
  const centers: number[] = [];
  let x = 0;
  for (const segment of segments) {
    const mid = x + COL / 2;
    if (segment.kind === "main") centers[segment.index] = mid;
    else for (const item of segment.items) centers[item.index] = mid;
    x += COL + GAP;
  }
  const width = Math.max(COL, x - GAP);
  return (
    <div className="overflow-x-auto">
      <div style={{ width }}>
        {model.arcs.length > 0 ? (
          <svg aria-hidden className="block overflow-visible" height={28} width={width}>
            {model.arcs.map((arc) => {
              const x1 = centers[arc.from] ?? 0;
              const x2 = centers[arc.to] ?? 0;
              return (
                <path
                  className={inkClass(arc.ink)}
                  d={`M ${x1} 26 C ${x1} 6, ${x2} 6, ${x2} 26`}
                  fill="none"
                  key={`${arc.from}-${arc.to}`}
                  stroke="currentColor"
                  strokeWidth={arc.ink === "march" ? 1.75 : 1}
                />
              );
            })}
          </svg>
        ) : null}
        <div className="flex items-start">
          {segments.map((segment, i) => {
            const ink = i > 0 ? connectorInk(model.rails, segments[i - 1], segment) : undefined;
            return (
              <div className="flex items-start" key={i}>
                {ink ? <span aria-hidden className="wf-rail mt-[5px] h-px w-6" data-ink={ink} /> : null}
                {segment.kind === "main" ? (
                  <div className="w-[132px] shrink-0">
                    <StationHead labels={labels} onOpenStation={onOpenStation} station={segment.station} />
                    <ActorRow
                      labels={labels}
                      onOpenActor={onOpenActor}
                      onOpenMore={onOpenMore}
                      onOpenWorkspace={onOpenWorkspace}
                      station={segment.station}
                    />
                  </div>
                ) : (
                  <div className="flex w-[132px] shrink-0 flex-col gap-3">
                    {segment.items.map((item) => (
                      <div key={item.station.id}>
                        <StationHead labels={labels} onOpenStation={onOpenStation} station={item.station} />
                        <ActorRow
                          labels={labels}
                          onOpenActor={onOpenActor}
                          onOpenMore={onOpenMore}
                          onOpenWorkspace={onOpenWorkspace}
                          station={item.station}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Spine({
  model,
  labels,
  onOpenStation,
  onOpenActor,
  onOpenWorkspace,
  onOpenMore,
}: TimelineViewProps) {
  const rows = model.stations.length || 1;
  return (
    <div className="relative">
      {model.arcs.length > 0 ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-5 overflow-visible"
          preserveAspectRatio="none"
          viewBox={`0 0 20 ${rows * 10}`}
        >
          {model.arcs.map((arc) => (
            <path
              className={inkClass(arc.ink)}
              d={`M18 ${arc.from * 10 + 2} C 1 ${arc.from * 10 + 2}, 1 ${arc.to * 10 + 2}, 18 ${arc.to * 10 + 2}`}
              fill="none"
              key={`${arc.from}-${arc.to}`}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      ) : null}
    <ol className="flex flex-col">
      {model.stations.map((station, index) => {
        const direct = model.rails.find(
          (rail) =>
            (rail.from === index && rail.to === index + 1) || (rail.to === index && rail.from === index + 1),
        );
        return (
          <li
            className="relative pb-3 pl-6"
            key={station.id}
            style={station.track ? { marginLeft: station.track * 14 } : undefined}
          >
            {direct ? (
              <span aria-hidden className="wf-rail absolute top-3 bottom-0 left-[4px] w-px" data-ink={direct.ink} />
            ) : null}
            <StationHead labels={labels} onOpenStation={onOpenStation} station={station} />
            <ActorRow
              labels={labels}
              onOpenActor={onOpenActor}
              onOpenMore={onOpenMore}
              onOpenWorkspace={onOpenWorkspace}
              station={station}
            />
          </li>
        );
      })}
    </ol>
    </div>
  );
}

export type WorkflowTimelineProps = {
  model: WorkflowTimelineModel;
  layout?: "timeline" | "spine";
  labels?: Partial<TimelineLabels>;
  onOpenStation?: (stationId: string) => void;
  onOpenActor?: (actorId: string) => void;
  onOpenWorkspace?: (actorId: string) => void;
  onOpenMore?: (stationId: string) => void;
};

export function WorkflowTimeline({
  model,
  layout = "timeline",
  labels: labelOverrides,
  onOpenStation,
  onOpenActor,
  onOpenWorkspace,
  onOpenMore,
}: WorkflowTimelineProps) {
  const labels = { ...TIMELINE_LABELS, ...labelOverrides };
  const props = { model, labels, onOpenStation, onOpenActor, onOpenWorkspace, onOpenMore };
  return layout === "spine" ? <Spine {...props} /> : <HorizontalTimeline {...props} />;
}

const DEMO_PHASES = 6;

function actor(id: string, name: string, lane: LaneClass, avatarIndex?: number, status?: StepStatus): TimelineActor {
  return { id, name, lane, ...(avatarIndex === undefined ? {} : { avatarIndex }), ...(status ? { status } : {}) };
}

function demoModel(phase: number): WorkflowTimelineModel {
  const live = phase > 0;
  const table: Record<string, StepStatus> =
    phase === 1
      ? { gather: "running", draft: "pending", critique: "pending", publish: "pending" }
      : phase === 2
        ? { gather: "done", draft: "running", critique: "running", publish: "pending" }
        : phase === 3
          ? { gather: "done", draft: "done", critique: "failed", publish: "pending" }
          : phase === 4
            ? { gather: "done", draft: "done", critique: "done", publish: "running" }
            : phase >= 5
              ? { gather: "done", draft: "done", critique: "done", publish: "done" }
              : {};
  const at = (id: string) => (live ? table[id] : undefined);
  const seen = (status?: StepStatus) => status === "running" || status === "done" || status === "failed";
  const station = (
    id: string,
    name: string,
    track: number,
    actors: TimelineActor[],
    extra?: Pick<TimelineStation, "rounds" | "steps">,
  ): TimelineStation => ({
    id,
    name,
    track,
    actors,
    status: at(id),
    visited: seen(at(id)),
    ...extra,
  });
  const gatherStatus = at("gather");
  const stations = [
    station("gather", "Gather", 0, [
      actor("ada", "Ada", "agent", 0, gatherStatus),
      actor("lin", "Lin", "agent", 1, gatherStatus),
      actor("bea", "Bea", "agent", 2, gatherStatus),
      actor("nico", "Nico", "agent", 3, gatherStatus),
      actor("workspace", "Workspace", "workspace", undefined, gatherStatus),
      actor("quinn", "Quinn", "agent", 4, gatherStatus),
    ], gatherStatus === "done" ? { steps: { settled: 4, observed: 4 } } : gatherStatus === "running" ? { steps: { settled: 1, observed: 4 } } : undefined),
    station("draft", "Draft", 1, [actor("ada", "Ada", "agent", 0, at("draft"))]),
    station("critique", "Critique", 2, [
      actor("lin", "Lin", "agent", 1, at("critique")),
      actor("unassigned", "Unassigned", "unresolved"),
    ]),
    station("publish", "Publish", 0, [actor("workspace", "Workspace", "workspace", undefined, at("publish"))], { rounds: 2 }),
  ];
  const edge = (fromId: string, toId: string): RailInk => {
    if (!live) return "faint";
    const to = at(toId);
    const from = at(fromId);
    if (to === "running") return "march";
    if (from === "done" && to && to !== "pending") return "strong";
    return "faint";
  };
  return {
    live,
    stations,
    rails: [
      { from: 0, to: 1, ink: edge("gather", "draft") },
      { from: 0, to: 2, ink: edge("gather", "critique") },
      { from: 1, to: 3, ink: edge("draft", "publish") },
      { from: 2, to: 3, ink: edge("critique", "publish") },
    ],
    arcs: [{ from: 0, to: 3, ink: edge("gather", "publish") }],
  };
}

export default function WorkflowTimelineDemo({ variant }: { variant?: string }) {
  const [phase, setPhase] = useState(0);
  const [note, setNote] = useState<string>();
  useEffect(() => {
    if (phase >= DEMO_PHASES - 1) return;
    const timer = setTimeout(() => setPhase((current) => current + 1), phase === 0 ? 700 : 1100);
    return () => clearTimeout(timer);
  }, [phase]);
  const model = demoModel(phase);
  return (
    <div className="w-full pb-8">
      <WorkflowTimeline
        labels={TIMELINE_LABELS}
        layout={variant === "Spine" ? "spine" : "timeline"}
        model={model}
        onOpenActor={(id) => setNote(`Opened ${id}`)}
        onOpenMore={(id) => setNote(`Others on ${id}`)}
        onOpenStation={(id) => setNote(`Station ${id}`)}
        onOpenWorkspace={(id) => setNote(`Workspace ${id}`)}
      />
      {note ? <p className="mt-2 text-[11px] text-ink-3">{note}</p> : null}
    </div>
  );
}
