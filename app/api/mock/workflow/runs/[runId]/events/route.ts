import { noStore, notFound, type RunParams } from "@/lib/workflow/http";
import { eventsAfter, getRunState, planStream } from "@/lib/workflow/mock-server";
import { isTerminal } from "@/lib/workflow/reducer";
import type { RunStreamMessage } from "@/lib/workflow/protocol";

export const dynamic = "force-dynamic";

const POLL_MS = 150;
const REPLAY_GAP_MS = 40;

const frame = (message: RunStreamMessage) => `event: ${message.kind}\ndata: ${JSON.stringify(message)}\n\n`;

/**
 * Server-sent events for one run: a snapshot first, then events, then `end`.
 * No `after` → snapshot is "now". `?after=0` replays the run from its start.
 */
export async function GET(request: Request, { params }: RunParams) {
  const { runId } = await params;
  const afterParam = new URL(request.url).searchParams.get("after");
  const after = afterParam === null ? undefined : Math.max(0, Number(afterParam) || 0);
  const plan = planStream(runId, after);
  if (!plan) return notFound(`run ${runId}`);

  const encoder = new TextEncoder();
  let closed = false;
  const stream = new ReadableStream<Uint8Array>({
    cancel() {
      closed = true;
    },
    async start(controller) {
      const send = (message: RunStreamMessage) => {
        if (!closed) controller.enqueue(encoder.encode(frame(message)));
      };
      const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      let sent = plan.snapshot.lastEventSequence;
      send({ kind: "snapshot", state: plan.snapshot });

      // A replay from the start walks the backlog slowly enough to watch.
      const replay = after !== undefined;
      while (!closed && !request.signal.aborted) {
        for (const envelope of eventsAfter(runId, sent)) {
          send({ kind: "event", envelope });
          sent = envelope.sequence;
          if (replay) await pause(REPLAY_GAP_MS);
        }
        const state = getRunState(runId);
        if (!state || (isTerminal(state.status) && state.lastEventSequence <= sent)) {
          send({ kind: "end", status: state?.status ?? "stopped" });
          break;
        }
        await pause(POLL_MS);
      }
      if (!closed) controller.close();
      closed = true;
    },
  });

  return new Response(stream, {
    headers: { ...noStore, "Content-Type": "text/event-stream; charset=utf-8", Connection: "keep-alive" },
  });
}
