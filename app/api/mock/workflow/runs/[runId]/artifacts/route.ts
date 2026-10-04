import { json, notFound, type RunParams } from "@/lib/workflow/http";
import { listArtifacts } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RunParams) {
  const { runId } = await params;
  const artifacts = listArtifacts(runId);
  return artifacts ? json({ artifacts }) : notFound(`run ${runId}`);
}
