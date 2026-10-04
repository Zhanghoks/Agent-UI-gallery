import { command, type RunParams } from "@/lib/workflow/http";
import { cancelRun } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: RunParams) {
  const { runId } = await params;
  return command(cancelRun(runId));
}
