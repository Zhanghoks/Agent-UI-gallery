import type {
  ArtifactKind,
  NodeOutcome,
  RunArtifact,
  RunArtifactSummary,
  RunEvent,
  SavedWorkflow,
  WorkspaceNodeKind,
  WorkspaceNodeStatus,
} from "./protocol";

/* Mock data for the workflow display protocol.
 * Every run is a script of timed events, not a hand-written state: the
 * reducer folds the script into the state, so the snapshot, the stream and
 * the lists can never disagree. The runs cover the shapes the components
 * draw — completed, live with a parked question, errored, stopped by the
 * user, and a small older one. */

/** An event at `t` ms into the run. Entries with a `gate` happen `t` ms after that question is answered. */
export type ScriptEntry = { t: number; event: RunEvent; gate?: string };

export type WorkspaceFixture = {
  nodeId: string;
  /** Offset from the run start, and how long the call takes. */
  t: number;
  durationMs: number;
  kind: WorkspaceNodeKind;
  op: string;
  args?: string[];
  status: WorkspaceNodeStatus;
  phaseName?: string;
  resultCount?: number;
  exitCode?: number;
  error?: { code: string; message: string };
  result?: string;
  gate?: string;
};

export type RunFixture = {
  runId: string;
  name: string;
  /** A live run replays on a clock that starts when it is first read. */
  live?: boolean;
  /** Where on the clock an ended run sits, so lists read as history. */
  startedAgoMs: number;
  script: ScriptEntry[];
  artifacts: RunArtifact[];
  /** Pages of artifact content, by artifact id. */
  artifactItems: Record<string, unknown[]>;
  workspace: WorkspaceFixture[];
};

const SEC = 1000;

/* ── script helpers ─────────────────────────────────────── */

function summaryOf(artifact: RunArtifact, version = artifact.version): RunArtifactSummary {
  const v = artifact.versions.find((entry) => entry.version === version);
  return {
    artifactId: artifact.artifactId,
    kind: artifact.kind,
    title: v?.title ?? artifact.title,
    version,
    contentType: v?.contentType ?? artifact.contentType,
    bytes: v?.bytes,
    itemCount: artifact.itemCount,
    ...(artifact.primary ? { primary: true as const } : {}),
  };
}

const publish = (t: number, artifact: RunArtifact, version?: number, gate?: string): ScriptEntry => ({
  t,
  gate,
  event: { type: "artifact-published", artifact: summaryOf(artifact, version) },
});

/** One ask to an actor: queued → executing → a few tool calls → settled. */
function ask(
  t: number,
  nodeId: string,
  actorId: string,
  phaseName: string,
  head: string,
  durationMs: number,
  tools: Array<[name: string, target?: string]>,
  outcome: NodeOutcome | "open" = "ok",
  gate?: string,
): ScriptEntry[] {
  const step = durationMs / (tools.length + 1);
  const entries: ScriptEntry[] = [
    { t, gate, event: { type: "node-queued", nodeId, kind: "ask", actorId, phaseName, instructionsHead: head } },
    { t: t + 250, gate, event: { type: "node-advanced", nodeId, phase: "executing" } },
    ...tools.map(
      ([name, target], index): ScriptEntry => ({
        t: Math.round(t + step * (index + 1)),
        gate,
        event: { type: "node-progress", nodeId, toolCalls: index + 1, lastTool: { name, target } },
      }),
    ),
  ];
  if (outcome !== "open") {
    entries.push({ t: t + durationMs, gate, event: { type: "node-settled", nodeId, outcome } });
  }
  return entries;
}

const enter = (t: number, name: string, gate?: string): ScriptEntry => ({ t, gate, event: { type: "phase-entered", name } });
const actor = (t: number, actorId: string, name: string, phaseName: string, gate?: string): ScriptEntry => ({
  t,
  gate,
  event: { type: "actor-created", actorId, name, phaseName, sessionId: `sess_${actorId}` },
});
const tokens = (t: number, spentTokens: number, gate?: string): ScriptEntry => ({
  t,
  gate,
  event: { type: "usage-updated", spentTokens },
});

const sorted = (entries: ScriptEntry[]) => [...entries].sort((a, b) => a.t - b.t);

function artifact(
  artifactId: string,
  kind: ArtifactKind,
  title: string,
  options: {
    description?: string;
    contentType?: string;
    sourcePath?: string;
    itemCount: number;
    bytes?: number;
    primary?: boolean;
    versions?: number;
    publishedAt?: number;
  },
): RunArtifact {
  const count = options.versions ?? 1;
  return {
    artifactId,
    kind,
    title,
    description: options.description,
    contentType: options.contentType,
    sourcePath: options.sourcePath,
    version: count,
    itemCount: options.itemCount,
    ...(options.primary ? { primary: true as const } : {}),
    versions: Array.from({ length: count }, (_, index) => ({
      version: index + 1,
      title,
      description: options.description,
      contentType: options.contentType,
      bytes: options.bytes === undefined ? undefined : Math.round(options.bytes * (0.7 + 0.3 * ((index + 1) / count))),
      sourcePath: options.sourcePath,
      publishedAt: options.publishedAt ?? 0,
    })),
  };
}

/* ── run 1 · release-audit — completed, four phases, three in parallel ── */

const auditReport = artifact("audit-report", "markdown", "Release audit report", {
  description: "Findings grouped by severity, with the fix that landed for each.",
  contentType: "text/markdown",
  sourcePath: "reports/release-audit.md",
  itemCount: 1,
  bytes: 8_420,
  primary: true,
});
const auditFindings = artifact("audit-findings", "table", "Findings", {
  description: "Every issue the reviewers raised.",
  itemCount: 6,
  bytes: 2_150,
});
const auditSeverity = artifact("audit-severity", "chart", "Findings by severity", {
  description: "Counts per severity, before and after the fix pass.",
  itemCount: 4,
  bytes: 640,
  versions: 2,
});

const releaseAudit: RunFixture = {
  runId: "run_release_audit",
  name: "release-audit",
  startedAgoMs: 26 * 60 * SEC,
  artifacts: [auditReport, auditFindings, auditSeverity],
  artifactItems: {
    "audit-report": [
      {
        markdown:
          "# Release audit\n\nSix findings across three review lenses. Two were blocking and both are fixed.\n\n## Blocking\n- **Token logged on refresh** — `auth/session.ts` wrote the refresh token to the debug log. Redacted.\n- **N+1 on the dashboard query** — 140 queries per load. Batched to 3.\n\n## Non-blocking\n- Modal traps focus but not Escape.\n- Two unused feature flags.\n- Bundle grew 38 kB from a duplicate date library.\n- Missing alt text on the empty-state art.",
      },
    ],
    "audit-findings": [
      { severity: "high", area: "security", title: "Refresh token written to debug log", file: "auth/session.ts" },
      { severity: "high", area: "perf", title: "N+1 query on dashboard load", file: "dashboard/queries.ts" },
      { severity: "medium", area: "a11y", title: "Modal does not close on Escape", file: "ui/Modal.tsx" },
      { severity: "low", area: "perf", title: "Duplicate date library in bundle", file: "package.json" },
      { severity: "low", area: "security", title: "Two unused feature flags", file: "flags.ts" },
      { severity: "low", area: "a11y", title: "Empty-state art has no alt text", file: "ui/Empty.tsx" },
    ],
    "audit-severity": [
      { label: "high", before: 2, after: 0 },
      { label: "medium", before: 1, after: 1 },
      { label: "low", before: 3, after: 2 },
      { label: "info", before: 4, after: 4 },
    ],
  },
  script: sorted([
    { t: 0, event: { type: "run-started", name: "release-audit", phaseNames: ["Scan", "Review", "Fix", "Report"] } },
    enter(400, "Scan"),
    actor(500, "scanner", "Scanner", "Scan"),
    ...ask(700, "n_scan", "scanner", "Scan", "Map the diff since v2.3 and list the files each reviewer should read.", 28 * SEC, [
      ["Bash", "git diff --stat v2.3"],
      ["Read", "CHANGELOG.md"],
      ["Grep", "TODO|FIXME"],
    ]),
    tokens(29 * SEC, 18_400),
    enter(31 * SEC, "Review"),
    actor(31.2 * SEC, "sec", "Security", "Review"),
    actor(31.2 * SEC, "perf", "Performance", "Review"),
    actor(31.2 * SEC, "a11y", "Accessibility", "Review"),
    ...ask(31.5 * SEC, "n_sec", "sec", "Review", "Review the changed auth and session code for leaks and unsafe defaults.", 52 * SEC, [
      ["Read", "auth/session.ts"],
      ["Grep", "console.log"],
      ["Read", "auth/refresh.ts"],
    ]),
    ...ask(31.6 * SEC, "n_perf", "perf", "Review", "Profile the dashboard load path and look for repeated queries.", 64 * SEC, [
      ["Bash", "npm run bench:dashboard"],
      ["Read", "dashboard/queries.ts"],
    ]),
    ...ask(31.7 * SEC, "n_a11y", "a11y", "Review", "Check new components for keyboard and screen-reader gaps.", 47 * SEC, [
      ["Read", "ui/Modal.tsx"],
      ["Read", "ui/Empty.tsx"],
    ]),
    tokens(60 * SEC, 61_900),
    tokens(96 * SEC, 104_300),
    enter(98 * SEC, "Fix"),
    actor(98.2 * SEC, "fixer", "Fixer", "Fix"),
    ...ask(98.5 * SEC, "n_fix", "fixer", "Fix", "Fix the two blocking findings and add a test for each.", 72 * SEC, [
      ["Edit", "auth/session.ts"],
      ["Edit", "dashboard/queries.ts"],
      ["Bash", "npm test"],
    ]),
    tokens(168 * SEC, 171_000),
    enter(171 * SEC, "Report"),
    actor(171.2 * SEC, "writer", "Writer", "Report"),
    ...ask(171.5 * SEC, "n_report", "writer", "Report", "Write the audit report and the severity chart from the reviewers' findings.", 36 * SEC, [
      ["Write", "reports/release-audit.md"],
    ]),
    publish(190 * SEC, auditFindings),
    publish(200 * SEC, auditSeverity, 1),
    publish(206 * SEC, auditSeverity, 2),
    publish(207 * SEC, auditReport),
    tokens(208 * SEC, 196_700),
    { t: 209 * SEC, event: { type: "run-completed", resultPreview: "6 findings, 2 blocking, all blocking fixed." } },
  ]),
  workspace: [
    { nodeId: "w_1", t: 0.9 * SEC, durationMs: 1.4 * SEC, kind: "terminal", op: "Run", args: ["git diff --stat v2.3"], status: "completed", phaseName: "Scan", exitCode: 0, result: " auth/session.ts      | 14 +++--\n dashboard/queries.ts | 31 ++++---\n ui/Modal.tsx         |  9 ++-\n 7 files changed, 112 insertions(+), 44 deletions(-)" },
    { nodeId: "w_2", t: 3 * SEC, durationMs: 400, kind: "read", op: "Read", args: ["CHANGELOG.md"], status: "completed", phaseName: "Scan", resultCount: 62 },
    { nodeId: "w_3", t: 9 * SEC, durationMs: 900, kind: "search", op: "Search", args: ["TODO|FIXME"], status: "completed", phaseName: "Scan", resultCount: 5, result: "auth/refresh.ts:41  // TODO rotate on use\nflags.ts:7  // FIXME remove after launch" },
    { nodeId: "w_4", t: 33 * SEC, durationMs: 500, kind: "read", op: "Read", args: ["auth/session.ts"], status: "completed", phaseName: "Review", resultCount: 118 },
    { nodeId: "w_5", t: 45 * SEC, durationMs: 18 * SEC, kind: "terminal", op: "Run", args: ["npm run bench:dashboard"], status: "completed", phaseName: "Review", exitCode: 0, result: "dashboard load  ·  142 queries  ·  612 ms" },
    { nodeId: "w_6", t: 105 * SEC, durationMs: 600, kind: "step", op: "Edit", args: ["auth/session.ts"], status: "completed", phaseName: "Fix" },
    { nodeId: "w_7", t: 150 * SEC, durationMs: 14 * SEC, kind: "terminal", op: "Run", args: ["npm test"], status: "completed", phaseName: "Fix", exitCode: 0, result: "58 passed, 0 failed" },
    { nodeId: "w_8", t: 192 * SEC, durationMs: 1.2 * SEC, kind: "git", op: "Commit", args: ["fix: redact refresh token, batch dashboard query"], status: "completed", phaseName: "Report", resultCount: 3, result: "[audit-fixes 3f9c1e2] fix: redact refresh token, batch dashboard query\n 3 files changed" },
  ],
};

/* ── run 2 · db-migration — live replay, parks on a question ── */

const migrationRows = artifact("migration-rows", "metrics", "Row counts", {
  description: "Rows copied and verified per table.",
  itemCount: 4,
  bytes: 520,
  publishedAt: 0,
});
const migrationBoard = artifact("migration-board", "board", "Cutover checklist", {
  description: "Steps still open before the old table can be dropped.",
  itemCount: 6,
  bytes: 900,
  primary: true,
});

const QID = "q_cutover";

const dbMigration: RunFixture = {
  runId: "run_db_migration",
  name: "db-migration",
  live: true,
  startedAgoMs: 0,
  artifacts: [migrationRows, migrationBoard],
  artifactItems: {
    "migration-rows": [
      { table: "orders", copied: 1_204_883, verified: 1_204_883 },
      { table: "customers", copied: 88_410, verified: 88_410 },
      { table: "invoices", copied: 640_221, verified: 640_001 },
      { table: "events", copied: 9_902_114, verified: 9_100_000 },
    ],
    "migration-board": [
      { column: "Done", cards: ["Create orders_v2", "Backfill customers"] },
      { column: "Doing", cards: ["Backfill events", "Dual-write on orders"] },
      { column: "Next", cards: ["Cut reads over", "Drop orders_v1"] },
    ],
  },
  script: sorted([
    {
      t: 0,
      event: {
        type: "run-started",
        name: "db-migration",
        phaseNames: ["Plan", "Backfill", "Dual-write", "Cutover"],
        phaseAlongside: [[1, 2]],
      },
    },
    enter(300, "Plan"),
    actor(400, "planner", "Planner", "Plan"),
    ...ask(600, "m_plan", "planner", "Plan", "Plan the orders_v2 migration: tables, ordering, rollback.", 6 * SEC, [
      ["Read", "db/schema.sql"],
      ["Grep", "orders"],
    ]),
    tokens(7 * SEC, 9_200),
    enter(7.5 * SEC, "Backfill"),
    enter(7.7 * SEC, "Dual-write"),
    actor(7.8 * SEC, "shard_a", "Shard A", "Backfill"),
    actor(7.8 * SEC, "shard_b", "Shard B", "Backfill"),
    actor(7.9 * SEC, "writer", "Writer", "Dual-write"),
    ...ask(8 * SEC, "m_a", "shard_a", "Backfill", "Copy orders and customers in id order, 5k rows per batch.", 16 * SEC, [
      ["Bash", "psql -f backfill_a.sql"],
      ["Bash", "psql -c 'select count(*)'"],
      ["Bash", "psql -f verify_a.sql"],
    ]),
    ...ask(8.1 * SEC, "m_b", "shard_b", "Backfill", "Copy invoices and events; events is large, chunk by day.", 22 * SEC, [
      ["Bash", "psql -f backfill_b.sql"],
      ["Bash", "psql -f verify_b.sql"],
    ]),
    ...ask(8.2 * SEC, "m_w", "writer", "Dual-write", "Add dual-write to the orders handler behind a flag.", 12 * SEC, [
      ["Edit", "orders/handler.ts"],
      ["Bash", "npm test -- orders"],
    ]),
    tokens(16 * SEC, 41_700),
    publish(18 * SEC, migrationRows),
    {
      t: 20 * SEC,
      event: {
        type: "question-asked",
        question: {
          questionId: QID,
          actorId: "shard_b",
          actorName: "Shard B",
          question: "events is still copying. Cut reads over now, or wait for the last 800k rows?",
          context: "Verified 9.10M of 9.90M events. At the current rate the rest takes about four minutes.",
          askedAt: 20 * SEC,
          choices: ["Wait for the copy", "Cut over now"],
        },
      },
    },
    enter(500, "Cutover", QID),
    actor(700, "cutter", "Cutter", "Cutover", QID),
    ...ask(900, "m_cut", "cutter", "Cutover", "Switch reads to orders_v2 and watch error rates for two minutes.", 9 * SEC, [
      ["Edit", "config/reads.yaml"],
      ["Bash", "kubectl rollout status"],
      ["Bash", "curl -s /healthz"],
    ], "ok", QID),
    tokens(10 * SEC, 58_300, QID),
    publish(10.5 * SEC, migrationBoard, 1, QID),
    { t: 11 * SEC, gate: QID, event: { type: "run-completed", resultPreview: "orders_v2 is serving reads. orders_v1 left in place." } },
  ]),
  workspace: [
    { nodeId: "w_1", t: 1 * SEC, durationMs: 500, kind: "read", op: "Read", args: ["db/schema.sql"], status: "completed", phaseName: "Plan", resultCount: 204 },
    { nodeId: "w_2", t: 9 * SEC, durationMs: 13 * SEC, kind: "terminal", op: "Run", args: ["psql -f backfill_a.sql"], status: "completed", phaseName: "Backfill", exitCode: 0, result: "COPY 1204883\nCOPY 88410" },
    { nodeId: "w_3", t: 10 * SEC, durationMs: 19 * SEC, kind: "terminal", op: "Run", args: ["psql -f backfill_b.sql"], status: "failed", phaseName: "Backfill", exitCode: 1, error: { code: "exit_1", message: "canceling statement due to statement timeout" }, result: "COPY 640221\nERROR: canceling statement due to statement timeout" },
    { nodeId: "w_4", t: 12 * SEC, durationMs: 700, kind: "step", op: "Edit", args: ["orders/handler.ts"], status: "completed", phaseName: "Dual-write" },
    { nodeId: "w_5", t: 14 * SEC, durationMs: 6 * SEC, kind: "terminal", op: "Run", args: ["npm test -- orders"], status: "completed", phaseName: "Dual-write", exitCode: 0, result: "21 passed" },
    { nodeId: "w_6", t: 2 * SEC, durationMs: 3 * SEC, kind: "terminal", op: "Run", args: ["kubectl rollout status"], status: "completed", phaseName: "Cutover", exitCode: 0, gate: QID, result: "deployment \"api\" successfully rolled out" },
  ],
};

/* ── run 3 · deploy-staging — errored, resumable ── */

const deployLog = artifact("deploy-log", "file", "deploy.log", {
  description: "Full output of the failed rollout.",
  contentType: "text/plain",
  sourcePath: "logs/deploy.log",
  itemCount: 1,
  bytes: 31_200,
});

const deployStaging: RunFixture = {
  runId: "run_deploy_staging",
  name: "deploy-staging",
  startedAgoMs: 3 * 60 * 60 * SEC,
  artifacts: [deployLog],
  artifactItems: { "deploy-log": [{ text: "step 4/6  rollout api … timed out after 120s\nready 1/3  crashloop: missing env STRIPE_KEY" }] },
  script: sorted([
    { t: 0, event: { type: "run-started", name: "deploy-staging", phaseNames: ["Build", "Deploy"] } },
    enter(300, "Build"),
    actor(400, "builder", "Builder", "Build"),
    ...ask(600, "d_build", "builder", "Build", "Build and push the staging image.", 41 * SEC, [
      ["Bash", "docker build ."],
      ["Bash", "docker push"],
    ]),
    tokens(42 * SEC, 12_600),
    enter(43 * SEC, "Deploy"),
    actor(43.2 * SEC, "deployer", "Deployer", "Deploy"),
    ...ask(43.5 * SEC, "d_deploy", "deployer", "Deploy", "Roll the new image out to staging and wait for ready.", 120 * SEC, [
      ["Bash", "kubectl apply -f staging.yaml"],
      ["Bash", "kubectl rollout status"],
    ], "failed"),
    publish(165 * SEC, deployLog),
    tokens(166 * SEC, 27_900),
    { t: 167 * SEC, event: { type: "run-errored", error: "Rollout timed out: api crashlooped on a missing STRIPE_KEY.", resumable: true } },
  ]),
  workspace: [
    { nodeId: "w_1", t: 2 * SEC, durationMs: 39 * SEC, kind: "terminal", op: "Run", args: ["docker build ."], status: "completed", phaseName: "Build", exitCode: 0, result: "Successfully built 8e1b44d" },
    { nodeId: "w_2", t: 46 * SEC, durationMs: 120 * SEC, kind: "terminal", op: "Run", args: ["kubectl rollout status"], status: "failed", phaseName: "Deploy", exitCode: 1, error: { code: "timeout", message: "timed out waiting for the condition" }, result: "Waiting for deployment \"api\" rollout to finish: 1 of 3 updated replicas are available…" },
  ],
};

/* ── run 4 · dependency-sweep — stopped by the user ── */

const sweepDiff = artifact("sweep-diff", "file", "bumps.diff", {
  description: "Version bumps applied before the run was stopped.",
  contentType: "text/x-diff",
  sourcePath: "tmp/bumps.diff",
  itemCount: 1,
  bytes: 4_800,
});

const dependencySweep: RunFixture = {
  runId: "run_dependency_sweep",
  name: "dependency-sweep",
  startedAgoMs: 25 * 60 * 60 * SEC,
  artifacts: [sweepDiff],
  artifactItems: { "sweep-diff": [{ text: "- react 19.0.0\n+ react 19.1.0\n- next 15.2.4\n+ next 15.3.3" }] },
  script: sorted([
    { t: 0, event: { type: "run-started", name: "dependency-sweep", phaseNames: ["Audit", "Bump", "Verify"] } },
    enter(300, "Audit"),
    actor(400, "auditor", "Auditor", "Audit"),
    ...ask(600, "s_audit", "auditor", "Audit", "List outdated packages and group them by risk.", 19 * SEC, [
      ["Bash", "npm outdated"],
      ["Read", "package.json"],
    ]),
    tokens(20 * SEC, 8_100),
    enter(21 * SEC, "Bump"),
    actor(21.2 * SEC, "bumper", "Bumper", "Bump"),
    ...ask(21.5 * SEC, "s_bump", "bumper", "Bump", "Bump the low-risk group and fix type errors.", 14 * SEC, [
      ["Edit", "package.json"],
      ["Bash", "npm install"],
    ], "cancelled"),
    publish(34 * SEC, sweepDiff),
    tokens(35 * SEC, 15_300),
    { t: 36 * SEC, event: { type: "run-stopped", reason: "user", resumable: true } },
  ]),
  workspace: [
    { nodeId: "w_1", t: 2 * SEC, durationMs: 11 * SEC, kind: "terminal", op: "Run", args: ["npm outdated"], status: "completed", phaseName: "Audit", exitCode: 1, result: "react  19.0.0  19.1.0\nnext   15.2.4  15.3.3" },
    { nodeId: "w_2", t: 24 * SEC, durationMs: 9 * SEC, kind: "terminal", op: "Run", args: ["npm install"], status: "failed", phaseName: "Bump", error: { code: "interrupted", message: "stopped by user" } },
  ],
};

/* ── run 5 · weekly-digest — small, older, completed ── */

const digestNote = artifact("digest", "markdown", "Weekly digest", {
  contentType: "text/markdown",
  sourcePath: "digest/2026-W39.md",
  itemCount: 1,
  bytes: 3_100,
  primary: true,
});

const weeklyDigest: RunFixture = {
  runId: "run_weekly_digest",
  name: "weekly-digest",
  startedAgoMs: 6 * 24 * 60 * 60 * SEC,
  artifacts: [digestNote],
  artifactItems: { digest: [{ markdown: "# Week 39\n\n- 14 PRs merged, 2 reverted\n- Median review time 3h 10m\n- One incident, resolved in 22 minutes" }] },
  script: sorted([
    { t: 0, event: { type: "run-started", name: "weekly-digest", phaseNames: ["Gather", "Write"] } },
    enter(300, "Gather"),
    actor(400, "gatherer", "Gatherer", "Gather"),
    ...ask(600, "g_1", "gatherer", "Gather", "Collect merged PRs and incidents for the week.", 24 * SEC, [["Bash", "gh pr list --state merged"]]),
    tokens(25 * SEC, 6_200),
    enter(26 * SEC, "Write"),
    actor(26.2 * SEC, "digester", "Digester", "Write"),
    ...ask(26.5 * SEC, "g_2", "digester", "Write", "Write a short digest from the collected items.", 18 * SEC, [["Write", "digest/2026-W39.md"]]),
    publish(45 * SEC, digestNote),
    tokens(46 * SEC, 11_800),
    { t: 47 * SEC, event: { type: "run-completed", resultPreview: "Digest written." } },
  ]),
  workspace: [
    { nodeId: "w_1", t: 3 * SEC, durationMs: 4 * SEC, kind: "terminal", op: "Run", args: ["gh pr list --state merged"], status: "completed", phaseName: "Gather", exitCode: 0, result: "14 pull requests" },
  ],
};

export const RUN_FIXTURES: RunFixture[] = [
  dbMigration,
  releaseAudit,
  deployStaging,
  dependencySweep,
  weeklyDigest,
];

export const LIVE_QUESTION_ID = QID;

/* ── saved workflows ────────────────────────────────────── */

export type SavedWorkflowFixture = Omit<SavedWorkflow, "lastRun">;

export const SAVED_WORKFLOW_FIXTURES: SavedWorkflowFixture[] = [
  {
    name: "release-audit",
    scope: "project",
    description: "Scan a release diff with three parallel reviewers, fix what blocks, and write the report.",
    path: ".agent/workflows/release-audit.js",
    phases: ["Scan", "Review", "Fix", "Report"],
    args: [
      { name: "since", type: "string", required: true, default: "v2.3", description: "Tag or commit to diff against" },
      { name: "fix", type: "boolean", default: true, description: "Apply fixes for blocking findings" },
    ],
  },
  {
    name: "db-migration",
    scope: "project",
    description: "Backfill into a new table while dual-writing, then cut reads over.",
    path: ".agent/workflows/db-migration.js",
    phases: ["Plan", "Backfill", "Dual-write", "Cutover"],
    args: [
      { name: "table", type: "string", required: true, description: "Table to migrate" },
      { name: "batchSize", type: "number", default: 5000 },
    ],
  },
  {
    name: "deploy-staging",
    scope: "global",
    description: "Build, push and roll an image out to staging.",
    path: "~/.agent/workflows/deploy-staging.js",
    phases: ["Build", "Deploy"],
    args: [{ name: "tag", type: "string", default: "latest" }],
  },
  {
    name: "dependency-sweep",
    scope: "global",
    description: "Group outdated packages by risk and bump the safe ones.",
    path: "~/.agent/workflows/dependency-sweep.js",
    phases: ["Audit", "Bump", "Verify"],
    args: [],
  },
  {
    name: "weekly-digest",
    scope: "global",
    description: "Summarize the week's merged work and incidents.",
    path: "~/.agent/workflows/weekly-digest.js",
    phases: ["Gather", "Write"],
    args: [{ name: "week", type: "string", description: "ISO week, defaults to the last one" }],
  },
  {
    name: "docs-link-check",
    scope: "project",
    description: "Crawl the docs and report dead links.",
    path: ".agent/workflows/docs-link-check.js",
    phases: ["Crawl", "Report"],
    args: [],
  },
];
