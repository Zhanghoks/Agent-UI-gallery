import { json } from "@/lib/workflow/http";
import { listSaved } from "@/lib/workflow/mock-server";

export const dynamic = "force-dynamic";

/** Saved workflows, each with the most recent run of the same name. */
export function GET() {
  return json({ workflows: listSaved() });
}
