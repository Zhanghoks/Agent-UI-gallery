import { json, notFound, type RunParams } from "@/lib/workflow/http";
import { getRunState, restartRun } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** Current state of one run. `?restart=1&speed=4` rewinds a live demo run. */
export async function GET(request: Request, { params }: RunParams) {
  const { runId } = await params;
  const query = new URL(request.url).searchParams;
  if (query.get("restart") === "1") restartRun(runId, Number(query.get("speed")) || 1);
  const state = getRunState(runId);
  return state ? json(state) : notFound(`run ${runId}`);
}
