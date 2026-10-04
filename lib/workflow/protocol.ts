/* ─────────────────────────────────────────────────────────
 * WORKFLOW DISPLAY PROTOCOL
 * The wire contract between a workflow engine and the workflow
 * components. It is the gallery's own: plain TypeScript types,
 * no schema library, no product import. A real backend implements
 * these routes and event shapes; the mock server in this folder
 * is one such implementation.
 *
 * Everything here describes what the UI shows, not how an engine
 * runs. `project.ts` turns it into the components' display models.
 * ───────────────────────────────────────────────────────── */

export const PROTOCOL_VERSION = 1 as const;

/* ── vocabulary ─────────────────────────────────────────── */

export type RunStatus = "pending" | "running" | "completed" | "errored" | "stopped";
/** Why a run is `stopped`. Only `errored` is an error. */
export type StopReason = "user" | "model" | "provider" | "interrupted" | "superseded";
export type ActorStatus = "waiting" | "running" | "completed";
export type NodePhase =
  | "queued"
  | "dispatched"
  | "executing"
  | "waiting"
  | "repairing"
  | "nudged"
  | "settled";
export type NodeOutcome = "ok" | "failed" | "cancelled";
export type ArtifactKind = "file" | "markdown" | "chart" | "table" | "metrics" | "board";

/* ── run state ──────────────────────────────────────────── */

/** A sub-agent the script created. The workspace is not an actor. */
export type RunActor = {
  actorId: string;
  name: string;
  status: ActorStatus;
  /** The phase the control flow was in when this actor was created. */
  phaseName?: string;
  /** Transcript session, for drill-down. */
  sessionId?: string;
};

export type NodeLastTool = { name: string; target?: string };

/** One dispatched piece of work: an ask to an actor, or a workspace read. */
export type RunNode = {
  nodeId: string;
  kind: "ask" | "world-read";
  phase: NodePhase;
  /** Present once `phase` is `settled`. */
  outcome?: NodeOutcome;
  actorId?: string;
  phaseName?: string;
  /** First ~240 chars of the task, enough to see what the actor was sent to do. */
  instructionsHead?: string;
  toolCalls?: number;
  lastTool?: NodeLastTool;
};

/** A stage the control flow has entered. `rounds` only grows. */
export type RunPhase = { name: string; rounds: number };

export type RunUsage = { spentTokens: number; nodesUsed: number };

export type RunArtifactSummary = {
  artifactId: string;
  kind: ArtifactKind;
  title?: string;
  /** Versions start at 1; the UI shows a version only from 2. */
  version: number;
  contentType?: string;
  bytes?: number;
  itemCount?: number;
  /** The one the author flagged as the deliverable. */
  primary?: true;
};

/** A question an actor escalated and the run is parked on. */
export type PendingQuestion = {
  questionId: string;
  actorId?: string;
  actorName?: string;
  question: string;
  context?: string;
  askedAt: number;
  /** Suggested answers the UI may offer as buttons. */
  choices?: string[];
};

export type RunState = {
  runId: string;
  name: string;
  status: RunStatus;
  stopReason?: StopReason;
  /** Earlier run this one continues, and the later run that replaced this one. */
  resumedFrom?: string;
  supersededBy?: string;
  resumable?: true;
  error?: string;
  resultPreview?: string;
  startedAt: number;
  updatedAt: number;
  usage: RunUsage;
  /** Declared phase order, known up front when the script announced it. */
  phaseNames?: string[];
  /** Phases entered so far. */
  phases: RunPhase[];
  currentPhase?: string;
  /** Index groups of `phaseNames` that run side by side (branches). */
  phaseAlongside?: number[][];
  actors: RunActor[];
  nodes: RunNode[];
  pendingQuestions: PendingQuestion[];
  artifacts: RunArtifactSummary[];
  /** Highest event sequence folded into this state. */
  lastEventSequence: number;
};

/** One row of the run directory. */
export type RunSummary = Pick<
  RunState,
  "runId" | "name" | "status" | "stopReason" | "startedAt" | "updatedAt" | "resumable"
> & {
  spentTokens: number;
  actorCount: number;
  phaseCount: number;
  artifactCount: number;
  pendingQuestionCount: number;
};

/* ── events ─────────────────────────────────────────────── */

export type RunEvent =
  | { type: "run-started"; name: string; phaseNames?: string[]; phaseAlongside?: number[][] }
  | { type: "phase-entered"; name: string }
  | { type: "actor-created"; actorId: string; name: string; phaseName?: string; sessionId?: string }
  | {
      type: "node-queued";
      nodeId: string;
      kind: "ask" | "world-read";
      actorId?: string;
      phaseName?: string;
      instructionsHead?: string;
    }
  | { type: "node-advanced"; nodeId: string; phase: NodePhase }
  | { type: "node-progress"; nodeId: string; toolCalls: number; lastTool?: NodeLastTool }
  | { type: "node-settled"; nodeId: string; outcome: NodeOutcome }
  | { type: "usage-updated"; spentTokens: number }
  | { type: "question-asked"; question: PendingQuestion }
  | { type: "question-answered"; questionId: string }
  | { type: "artifact-published"; artifact: RunArtifactSummary }
  | { type: "run-completed"; resultPreview?: string }
  | { type: "run-errored"; error: string; resumable?: boolean }
  | { type: "run-stopped"; reason: StopReason; resumable?: boolean };

export type RunEventEnvelope = {
  /** Strictly increasing per run, starting at 1. */
  sequence: number;
  runId: string;
  at: number;
  event: RunEvent;
};

/**
 * What the SSE stream carries. A `snapshot` always comes first (state at the
 * requested `after`), then `event`s, then `end` when the run is terminal.
 */
export type RunStreamMessage =
  | { kind: "snapshot"; state: RunState }
  | { kind: "event"; envelope: RunEventEnvelope }
  | { kind: "end"; status: RunStatus };

/* ── artifacts ──────────────────────────────────────────── */

export type ArtifactVersion = {
  version: number;
  title?: string;
  description?: string;
  contentType?: string;
  bytes?: number;
  sourcePath?: string;
  publishedAt: number;
};

export type RunArtifact = RunArtifactSummary & {
  description?: string;
  sourcePath?: string;
  versions: ArtifactVersion[];
  itemCount: number;
};

export type ArtifactItem = { sequence: number; actorId?: string; item: unknown };

export type ArtifactPage = { items: ArtifactItem[]; hasMore: boolean };

/* ── workspace (what the script did to the project) ─────── */

export type WorkspaceNodeKind = "read" | "search" | "git" | "terminal" | "step";
export type WorkspaceNodeStatus = "running" | "completed" | "failed";

export type WorkspaceNode = {
  nodeId: string;
  kind: WorkspaceNodeKind;
  /** Short verb for the row: "Read", "Run", "Commit". */
  op: string;
  args?: string[];
  status: WorkspaceNodeStatus;
  error?: { code: string; message: string };
  summary?: {
    resultBytes: number;
    resultCount?: number;
    exitCode?: number;
  };
  phaseName?: string;
  createdAt: number;
  updatedAt: number;
};

export type WorkspaceNodeResult = {
  status: WorkspaceNodeStatus;
  result?: string;
  error?: { code: string; message: string };
  truncated: boolean;
  totalBytes: number;
};

/* ── saved workflows ────────────────────────────────────── */

export type SavedWorkflowArg = {
  name: string;
  type: "string" | "number" | "boolean";
  required?: boolean;
  default?: string | number | boolean;
  description?: string;
};

export type SavedWorkflow = {
  name: string;
  scope: "project" | "global";
  description: string;
  path: string;
  phases: string[];
  args: SavedWorkflowArg[];
  lastRun?: RunSummary;
};

/* ── commands ───────────────────────────────────────────── */

export type CommandRejection =
  | "not_found"
  | "not_resumable"
  | "superseded"
  | "already_terminal"
  | "invalid_args";

export type CommandResult<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; reason: CommandRejection; message: string };

export type ResumeRunResult = CommandResult<{ runId: string }>;
export type CancelRunResult = CommandResult;
export type AnswerQuestionResult = CommandResult;
export type StartSavedWorkflowResult = CommandResult<{ runId: string }>;

/* ── routes ─────────────────────────────────────────────── */

/** Base path of the mock server. A real backend can mount the same tree anywhere. */
export const WORKFLOW_API_BASE = "/api/mock/workflow";

export const workflowRoutes = {
  runs: () => `${WORKFLOW_API_BASE}/runs`,
  run: (runId: string) => `${WORKFLOW_API_BASE}/runs/${runId}`,
  events: (runId: string, after = 0) => `${WORKFLOW_API_BASE}/runs/${runId}/events?after=${after}`,
  artifacts: (runId: string) => `${WORKFLOW_API_BASE}/runs/${runId}/artifacts`,
  artifactData: (runId: string, artifactId: string) =>
    `${WORKFLOW_API_BASE}/runs/${runId}/artifacts/${artifactId}`,
  workspace: (runId: string) => `${WORKFLOW_API_BASE}/runs/${runId}/workspace`,
  workspaceResult: (runId: string, nodeId: string) =>
    `${WORKFLOW_API_BASE}/runs/${runId}/workspace/${nodeId}`,
  resume: (runId: string) => `${WORKFLOW_API_BASE}/runs/${runId}/resume`,
  cancel: (runId: string) => `${WORKFLOW_API_BASE}/runs/${runId}/cancel`,
  answer: (runId: string, questionId: string) =>
    `${WORKFLOW_API_BASE}/runs/${runId}/questions/${questionId}/answer`,
  saved: () => `${WORKFLOW_API_BASE}/saved`,
  startSaved: (name: string) => `${WORKFLOW_API_BASE}/saved/${name}/start`,
} as const;
