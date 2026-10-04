import {
  RUN_FIXTURES,
  SAVED_WORKFLOW_FIXTURES,
  type RunFixture,
  type ScriptEntry,
} from "./fixtures";
import type {
  AnswerQuestionResult,
  ArtifactPage,
  CancelRunResult,
  RunArtifact,
  RunEvent,
  RunEventEnvelope,
  RunState,
  RunSummary,
  ResumeRunResult,
  SavedWorkflow,
  StartSavedWorkflowResult,
  WorkspaceNode,
  WorkspaceNodeResult,
} from "./protocol";
import { foldRun, isTerminal, summarizeRun } from "./reducer";

/* In-memory stand-in for a workflow engine. It plays each run's event script
 * on a clock: ended runs are fully played, a live run starts its clock when
 * first read. Commands (cancel, answer, resume, start) change the script the
 * way an engine would, so the UI can be exercised end to end.
 *
 * State lives on globalThis so dev-server reloads do not reset a running demo.
 * Nothing here is persisted. */

type Runtime = {
  fixture: RunFixture;
  /** Wall-clock ms when the replay began. Absent until a live run is first read. */
  clockStart?: number;
  /** Replay speed multiplier. */
  speed: number;
  /** Fixed base for ended runs, so history reads as history. */
  base: number;
  answered: Map<string, { at: number; choice: string }>;
  cancelAt?: number;
  resumedFrom?: string;
  supersededBy?: string;
};

type Store = { runs: Map<string, Runtime>; counter: number };

const globalStore = globalThis as unknown as { __workflowMock?: Store };

function store(): Store {
  if (!globalStore.__workflowMock) {
    const now = Date.now();
    globalStore.__workflowMock = {
      counter: 0,
      runs: new Map(
        RUN_FIXTURES.map((fixture) => [
          fixture.runId,
          { fixture, speed: 1, base: now - fixture.startedAgoMs, answered: new Map() } satisfies Runtime,
        ]),
      ),
    };
  }
  return globalStore.__workflowMock;
}

const runtime = (runId: string) => store().runs.get(runId);

/* ── timeline ───────────────────────────────────────────── */

function elapsedOf(rt: Runtime, now: number): number {
  if (!rt.fixture.live) return Number.POSITIVE_INFINITY;
  if (rt.clockStart === undefined) rt.clockStart = now;
  return (now - rt.clockStart) * rt.speed;
}

/** The run's whole timeline as it stands: gates resolved, cancellation applied. */
function timelineOf(rt: Runtime): Array<{ offset: number; event: RunEvent }> {
  const rows: Array<{ offset: number; event: RunEvent }> = [];
  for (const entry of rt.fixture.script as ScriptEntry[]) {
    const answered = entry.gate ? rt.answered.get(entry.gate)?.at : 0;
    if (answered === undefined) continue;
    rows.push({ offset: answered + entry.t, event: entry.event });
  }
  for (const [questionId, { at }] of rt.answered) {
    rows.push({ offset: at, event: { type: "question-answered", questionId } });
  }
  let result = rows;
  if (rt.cancelAt !== undefined) {
    const cutoff = rt.cancelAt;
    result = rows.filter((row) => row.offset <= cutoff);
    result.push({ offset: cutoff, event: { type: "run-stopped", reason: "user", resumable: true } });
  }
  return result.sort((a, b) => a.offset - b.offset);
}

function envelopesOf(rt: Runtime, now: number): RunEventEnvelope[] {
  const elapsed = elapsedOf(rt, now);
  const anchor = rt.fixture.live ? (rt.clockStart ?? now) : rt.base;
  const scale = rt.fixture.live ? 1 / rt.speed : 1;
  return timelineOf(rt)
    .map((row, index) => ({ row, sequence: index + 1 }))
    .filter(({ row }) => row.offset <= elapsed)
    .map(({ row, sequence }) => ({
      sequence,
      runId: rt.fixture.runId,
      at: Math.round(anchor + row.offset * scale),
      event: row.event,
    }));
}

function stateFrom(rt: Runtime, envelopes: readonly RunEventEnvelope[], now: number): RunState {
  const anchor = rt.fixture.live ? (rt.clockStart ?? now) : rt.base;
  const state = foldRun(rt.fixture.runId, anchor, envelopes);
  return {
    ...state,
    name: state.name === rt.fixture.runId ? rt.fixture.name : state.name,
    resumedFrom: rt.resumedFrom,
    supersededBy: rt.supersededBy,
    ...(rt.supersededBy ? { resumable: undefined, stopReason: "superseded" as const, status: "stopped" as const } : {}),
  };
}

/* ── reads ──────────────────────────────────────────────── */

export function getRunState(runId: string, now = Date.now()): RunState | undefined {
  const rt = runtime(runId);
  if (!rt) return undefined;
  return stateFrom(rt, envelopesOf(rt, now), now);
}

export function listRunSummaries(now = Date.now()): RunSummary[] {
  return [...store().runs.keys()]
    .map((id) => getRunState(id, now))
    .filter((state): state is RunState => state !== undefined)
    .map(summarizeRun)
    .sort((a, b) => b.startedAt - a.startedAt);
}

export type StreamPlan = {
  snapshot: RunState;
  /** Events after the snapshot that have already happened. */
  backlog: RunEventEnvelope[];
};

/** `after` undefined means "from now": snapshot is the current state. */
export function planStream(runId: string, after: number | undefined, now = Date.now()): StreamPlan | undefined {
  const rt = runtime(runId);
  if (!rt) return undefined;
  const visible = envelopesOf(rt, now);
  const from = after === undefined ? visible.length : Math.min(after, visible.length);
  return {
    snapshot: stateFrom(rt, visible.slice(0, from), now),
    backlog: visible.slice(from),
  };
}

export function eventsAfter(runId: string, sequence: number, now = Date.now()): RunEventEnvelope[] {
  const rt = runtime(runId);
  return rt ? envelopesOf(rt, now).filter((envelope) => envelope.sequence > sequence) : [];
}

export function listArtifacts(runId: string, now = Date.now()): RunArtifact[] | undefined {
  const rt = runtime(runId);
  const state = getRunState(runId, now);
  if (!rt || !state) return undefined;
  const published = new Set(state.artifacts.map((artifact) => artifact.artifactId));
  return rt.fixture.artifacts
    .filter((artifact) => published.has(artifact.artifactId))
    .map((artifact) => {
      const seen = state.artifacts.find((entry) => entry.artifactId === artifact.artifactId);
      const version = seen?.version ?? artifact.version;
      return {
        ...artifact,
        version,
        versions: artifact.versions
          .filter((entry) => entry.version <= version)
          .map((entry) => ({ ...entry, publishedAt: state.startedAt })),
      };
    });
}

export function artifactPage(
  runId: string,
  artifactId: string,
  after = 0,
  limit = 200,
  now = Date.now(),
): ArtifactPage | undefined {
  const rt = runtime(runId);
  if (!rt || !listArtifacts(runId, now)?.some((artifact) => artifact.artifactId === artifactId)) return undefined;
  const all = rt.fixture.artifactItems[artifactId] ?? [];
  const slice = all.slice(after, after + limit);
  return {
    items: slice.map((item, index) => ({ sequence: after + index + 1, item })),
    hasMore: after + limit < all.length,
  };
}

export function listWorkspace(runId: string, now = Date.now()): { nodes: WorkspaceNode[] } | undefined {
  const rt = runtime(runId);
  if (!rt) return undefined;
  const elapsed = elapsedOf(rt, now);
  const scale = rt.fixture.live ? 1 / rt.speed : 1;
  const anchor = rt.fixture.live ? (rt.clockStart ?? now) : rt.base;
  const nodes: WorkspaceNode[] = [];
  for (const entry of rt.fixture.workspace) {
    const gateAt = entry.gate ? rt.answered.get(entry.gate)?.at : 0;
    if (gateAt === undefined) continue;
    const start = gateAt + entry.t;
    if (start > elapsed) continue;
    const end = start + entry.durationMs;
    const interrupted = rt.cancelAt !== undefined && rt.cancelAt < end && rt.cancelAt >= start;
    const running = !interrupted && end > elapsed;
    const status = running ? "running" : interrupted ? "failed" : entry.status;
    nodes.push({
      nodeId: entry.nodeId,
      kind: entry.kind,
      op: entry.op,
      args: entry.args,
      status,
      phaseName: entry.phaseName,
      error: interrupted ? { code: "interrupted", message: "stopped by user" } : status === "failed" ? entry.error : undefined,
      summary:
        status === "running"
          ? undefined
          : {
              resultBytes: entry.result?.length ?? 0,
              resultCount: entry.resultCount,
              exitCode: entry.exitCode,
            },
      createdAt: Math.round(anchor + start * scale),
      updatedAt: Math.round(anchor + Math.min(end, elapsed) * scale),
    });
  }
  return { nodes };
}

export function workspaceResult(runId: string, nodeId: string, maxBytes = 32_768, now = Date.now()): WorkspaceNodeResult | undefined {
  const rt = runtime(runId);
  const node = listWorkspace(runId, now)?.nodes.find((entry) => entry.nodeId === nodeId);
  const entry = rt?.fixture.workspace.find((item) => item.nodeId === nodeId);
  if (!rt || !node || !entry) return undefined;
  const full = entry.result ?? "";
  return {
    status: node.status,
    result: node.status === "running" ? undefined : full.slice(0, maxBytes),
    error: node.error,
    truncated: full.length > maxBytes,
    totalBytes: full.length,
  };
}

export function listSaved(now = Date.now()): SavedWorkflow[] {
  const summaries = listRunSummaries(now);
  return SAVED_WORKFLOW_FIXTURES.map((saved) => ({
    ...saved,
    lastRun: summaries.find((run) => run.name === saved.name),
  }));
}

/* ── commands ───────────────────────────────────────────── */

export function cancelRun(runId: string, now = Date.now()): CancelRunResult {
  const rt = runtime(runId);
  if (!rt) return { ok: false, reason: "not_found", message: `No run ${runId}.` };
  const state = getRunState(runId, now);
  if (!state || isTerminal(state.status)) {
    return { ok: false, reason: "already_terminal", message: "The run has already ended." };
  }
  rt.cancelAt = elapsedOf(rt, now);
  return { ok: true };
}

export function answerQuestion(runId: string, questionId: string, choice: string, now = Date.now()): AnswerQuestionResult {
  const rt = runtime(runId);
  if (!rt) return { ok: false, reason: "not_found", message: `No run ${runId}.` };
  const state = getRunState(runId, now);
  if (!state?.pendingQuestions.some((question) => question.questionId === questionId)) {
    return { ok: false, reason: "not_found", message: `No pending question ${questionId}.` };
  }
  if (!choice.trim()) return { ok: false, reason: "invalid_args", message: "An answer is required." };
  rt.answered.set(questionId, { at: elapsedOf(rt, now), choice });
  return { ok: true };
}

function spawn(from: RunFixture, name: string, resumedFrom: string | undefined, script: ScriptEntry[], speed: number): Runtime {
  const s = store();
  s.counter += 1;
  const runId = `run_${name.replace(/[^a-z0-9]+/gi, "_")}_${s.counter}`;
  const fixture: RunFixture = { ...from, runId, name, live: true, startedAgoMs: 0, script };
  const rt: Runtime = { fixture, speed, base: Date.now(), answered: new Map(), resumedFrom };
  s.runs.set(runId, rt);
  return rt;
}

/** Fresh run from a saved workflow: replays its recorded script, or a generic one. */
export function startSaved(name: string, args: Record<string, unknown> = {}, now = Date.now()): StartSavedWorkflowResult {
  const saved = SAVED_WORKFLOW_FIXTURES.find((entry) => entry.name === name);
  if (!saved) return { ok: false, reason: "not_found", message: `No saved workflow ${name}.` };
  const missing = saved.args.filter((arg) => arg.required && arg.default === undefined && args[arg.name] === undefined);
  if (missing.length > 0) {
    return { ok: false, reason: "invalid_args", message: `Missing: ${missing.map((arg) => arg.name).join(", ")}.` };
  }
  const template = RUN_FIXTURES.find((fixture) => fixture.name === name);
  if (template && !template.live) {
    const rt = spawn(template, name, undefined, template.script, 6);
    rt.clockStart = now;
    return { ok: true, runId: rt.fixture.runId };
  }
  const generic: ScriptEntry[] = [{ t: 0, event: { type: "run-started", name, phaseNames: saved.phases } }];
  saved.phases.forEach((phase, index) => {
    const t = 400 + index * 5000;
    const id = `${phase.toLowerCase()}_${index}`;
    generic.push(
      { t, event: { type: "phase-entered", name: phase } },
      { t: t + 100, event: { type: "actor-created", actorId: id, name: phase, phaseName: phase } },
      { t: t + 300, event: { type: "node-queued", nodeId: `n_${id}`, kind: "ask", actorId: id, phaseName: phase, instructionsHead: `Run the ${phase.toLowerCase()} step.` } },
      { t: t + 500, event: { type: "node-advanced", nodeId: `n_${id}`, phase: "executing" } },
      { t: t + 4200, event: { type: "node-settled", nodeId: `n_${id}`, outcome: "ok" } },
      { t: t + 4300, event: { type: "usage-updated", spentTokens: (index + 1) * 6200 } },
    );
  });
  generic.push({ t: 400 + saved.phases.length * 5000, event: { type: "run-completed", resultPreview: `${name} finished.` } });
  const base: RunFixture = RUN_FIXTURES[0]!;
  const rt = spawn({ ...base, artifacts: [], artifactItems: {}, workspace: [] }, name, undefined, generic, 2);
  rt.clockStart = now;
  return { ok: true, runId: rt.fixture.runId };
}

/** Continue an errored or user-stopped run: a new run that replays the last phase. */
export function resumeRun(runId: string, now = Date.now()): ResumeRunResult {
  const rt = runtime(runId);
  if (!rt) return { ok: false, reason: "not_found", message: `No run ${runId}.` };
  const state = getRunState(runId, now);
  if (!state) return { ok: false, reason: "not_found", message: `No run ${runId}.` };
  if (state.supersededBy) return { ok: false, reason: "superseded", message: "A newer run replaced this one." };
  if (!state.resumable) return { ok: false, reason: "not_resumable", message: "This run cannot be resumed." };

  const phases = state.phaseNames ?? state.phases.map((phase) => phase.name);
  const resumeAt = state.currentPhase ?? phases[phases.length - 1] ?? "Resume";
  const script: ScriptEntry[] = [
    { t: 0, event: { type: "run-started", name: state.name, phaseNames: phases } },
    { t: 300, event: { type: "phase-entered", name: resumeAt } },
    { t: 400, event: { type: "actor-created", actorId: "resumer", name: "Resumer", phaseName: resumeAt } },
    { t: 600, event: { type: "node-queued", nodeId: "n_resume", kind: "ask", actorId: "resumer", phaseName: resumeAt, instructionsHead: `Pick up the ${resumeAt} step where the last run stopped.` } },
    { t: 800, event: { type: "node-advanced", nodeId: "n_resume", phase: "executing" } },
    { t: 5000, event: { type: "node-progress", nodeId: "n_resume", toolCalls: 2, lastTool: { name: "Bash", target: "npm test" } } },
    { t: 9000, event: { type: "node-settled", nodeId: "n_resume", outcome: "ok" } },
    { t: 9200, event: { type: "usage-updated", spentTokens: state.usage.spentTokens + 8200 } },
    { t: 9600, event: { type: "run-completed", resultPreview: `${state.name} resumed and finished.` } },
  ];
  const next = spawn(rt.fixture, state.name, runId, script, 1);
  next.clockStart = now;
  rt.supersededBy = next.fixture.runId;
  return { ok: true, runId: next.fixture.runId };
}

/** Rewind a live run to its start, optionally at a different speed. For demos and tests. */
export function restartRun(runId: string, speed = 1, now = Date.now()): boolean {
  const rt = runtime(runId);
  if (!rt || !rt.fixture.live) return false;
  rt.clockStart = now;
  rt.speed = Math.max(0.25, Math.min(speed, 60));
  rt.answered.clear();
  rt.cancelAt = undefined;
  return true;
}
