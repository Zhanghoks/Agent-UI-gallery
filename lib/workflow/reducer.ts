import type {
  ActorStatus,
  RunActor,
  RunEventEnvelope,
  RunNode,
  RunState,
  RunSummary,
} from "./protocol";

/* Pure fold of events into run state. The mock server uses it for both the
 * HTTP snapshot and the stream's opening snapshot, so a client that applies
 * the stream on top of a snapshot ends up with the same state. A real client
 * can reuse it to apply live events. */

export function initialRunState(runId: string, at: number): RunState {
  return {
    runId,
    name: runId,
    status: "pending",
    startedAt: at,
    updatedAt: at,
    usage: { spentTokens: 0, nodesUsed: 0 },
    phases: [],
    actors: [],
    nodes: [],
    pendingQuestions: [],
    artifacts: [],
    lastEventSequence: 0,
  };
}

const LIVE_PHASES = new Set(["queued", "dispatched", "waiting"]);
const BUSY_PHASES = new Set(["executing", "repairing", "nudged"]);

export const isTerminal = (status: RunState["status"]) =>
  status === "completed" || status === "errored" || status === "stopped";

/* An actor has no lifecycle events of its own. Its status is read off its
 * nodes: busy node → running, live node (or none yet, run not over) → waiting,
 * otherwise completed. */
function actorStatus(actor: RunActor, nodes: RunNode[], runOver: boolean): ActorStatus {
  if (runOver) return "completed";
  const mine = nodes.filter((node) => node.actorId === actor.actorId);
  if (mine.some((node) => BUSY_PHASES.has(node.phase))) return "running";
  if (mine.length === 0 || mine.some((node) => LIVE_PHASES.has(node.phase))) return "waiting";
  return "completed";
}

function withActorStatus(state: RunState): RunState {
  const runOver = isTerminal(state.status);
  return {
    ...state,
    actors: state.actors.map((actor) => ({ ...actor, status: actorStatus(actor, state.nodes, runOver) })),
  };
}

function patchNode(nodes: RunNode[], nodeId: string, patch: Partial<RunNode>): RunNode[] {
  return nodes.map((node) => (node.nodeId === nodeId ? { ...node, ...patch } : node));
}

export function reduceRun(state: RunState, envelope: RunEventEnvelope): RunState {
  // A replayed prefix (resume, reconnect) must not be applied twice.
  if (envelope.sequence <= state.lastEventSequence) return state;
  const { event } = envelope;
  let next: RunState = { ...state, updatedAt: envelope.at, lastEventSequence: envelope.sequence };

  switch (event.type) {
    case "run-started":
      next = {
        ...next,
        name: event.name,
        status: "running",
        startedAt: envelope.at,
        phaseNames: event.phaseNames,
        phaseAlongside: event.phaseAlongside,
      };
      break;
    case "phase-entered": {
      const seen = next.phases.find((phase) => phase.name === event.name);
      next = {
        ...next,
        currentPhase: event.name,
        phases: seen
          ? next.phases.map((phase) =>
              phase.name === event.name ? { ...phase, rounds: phase.rounds + 1 } : phase,
            )
          : [...next.phases, { name: event.name, rounds: 1 }],
      };
      break;
    }
    case "actor-created":
      if (!next.actors.some((actor) => actor.actorId === event.actorId)) {
        next = {
          ...next,
          actors: [
            ...next.actors,
            {
              actorId: event.actorId,
              name: event.name,
              status: "waiting",
              phaseName: event.phaseName,
              sessionId: event.sessionId,
            },
          ],
        };
      }
      break;
    case "node-queued":
      if (!next.nodes.some((node) => node.nodeId === event.nodeId)) {
        next = {
          ...next,
          usage: { ...next.usage, nodesUsed: next.usage.nodesUsed + 1 },
          nodes: [
            ...next.nodes,
            {
              nodeId: event.nodeId,
              kind: event.kind,
              phase: "queued",
              actorId: event.actorId,
              phaseName: event.phaseName,
              instructionsHead: event.instructionsHead,
            },
          ],
        };
      }
      break;
    case "node-advanced":
      next = { ...next, nodes: patchNode(next.nodes, event.nodeId, { phase: event.phase }) };
      break;
    case "node-progress":
      next = {
        ...next,
        nodes: patchNode(next.nodes, event.nodeId, {
          toolCalls: event.toolCalls,
          lastTool: event.lastTool,
        }),
      };
      break;
    case "node-settled":
      next = {
        ...next,
        nodes: patchNode(next.nodes, event.nodeId, { phase: "settled", outcome: event.outcome }),
      };
      break;
    case "usage-updated":
      // Totals only grow; a late, smaller number is a reordering, not a refund.
      next = {
        ...next,
        usage: { ...next.usage, spentTokens: Math.max(next.usage.spentTokens, event.spentTokens) },
      };
      break;
    case "question-asked":
      if (!next.pendingQuestions.some((q) => q.questionId === event.question.questionId)) {
        next = { ...next, pendingQuestions: [...next.pendingQuestions, event.question] };
      }
      break;
    case "question-answered":
      next = {
        ...next,
        pendingQuestions: next.pendingQuestions.filter((q) => q.questionId !== event.questionId),
      };
      break;
    case "artifact-published": {
      const rest = next.artifacts.filter((a) => a.artifactId !== event.artifact.artifactId);
      next = { ...next, artifacts: [...rest, event.artifact] };
      break;
    }
    case "run-completed":
      next = { ...next, status: "completed", resultPreview: event.resultPreview, pendingQuestions: [] };
      break;
    case "run-errored":
      next = {
        ...next,
        status: "errored",
        error: event.error,
        resumable: event.resumable ? true : undefined,
        pendingQuestions: [],
      };
      break;
    case "run-stopped":
      next = {
        ...next,
        status: "stopped",
        stopReason: event.reason,
        resumable: event.resumable ? true : undefined,
        pendingQuestions: [],
      };
      break;
  }
  return withActorStatus(next);
}

export function foldRun(runId: string, startAt: number, envelopes: readonly RunEventEnvelope[]): RunState {
  return envelopes.reduce(reduceRun, initialRunState(runId, startAt));
}

export function summarizeRun(state: RunState): RunSummary {
  return {
    runId: state.runId,
    name: state.name,
    status: state.status,
    stopReason: state.stopReason,
    startedAt: state.startedAt,
    updatedAt: state.updatedAt,
    resumable: state.resumable,
    spentTokens: state.usage.spentTokens,
    actorCount: state.actors.length,
    phaseCount: state.phases.length,
    artifactCount: state.artifacts.length,
    pendingQuestionCount: state.pendingQuestions.length,
  };
}
