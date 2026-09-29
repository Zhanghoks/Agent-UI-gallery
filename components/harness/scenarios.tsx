"use client";

import { useEffect, useState, type ReactNode } from "react";
import AgentScreen from "@/components/gallery/agent-screen";
import ApprovalCard from "@/components/gallery/approval-card";
import ContextCards from "@/components/gallery/context-cards";
import DiffTable from "@/components/gallery/diff-table";
import InsightCards from "@/components/gallery/insight-cards";
import LoadingState from "@/components/gallery/loading-state";
import RecommendationCard from "@/components/gallery/recommendation-card";
import RecordsTable from "@/components/gallery/records-table";
import SelectionActions from "@/components/gallery/selection-actions";
import StreamingText from "@/components/gallery/streaming-text";
import TaskRows from "@/components/gallery/task-rows";
import ThinkingState from "@/components/gallery/thinking-state";
import ToolChips from "@/components/gallery/tool-chips";

/* ─────────────────────────────────────────────────────────
 * DEMO SCENARIOS
 * The fake data behind the harness: each scenario maps a user prompt to an
 * agent reply built from gallery components. To wire a real agent, replace
 * this module — Harness.tsx only renders what it provides.
 * ───────────────────────────────────────────────────────── */

export const NAME = "Shane";

/* ── shared bits ──────────────────────────────────────────── */

/* the charts land only after the streamed text has finished */
function WorkloadAnswer() {
  const [showCards, setShowCards] = useState(false);

  return (
    <>
      <div className="max-w-[630px]">
        <StreamingText fill loop={false} onDone={() => setShowCards(true)} />
      </div>
      {showCards && (
        <div className="mt-5" style={{ animation: "fade-up 450ms cubic-bezier(0.23,1,0.32,1) both" }}>
          <InsightCards />
        </div>
      )}
    </>
  );
}

/* a lightweight word-by-word reveal, reusing the streaming keyframe */
function StreamLine({
  text,
  tone = "ink",
  onDone,
}: {
  text: string;
  tone?: "ink" | "ink-2";
  onDone?: () => void;
}) {
  const words = text.split(" ");
  const [n, setN] = useState(0);
  const streaming = n < words.length;
  useEffect(() => {
    if (!streaming) return;
    const t = setTimeout(() => setN((c) => c + 1), 34);
    return () => clearTimeout(t);
  }, [n, streaming]);
  useEffect(() => {
    if (!streaming) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);
  return (
    <p className={`max-w-[620px] text-[13.5px] leading-[1.65] ${tone === "ink" ? "text-ink" : "text-ink-2"}`}>
      {words.slice(0, n).map((word, i) => (
        <span key={i} className="inline">
          {word}{" "}
        </span>
      ))}
      {streaming && <span className="stream-caret is-streaming" />}
    </p>
  );
}

/* a consistent reply: the intro streams in, then the artifact reveals below it
 * once the text settles — so nothing pops in before the sentence lands. */
function Reply({ intro, children }: { intro: string; children?: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <>
      <StreamLine text={intro} tone="ink-2" onDone={() => setReady(true)} />
      {ready && children != null && (
        <div className="mt-5" style={{ animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both" }}>
          {children}
        </div>
      )}
    </>
  );
}

/* the offboarding flow: answer the questions, the card collapses to a small
 * badge, then the agent thinks again and streams a short confirmation. */
function OffboardingAnswer() {
  const [stage, setStage] = useState<"form" | "thinking" | "done">("form");

  useEffect(() => {
    if (stage !== "thinking") return;
    const t = setTimeout(() => setStage("done"), 1100);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <>
      <Reply intro="Before I archive the vendor, confirm a few details. Single questions advance on their own; multi-selects wait for the arrow.">
        <ApprovalCard resettable={false} onSubmitted={() => setStage("thinking")} />
      </Reply>
      {stage === "thinking" && (
        <div className="mt-4 flex min-h-6 items-center" style={{ animation: "fade-in 200ms ease-out both" }}>
          <LoadingState label="Archiving vendor" variant="Dots" />
        </div>
      )}
      {stage === "done" && (
        <div className="mt-4" style={{ animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both" }}>
          <StreamLine text="Done — I archived Fjord Dairy, moved its 3 open orders to Northwind Creamery, and flagged the cold-chain certificate for renewal. Nothing else in the workflow references the vendor." />
        </div>
      )}
    </>
  );
}

/* the answer streams only after the search trace settles */
function FindTicketAnswer() {
  const [settled, setSettled] = useState(false);
  return (
    <>
      <ThinkingState variant="Search" onSettled={() => setSettled(true)} />
      {settled && (
        <div className="mt-1" style={{ animation: "fade-in 200ms ease-out both" }}>
          <StreamLine tone="ink-2" text="Found it — the flavor page redesign ticket, plus the two docs it references. The retrieved chunks are in the side panel." />
        </div>
      )}
    </>
  );
}

/* the side-panel agent viewer: connects, then goes live once the browser opens */
function BrowserPane() {
  const [variant, setVariant] = useState<"Loading" | "Working">("Loading");
  useEffect(() => {
    const t = setTimeout(() => setVariant("Working"), 2400);
    return () => clearTimeout(t);
  }, []);
  return <AgentScreen agentName="Browser agent" variant={variant} />;
}

/* the browser flow: spin up a browser, show the plan as a thinking trace, then
 * stream a confirmation once the (fake) appeal is filed */
function ParkingAppealAnswer() {
  const [stage, setStage] = useState<"boot" | "think" | "working" | "done">("boot");

  useEffect(() => {
    if (stage !== "working") return;
    const t = setTimeout(() => setStage("done"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <>
      <StreamLine
        tone="ink-2"
        text="Spinning up a browser — you can watch it work in the panel on the right, or click in to take a look."
        onDone={() => setStage((s) => (s === "boot" ? "think" : s))}
      />
      {stage !== "boot" && (
        <div className="mt-4" style={{ animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both" }}>
          <ThinkingState
            variant="Steps"
            active="Working the appeal"
            done="Filed the appeal"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
            }
            rows={[
              { primary: "Opening the city parking portal" },
              { primary: "Locating citation #A4471902" },
              { primary: "Filling out the appeal form" },
              { primary: "Attaching evidence", secondary: "2 photos · permit" },
            ]}
            onSettled={() => setStage((s) => (s === "think" ? "working" : s))}
          />
        </div>
      )}
      {stage === "working" && (
        <div className="mt-4 flex min-h-6 items-center" style={{ animation: "fade-in 200ms ease-out both" }}>
          <LoadingState label="Submitting the appeal" variant="Dots" />
        </div>
      )}
      {stage === "done" && (
        <div className="mt-4" style={{ animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both" }}>
          <StreamLine text="Done — the appeal for citation #A4471902 is submitted. The city portal returned confirmation PA-6621 and it's now under review; you'll hear back within 14 days. I attached the two curb-sign photos and your resident permit as evidence." />
        </div>
      )}
    </>
  );
}

/* ── scenarios ────────────────────────────────────────────────
 * Each maps a user prompt to an agent reply built from primitives.
 * `beat` is how long the agent "thinks" before the answer resolves
 * — shorter when the answer leads with its own live trace.
 */

export type Scenario = {
  prompt: string;
  beat: number;
  Answer: () => ReactNode;
  /** optional one-off waiting treatment for a scenario */
  loadingVariant?: "Surfer";
  /** render the answer across the full chat window instead of the reading column */
  fullBleed?: boolean;
  /** optional artifact for the right-hand pane */
  paneTitle?: string;
  Pane?: () => ReactNode;
  /** spreadsheet workspace: the main pane is a live table, the chat docks to the right */
  Workspace?: () => ReactNode;
  workspaceTitle?: string;
};

export const SCENARIOS: Record<string, Scenario> = {
  appeal: {
    prompt: "Appeal my parking ticket — citation #A4471902.",
    beat: 500,
    paneTitle: "Agent",
    Pane: () => <BrowserPane />,
    Answer: () => <ParkingAppealAnswer />,
  },
  todos: {
    prompt: "What urgent to-dos need my attention this morning?",
    beat: 1100,
    paneTitle: "Tasks",
    Pane: () => (
      <>
        <TaskRows variant="List" />
        <div className="mt-6">
          <ContextCards />
        </div>
      </>
    ),
    Answer: () => (
      <Reply intro="Three things are time-sensitive. I put the checklist in the side panel, ordered by how soon they’ll bite — and there’s one call worth making first.">
        <RecommendationCard />
      </Reply>
    ),
  },
  workload: {
    prompt: "Prep a summary of my workload.",
    beat: 900,
    Answer: () => <WorkloadAnswer />,
  },
  offboarding: {
    prompt: "I need your approval before I off-board a supplier.",
    beat: 850,
    Answer: () => <OffboardingAnswer />,
  },
  "find-ticket": {
    prompt: "There was a ticket about redesigning the flavor page — can you find it?",
    beat: 500,
    paneTitle: "Context",
    Pane: () => <ContextCards />,
    Answer: () => <FindTicketAnswer />,
  },
  suppliers: {
    prompt: "Show me our supplier records.",
    beat: 700,
    workspaceTitle: "Suppliers",
    Workspace: () => <RecordsTable fill />,
    Answer: () => (
      <StreamLine tone="ink-2" text="The grid’s on the left. Ask me to filter, enrich, or add a column — I’ll update the table live and show my work here." />
    ),
  },
  restock: {
    prompt: "Draft the batch restock function.",
    beat: 500,
    Answer: () => (
      <Reply intro="I planned it out and staged the edits. Hover a file chip to preview its diff — nothing runs until you say so.">
        <ToolChips />
      </Reply>
    ),
  },
  edits: {
    prompt: "Propose edits to the flavor list.",
    beat: 1000,
    Answer: () => (
      <Reply intro="I staged the changes as a reviewable draft — nothing is applied yet. Sweep through and approve what looks right.">
        <DiffTable />
      </Reply>
    ),
  },
  rewrite: {
    prompt: "Help me tighten this launch note.",
    beat: 700,
    Answer: () => (
      <Reply intro="Select any passage and hand it to me. I highlighted a line below — pick an action or describe the edit.">
        <SelectionActions />
      </Reply>
    ),
  },
  surfer: {
    prompt: "Can you audit the launch plan—and put Subway Surfers underneath so my attention span stays on payroll?",
    beat: 18000,
    loadingVariant: "Surfer",
    Answer: () => <Reply intro="All done. Thanks for locking in with me." />,
  },
};

export type ScenarioId = keyof typeof SCENARIOS;

const KEYWORDS: [ScenarioId, string[]][] = [
  ["appeal", ["appeal", "parking", "citation", "contest", "dispute", "fine", "browser"]],
  ["todos", ["todo", "to-do", "urgent", "morning", "attention", "task"]],
  ["workload", ["summary", "summarize", "workload", "overview", "recap", "digest"]],
  ["offboarding", ["approve", "approval", "off-board", "offboard", "confirm", "sign off"]],
  ["find-ticket", ["find", "search", "ticket", "where", "look up", "locate"]],
  ["suppliers", ["supplier", "records", "vendor", "table", "maker", "grid"]],
  ["restock", ["restock", "code", "function", "batch", "script", "reorder"]],
  ["edits", ["edit", "diff", "change", "propose", "update the", "flavor list"]],
  ["rewrite", ["rewrite", "tighten", "reword", "shorten", "note", "copy"]],
];

export function matchScenario(text: string): ScenarioId {
  const lower = text.toLowerCase();
  for (const [id, words] of KEYWORDS) {
    if (words.some((word) => lower.includes(word))) return id;
  }
  return "workload";
}



export const SUGGESTION_POOL: { id: ScenarioId; label: string }[] = [
  { id: "appeal", label: "Appeal my parking ticket" },
  { id: "suppliers", label: "Show me our supplier records" },
  { id: "todos", label: "What urgent to-dos need my attention this morning?" },
  { id: "workload", label: "Prep a summary of my workload" },
  { id: "find-ticket", label: "Find the ticket about the flavor page redesign" },
  { id: "restock", label: "Draft the batch restock function" },
  { id: "rewrite", label: "Tighten this launch note" },
];

export const RECENTS: { id: ScenarioId; label: string; prompt?: string }[] = [
  { id: "appeal", label: "Parking ticket appeal", prompt: SCENARIOS.appeal.prompt },
  { id: "suppliers", label: "Supplier records" },
  { id: "todos", label: "Urgent to-dos this morning" },
  { id: "find-ticket", label: "Flavor page ticket" },
  { id: "workload", label: "Workload summary" },
  { id: "offboarding", label: "Off-board a supplier" },
  { id: "restock", label: "Batch restock function" },
  { id: "edits", label: "Propose flavor edits" },
  { id: "surfer", label: "Subway surfing", prompt: SCENARIOS.surfer.prompt },
];
