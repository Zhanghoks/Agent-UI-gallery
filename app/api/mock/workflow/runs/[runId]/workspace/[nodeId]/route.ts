import { json, notFound } from "@/lib/workflow/http";
import { workspaceResult } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** Output of one workspace call. `?maxBytes=` caps it; `truncated` says if it was cut. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ runId: string; nodeId: string }> },
) {
  const { runId, nodeId } = await params;
  const maxBytes = Number(new URL(request.url).searchParams.get("maxBytes")) || undefined;
  const result = workspaceResult(runId, nodeId, maxBytes);
  return result ? json(result) : notFound(`workspace node ${nodeId} in run ${runId}`);
}
