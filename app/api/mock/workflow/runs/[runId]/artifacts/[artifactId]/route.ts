import { json, notFound } from "@/lib/workflow/http";
import { artifactPage } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** One page of an artifact's content. `?after=<sequence>&limit=<n>` pages forward. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ runId: string; artifactId: string }> },
) {
  const { runId, artifactId } = await params;
  const query = new URL(request.url).searchParams;
  const page = artifactPage(
    runId,
    artifactId,
    Math.max(0, Number(query.get("after")) || 0),
    Math.min(500, Math.max(1, Number(query.get("limit")) || 200)),
  );
  return page ? json(page) : notFound(`artifact ${artifactId} in run ${runId}`);
}
