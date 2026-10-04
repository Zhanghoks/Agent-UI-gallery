import type { CommandResult } from "./protocol";

/* Small response helpers for the mock routes. Commands answer 200 with
 * `{ ok: false, reason }` for a rejected command, the way the protocol says —
 * a rejection is a normal outcome, not a transport error. */

export const noStore = { "Cache-Control": "no-store" } as const;

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: noStore });
}

export function notFound(what: string): Response {
  return json({ error: "not_found", message: `No ${what}.` }, 404);
}

export function command(result: CommandResult<object>): Response {
  return json(result);
}

export async function readJson<T>(request: Request): Promise<Partial<T>> {
  try {
    return (await request.json()) as Partial<T>;
  } catch {
    return {};
  }
}

export type RunParams = { params: Promise<{ runId: string }> };
