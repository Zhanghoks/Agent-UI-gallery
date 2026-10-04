"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  workflowRoutes,
  type CommandResult,
  type RunState,
  type RunStreamMessage,
  type RunSummary,
  type SavedWorkflow,
  type WorkspaceNode,
  type WorkspaceNodeResult,
} from "./protocol";
import { reduceRun } from "./reducer";

/* Browser-side access to the workflow routes: plain fetch helpers, a stream
 * hook that keeps one run's state live, and a poller for list-shaped reads.
 * Point the routes at a real backend and nothing here changes. */

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return (await response.json()) as T;
}

export async function postJson<T extends CommandResult<object>>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  try {
    return (await response.json()) as T;
  } catch {
    return { ok: false, reason: "unavailable", message: `HTTP ${response.status}` } as T;
  }
}

export const api = {
  runs: () => getJson<{ runs: RunSummary[] }>(workflowRoutes.runs()).then((data) => data.runs),
  saved: () => getJson<{ workflows: SavedWorkflow[] }>(workflowRoutes.saved()).then((data) => data.workflows),
  workspace: (runId: string) =>
    getJson<{ nodes: WorkspaceNode[] }>(workflowRoutes.workspace(runId)).then((data) => data.nodes),
  workspaceResult: (runId: string, nodeId: string) =>
    getJson<WorkspaceNodeResult>(workflowRoutes.workspaceResult(runId, nodeId)),
  restart: (runId: string, speed: number) => getJson<RunState>(workflowRoutes.restart(runId, speed)),
};

/** Re-reads `load` every `ms` while `active`, and once on demand through `refresh`. */
export function usePoll<T>(load: () => Promise<T>, ms: number, active = true) {
  const [value, setValue] = useState<T>();
  const loadRef = useRef(load);
  loadRef.current = load;
  const refresh = useCallback(() => {
    loadRef.current().then(setValue, () => undefined);
  }, []);
  useEffect(() => {
    refresh();
    if (!active) return;
    const timer = setInterval(refresh, ms);
    return () => clearInterval(timer);
  }, [refresh, ms, active]);
  return [value, refresh] as const;
}

/**
 * Keeps one run's state live: an opening snapshot, then each event folded in.
 * Closes itself when the server says the run ended. Returns undefined until
 * the snapshot arrives. Bump `epoch` to reconnect to the same run, e.g. after a restart.
 */
export function useRunStream(runId: string | undefined, epoch = 0): RunState | undefined {
  const [state, setState] = useState<RunState>();
  useEffect(() => {
    setState(undefined);
    if (!runId) return;
    const source = new EventSource(workflowRoutes.events(runId));
    const receive = (raw: MessageEvent<string>) => {
      let message: RunStreamMessage;
      try {
        message = JSON.parse(raw.data) as RunStreamMessage;
      } catch {
        return;
      }
      if (message.kind === "snapshot") setState(message.state);
      else if (message.kind === "event") setState((current) => (current ? reduceRun(current, message.envelope) : current));
      else source.close();
    };
    source.addEventListener("snapshot", receive as EventListener);
    source.addEventListener("event", receive as EventListener);
    source.addEventListener("end", receive as EventListener);
    return () => source.close();
  }, [runId, epoch]);
  return state;
}
