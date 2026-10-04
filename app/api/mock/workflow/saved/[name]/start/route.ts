import { command, readJson } from "@/lib/workflow/http";
import { startSaved } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** Body: `{ "args": { ... } }`. Answers with the new run's id. */
export async function POST(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const body = await readJson<{ args: Record<string, unknown> }>(request);
  return command(startSaved(name, body.args ?? {}));
}
