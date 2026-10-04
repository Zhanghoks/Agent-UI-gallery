"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, ListIcon } from "@/components/atoms/Icons";

/* An agent's plan: a title, a count, and one row per step. Every step has a
 * status; the running one carries a live dot, a skipped one is struck through.
 * The card folds to its header. Status comes from props — the host decides when
 * a step moves. */

export type PlanStepStatus = "pending" | "running" | "done" | "skipped";

export type PlanStep = { id: string; text: string; status: PlanStepStatus };

export type PlanCardLabels = { progress: (done: number, total: number) => string; skipped: string };

export const PLAN_CARD_LABELS: PlanCardLabels = {
  progress: (done, total) => `${done}/${total}`,
  skipped: "skipped",
};

function Mark({ status }: { status: PlanStepStatus }) {
  if (status === "done") {
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-green text-white">
        <CheckIcon size={10} strokeWidth={3} />
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full border border-orange">
        <span className="size-1.5 animate-pulse rounded-full bg-orange motion-reduce:animate-none" />
      </span>
    );
  }
  return <span className={`size-4 shrink-0 rounded-full border ${status === "skipped" ? "border-line bg-inset" : "border-line-strong"}`} />;
}

export type PlanCardProps = {
  title: string;
  steps: readonly PlanStep[];
  /** Start folded. */
  collapsed?: boolean;
  labels?: Partial<PlanCardLabels>;
};

export function PlanCard({ title, steps, collapsed = false, labels: labelOverrides }: PlanCardProps) {
  const labels = { ...PLAN_CARD_LABELS, ...labelOverrides };
  const [open, setOpen] = useState(!collapsed);
  const done = steps.filter((step) => step.status === "done").length;
  return (
    <div className="w-full max-w-[420px] rounded-card bg-surface p-3 shadow-card">
      <button
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <ListIcon className="text-ink-3" size={14} />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{title}</span>
        <span className="font-mono text-[11px] text-ink-3">{labels.progress(done, steps.length)}</span>
        <ChevronDownIcon className={`text-ink-3 transition-transform ${open ? "" : "-rotate-90"}`} size={14} />
      </button>
      {open ? (
        <ol className="mt-2.5 flex flex-col gap-2">
          {steps.map((step) => (
            <li className="flex items-start gap-2.5" key={step.id}>
              <span className="mt-0.5">
                <Mark status={step.status} />
              </span>
              <span
                className={`text-[12.5px] leading-snug ${
                  step.status === "done" ? "text-ink-2" : step.status === "pending" ? "text-ink-2" : step.status === "skipped" ? "text-ink-3 line-through" : "text-ink"
                }`}
              >
                {step.text}
                {step.status === "skipped" ? <span className="ml-1.5 text-[10.5px] no-underline">({labels.skipped})</span> : null}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

const TEXTS = [
  "Read the failing test and the module it covers",
  "Reproduce the failure locally",
  "Fix the date parsing in `parseRange`",
  "Run the full suite",
  "Write the commit message",
];

export default function PlanCardDemo({ variant }: { variant?: string }) {
  const [step, setStep] = useState(variant === "Done" ? TEXTS.length : 0);
  useEffect(() => {
    if (variant === "Done" || step >= TEXTS.length) return;
    const timer = setTimeout(() => setStep((value) => value + 1), 1300);
    return () => clearTimeout(timer);
  }, [step, variant]);
  const steps: PlanStep[] = TEXTS.map((text, index) => ({
    id: String(index),
    text,
    status: index < step ? "done" : index === step ? "running" : "pending",
  }));
  return (
    <div className="w-full pb-8">
      <PlanCard steps={steps} title="Fix the flaky date test" />
    </div>
  );
}
