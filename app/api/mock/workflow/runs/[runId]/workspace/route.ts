import { json, notFound, type RunParams } from "@/lib/workflow/http";
import { listWorkspace } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RunParams) {
  const { runId } = await params;
  const workspace = listWorkspace(runId);
  return workspace ? json(workspace) : notFound(`run ${runId}`);
}
