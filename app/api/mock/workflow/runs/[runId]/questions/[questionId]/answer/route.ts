import { command, readJson } from "@/lib/workflow/http";
import { answerQuestion } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** Body: `{ "choice": "..." }`. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ runId: string; questionId: string }> },
) {
  const { runId, questionId } = await params;
  const body = await readJson<{ choice: string }>(request);
  return command(answerQuestion(runId, questionId, body.choice ?? ""));
}
