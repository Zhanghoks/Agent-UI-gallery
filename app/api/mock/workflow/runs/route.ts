import { json } from "@/lib/workflow/http";
import { listRunSummaries } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** Run directory, newest first. */
export function GET() {
  return json({ runs: listRunSummaries() });
}
