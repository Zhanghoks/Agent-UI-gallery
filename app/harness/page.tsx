import type { Metadata } from "next";
import IceCreamHarness from "@/components/site/IceCreamHarness";
import config from "@/foundry.config.json";

export const metadata: Metadata = {
  title: `${config.harnessName} — ${config.name}`,
  description:
    `An interactive chat window built entirely from ${config.name} components. Ask a question and watch the agent think, stream, and build the answer out of live components.`,
};

export default function HarnessPage() {
  return <IceCreamHarness />;
}
