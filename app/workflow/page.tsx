import type { Metadata } from "next";
import WorkflowConsole from "@/components/harness/WorkflowConsole";
import config from "@/foundry.config.json";

export const metadata: Metadata = {
  title: `Workflow console — ${config.name}`,
  description: "The workflow components driven by the mock workflow server: start, watch, answer, stop, resume.",
};

export default function WorkflowPage() {
  return <WorkflowConsole />;
}
