import type { WorkflowArtifactData } from "@/components/gallery/workflow-artifact";
import type { WorkflowRunCardProps, WorkflowRunFigures } from "@/components/gallery/workflow-run-card";
import type {
  RailInk,
  StepStatus,
  TimelineActor,
  TimelineArc,
  TimelineRail,
  TimelineStation,
  WorkflowTimelineModel,
} from "@/components/gallery/workflow-timeline";
import type { LogStatus, WorkspaceLogEntry } from "@/components/gallery/workflow-workspace-log";
import type { RunArtifactSummary, RunNode, RunState, WorkspaceNode } from "./protocol";

/* Protocol → display models. Pure functions, no fetching. A host that speaks
 * the protocol calls these and hands the result to the components; a host
 * with its own backend writes its own projection and ignores this file. */

const isLiveNode = (node: RunNode) => node.phase !== "settled";
const isBusyNode = (node: RunNode) =>
  node.phase === "executing" || node.phase === "repairing" || node.phase === "nudged";

/* ── timeline ───────────────────────────────────────────── */

function stationStatus(state: RunState, name: string, nodes: RunNode[]): StepStatus {
  const entered = state.phases.some((phase) => phase.name === name);
  if (!entered) return "pending";
  const runOver = state.status === "completed" || state.status === "errored" || state.status === "stopped";
  if (nodes.some((node) => node.outcome === "failed")) return "failed";
  if (state.status === "stopped") return nodes.every((node) => !isLiveNode(node)) ? "done" : "pending";
  if (nodes.some(isBusyNode)) return "running";
  if (nodes.some(isLiveNode)) return "running";
  if (state.currentPhase === name && !runOver) return "running";
  return "done";
}

function actorState(state: RunState, actorId: string, nodes: RunNode[]): StepStatus {
  const mine = nodes.filter((node) => node.actorId === actorId);
  if (mine.some((node) => node.outcome === "failed")) return "failed";
  const actor = state.actors.find((entry) => entry.actorId === actorId);
  if (actor?.status === "running") return "running";
  if (actor?.status === "waiting") return "pending";
  if (mine.length > 0 && state.status === "stopped" && mine.some((node) => node.outcome === "cancelled")) {
    return "pending";
  }
  return "done";
}

/** Edges between stations: a chain, except that a side-by-side group fans out from the station before it and joins at the one after. */
function edges(count: number, alongside: number[][] | undefined): Array<[number, number]> {
  const group = (alongside ?? []).find((members) => members.length > 1) ?? [];
  const inGroup = (index: number) => group.includes(index);
  const result: Array<[number, number]> = [];
  for (let index = 0; index < count - 1; index += 1) {
    if (!inGroup(index) && !inGroup(index + 1)) result.push([index, index + 1]);
  }
  if (group.length > 0) {
    const before = group[0]! - 1;
    const after = group[group.length - 1]! + 1;
    for (const member of group) {
      if (before >= 0) result.push([before, member]);
      if (after < count) result.push([member, after]);
    }
  }
  return result;
}

export type TimelineProjectionInput = {
  state: RunState;
  /** Phase names in which the run touched the workspace; they get a workspace actor. */
  workspacePhases?: ReadonlySet<string>;
};

export function toTimelineModel({ state, workspacePhases }: TimelineProjectionInput): WorkflowTimelineModel {
  const names = state.phaseNames ?? state.phases.map((phase) => phase.name);
  const group = (state.phaseAlongside ?? []).find((members) => members.length > 1);

  const stations: TimelineStation[] = names.map((name, index) => {
    const nodes = state.nodes.filter((node) => node.phaseName === name);
    const status = stationStatus(state, name, nodes);
    const visited = state.phases.some((phase) => phase.name === name);
    const phase = state.phases.find((entry) => entry.name === name);
    const actors: TimelineActor[] = state.actors
      .map((actor, avatarIndex) => ({ actor, avatarIndex }))
      .filter(({ actor }) => actor.phaseName === name)
      .map(({ actor, avatarIndex }) => ({
        id: actor.actorId,
        name: actor.name,
        lane: "agent" as const,
        avatarIndex,
        status: actorState(state, actor.actorId, nodes),
      }));
    if (workspacePhases?.has(name)) {
      actors.push({ id: `workspace:${name}`, name: "Workspace", lane: "workspace", status: visited ? status : undefined });
    }
    return {
      id: name,
      name,
      status: visited || state.status !== "pending" ? status : undefined,
      visited,
      track: group && group.indexOf(index) > 0 ? group.indexOf(index) : 0,
      ...(phase && phase.rounds > 1 ? { rounds: phase.rounds } : {}),
      ...(nodes.length > 0
        ? { steps: { settled: nodes.filter((node) => node.phase === "settled").length, observed: nodes.length } }
        : {}),
      actors,
    };
  });

  const ink = (from: number, to: number): RailInk => {
    const a = stations[from]!.status;
    const b = stations[to]!;
    if (b.status === "running") return "march";
    if (a === "done" && b.visited) return "strong";
    return "faint";
  };

  const all = edges(names.length, state.phaseAlongside);
  const rails: TimelineRail[] = all.map(([from, to]) => ({ from, to, ink: ink(from, to) }));
  const arcs: TimelineArc[] = [];
  if (group) {
    const before = group[0]! - 1;
    const after = group[group.length - 1]! + 1;
    if (before >= 0 && after < names.length) arcs.push({ from: before, to: after, ink: ink(before, after) });
  }
  return { stations, rails, arcs, live: true };
}

/* ── artifacts ──────────────────────────────────────────── */

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} kB`;
  return `${bytes} B`;
}

export function toArtifactData(summary: RunArtifactSummary): WorkflowArtifactData {
  const detail =
    summary.bytes !== undefined
      ? formatBytes(summary.bytes)
      : summary.itemCount !== undefined
        ? `${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}`
        : summary.contentType;
  return {
    id: summary.artifactId,
    kind: summary.kind,
    title: summary.title ?? summary.artifactId,
    detail,
    version: summary.version,
  };
}

/* ── run card ───────────────────────────────────────────── */

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatTokens(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

export function toRunFigures(state: RunState): WorkflowRunFigures {
  const ended = state.status === "completed" || state.status === "errored" || state.status === "stopped";
  return {
    ...(ended ? { duration: formatDuration(state.updatedAt - state.startedAt) } : {}),
    ...(state.usage.spentTokens > 0 ? { tokens: formatTokens(state.usage.spentTokens) } : {}),
    ...(state.actors.length > 0 ? { actors: String(state.actors.length) } : {}),
    ...(state.phases.length > 0 ? { phases: String(state.phases.length) } : {}),
  };
}

export type RunCardProjection = Pick<
  WorkflowRunCardProps,
  "name" | "status" | "model" | "detail" | "pendingQuestions" | "artifacts" | "deliverable" | "figures" | "layout"
>;

export function toRunCardProps(state: RunState, workspacePhases?: ReadonlySet<string>): RunCardProjection {
  const ended = state.status === "completed" || state.status === "errored" || state.status === "stopped";
  const primary = state.artifacts.find((artifact) => artifact.primary);
  const rest = state.artifacts.filter((artifact) => artifact !== primary);
  return {
    name: state.name,
    status: state.status,
    model: toTimelineModel({ state, workspacePhases }),
    detail: state.error ?? (state.currentPhase && !ended ? state.currentPhase : undefined),
    pendingQuestions: state.pendingQuestions.length,
    artifacts: rest.map(toArtifactData),
    deliverable: primary ? toArtifactData(primary) : undefined,
    figures: toRunFigures(state),
    layout: ended ? "completed" : "running",
  };
}

/* ── workspace log ──────────────────────────────────────── */

const logStatus = (status: WorkspaceNode["status"]): LogStatus => (status === "completed" ? "done" : status);

function offsetLabel(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  return `+${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function resultChips(node: WorkspaceNode): string[] | undefined {
  if (node.status === "running") return undefined;
  const chips: string[] = [];
  if (node.summary?.exitCode) chips.push(`exit ${node.summary.exitCode}`);
  else if (node.kind === "read" && node.summary?.resultCount !== undefined) chips.push(`${node.summary.resultCount} lines`);
  else if (node.summary?.resultCount !== undefined) {
    chips.push(`${node.summary.resultCount} ${node.kind === "git" ? "files" : "matches"}`);
  } else if (node.status === "completed" && node.kind === "terminal") chips.push("passed");
  if (node.status === "failed" && node.error && chips.length === 0) chips.push(node.error.code);
  return chips.length > 0 ? chips : undefined;
}

/** `results` holds fetched node output, by node id; a row without one is not expandable. */
export function toWorkspaceLog(
  nodes: readonly WorkspaceNode[],
  results: Readonly<Record<string, string>> = {},
): WorkspaceLogEntry[] {
  const ordered = [...nodes].sort((a, b) => a.createdAt - b.createdAt);
  const origin = ordered[0]?.createdAt ?? 0;
  return ordered.map((node) => ({
    id: node.nodeId,
    kind: node.kind,
    status: logStatus(node.status),
    verb: node.op,
    object: node.args?.[0] ?? "",
    results: resultChips(node),
    offset: offsetLabel(node.createdAt - origin),
    ...(node.kind !== "read" && results[node.nodeId] ? { body: results[node.nodeId] } : {}),
  }));
}
