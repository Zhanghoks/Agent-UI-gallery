"use client";

import { useState } from "react";
import { WorkflowArtifactIndex } from "@/components/gallery/workflow-artifact";
import { SavedWorkflowCard } from "@/components/gallery/workflow-saved-card";
import { WorkflowQuestionCard } from "@/components/gallery/workflow-question-card";
import { WorkflowRunCard } from "@/components/gallery/workflow-run-card";
import { WorkflowRunHistory, type RunHistoryRow } from "@/components/gallery/workflow-run-history";
import { WorkflowWorkspaceLog } from "@/components/gallery/workflow-workspace-log";
import { api, postJson, useRunStream, usePoll } from "@/lib/workflow/client";
import { formatDuration, formatTokens, toArtifactData, toRunCardProps, toWorkspaceLog } from "@/lib/workflow/project";
import {
  workflowRoutes,
  type AnswerQuestionResult,
  type CancelRunResult,
  type ResumeRunResult,
  type RunSummary,
  type SavedWorkflow,
  type StartSavedWorkflowResult,
} from "@/lib/workflow/protocol";

/* ─────────────────────────────────────────────────────────
 * WORKFLOW CONSOLE
 * The workflow components wired to the mock workflow server.
 * Everything on this page crosses the protocol: lists and
 * commands are plain HTTP, the open run is an event stream
 * folded by the same reducer a real client would use.
 * ───────────────────────────────────────────────────────── */

function ago(ms: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (seconds < 20) return "just now";
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))}m ago`;
  if (seconds < 86_400) return `${Math.round(seconds / 3600)}h ago`;
  return `${Math.round(seconds / 86_400)}d ago`;
}

const historyRow = (run: RunSummary): RunHistoryRow => {
  const ended = run.status === "completed" || run.status === "errored" || run.status === "stopped";
  return {
    id: run.runId,
    name: run.name,
    status: run.status,
    when: ago(run.startedAt),
    duration: ended ? formatDuration(run.updatedAt - run.startedAt) : undefined,
    tokens: run.spentTokens > 0 ? formatTokens(run.spentTokens) : undefined,
    actors: run.actorCount > 0 ? String(run.actorCount) : undefined,
    resumable: run.resumable,
  };
};

export default function WorkflowConsole() {
  const [runId, setRunId] = useState("run_db_migration");
  const [epoch, setEpoch] = useState(0);
  const [startingId, setStartingId] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [open, setOpen] = useState<string>();
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  const state = useRunStream(runId, epoch);
  const live = state?.status === "running" || state?.status === "pending";
  const [runs, refreshRuns] = usePoll(api.runs, 2000);
  const [saved, refreshSaved] = usePoll(api.saved, 4000);
  const [workspace] = usePoll(() => (runId ? api.workspace(runId) : Promise.resolve([])), 1500, true);

  const refresh = () => {
    refreshRuns();
    refreshSaved();
  };
  const select = (id: string) => {
    setRunId(id);
    setOpen(undefined);
    setOutputs({});
  };
  const report = (result: { ok: boolean } & Partial<{ message: string; reason: string }>, done: string) =>
    setMessage(result.ok ? done : (result.message ?? result.reason));

  const start = async (name: string) => {
    setStartingId(name);
    const result = await postJson<StartSavedWorkflowResult>(workflowRoutes.startSaved(name), { args: {} });
    setStartingId(undefined);
    if (result.ok) select(result.runId);
    report(result, `Started ${name}`);
    refresh();
  };
  const cancel = async () => {
    report(await postJson<CancelRunResult>(workflowRoutes.cancel(runId)), "Stopped");
    refresh();
  };
  const resume = async (id = runId) => {
    const result = await postJson<ResumeRunResult>(workflowRoutes.resume(id));
    if (result.ok) select(result.runId);
    report(result, "Resumed");
    refresh();
  };
  const answer = async (questionId: string, choice: string) => {
    report(await postJson<AnswerQuestionResult>(workflowRoutes.answer(runId, questionId), { choice }), "Answer sent");
  };
  const toggleLog = (nodeId: string) => {
    setOpen((current) => (current === nodeId ? undefined : nodeId));
    if (!outputs[nodeId]) {
      api.workspaceResult(runId, nodeId).then(
        (result) => result.result && setOutputs((current) => ({ ...current, [nodeId]: result.result! })),
        () => undefined,
      );
    }
  };

  const workspacePhases = new Set((workspace ?? []).map((node) => node.phaseName).filter((name): name is string => !!name));
  const card = state ? toRunCardProps(state, workspacePhases) : undefined;
  const questions = (state?.pendingQuestions ?? []).map((question, index) => ({
    id: question.questionId,
    actorName: question.actorName,
    avatarIndex: index + 1,
    question: question.question,
    context: question.context,
    choices: question.choices,
  }));

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-[1100px] gap-6 p-6 md:grid-cols-[360px_1fr]">
      <aside className="flex flex-col gap-5">
        <header>
          <h1 className="text-[15px] font-medium text-ink">Workflow console</h1>
          <p className="mt-1 text-[12px] leading-snug text-ink-3">
            Components on the left and right talk to <code className="font-mono">/api/mock/workflow</code>.
          </p>
        </header>
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-medium uppercase tracking-wide text-ink-3">Saved</h2>
          {(saved ?? []).map((workflow: SavedWorkflow) => (
            <SavedWorkflowCard
              busy={startingId === workflow.name}
              key={workflow.name}
              onRun={() => start(workflow.name)}
              workflow={{
                id: workflow.name,
                name: workflow.name,
                scope: workflow.scope,
                description: workflow.description,
                args: workflow.args.map((arg) => arg.name),
                lastRun: workflow.lastRun
                  ? { status: workflow.lastRun.status, when: ago(workflow.lastRun.startedAt) }
                  : undefined,
              }}
            />
          ))}
        </section>
        <WorkflowRunHistory onOpenRun={select} onResume={resume} runs={(runs ?? []).map(historyRow)} />
      </aside>

      <section className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-mono text-[12px] text-ink-2">{runId}</h2>
          <div className="flex items-center gap-2 text-[11px] text-ink-3">
            {message ? <span>{message}</span> : null}
            {state?.runId === "run_db_migration" ? (
              <button
                className="rounded-full bg-hover-2 px-2.5 py-1 text-ink hover:bg-line-strong"
                onClick={() => {
                  api.restart("run_db_migration", 3).then(() => {
                    select("run_db_migration");
                    setEpoch((value) => value + 1);
                  });
                }}
                type="button"
              >
                Replay at 3×
              </button>
            ) : null}
          </div>
        </div>

        {card ? (
          <WorkflowRunCard
            {...card}
            onCancel={live ? cancel : undefined}
            onOpenArtifact={(id) => setMessage(`Open artifact ${id}`)}
            onResume={state?.resumable ? () => resume() : undefined}
          />
        ) : (
          <p className="text-[12px] text-ink-3">Connecting…</p>
        )}

        {questions.length > 0 ? <WorkflowQuestionCard onAnswer={answer} questions={questions} /> : null}

        {(workspace ?? []).length > 0 ? (
          <div>
            <h3 className="pb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-3">Workspace</h3>
            <WorkflowWorkspaceLog entries={toWorkspaceLog(workspace ?? [], outputs, state?.startedAt)} onToggle={toggleLog} openId={open} />
          </div>
        ) : null}

        {state && state.artifacts.length > 0 ? (
          <div>
            <h3 className="pb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-3">Artifacts</h3>
            <WorkflowArtifactIndex
              artifacts={state.artifacts.map(toArtifactData)}
              onOpen={(id) => setMessage(`Open artifact ${id}`)}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
