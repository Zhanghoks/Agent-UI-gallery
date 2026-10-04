"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { HelpBubbleIcon } from "@/components/atoms/Icons";
import { faceColor } from "@/components/gallery/workflow-timeline";

/* A run parked on a person. Each question names the sub-agent that asked
 * (face color by identity, like the timeline), gives its context, and offers
 * answers as buttons plus a free reply. Several questions show one at a time
 * with a counter. The host sends the answer; the card never talks to a server. */

export type WorkflowQuestion = {
  id: string;
  /** Who asked. Absent when the run itself did. */
  actorName?: string;
  avatarIndex?: number;
  question: string;
  context?: string;
  choices?: readonly string[];
};

export type QuestionCardLabels = {
  title: string;
  of: (index: number, total: number) => string;
  placeholder: string;
  send: string;
  sent: string;
  askedBy: (name: string) => string;
};

export const QUESTION_CARD_LABELS: QuestionCardLabels = {
  title: "Waiting for you",
  of: (index, total) => `${index} of ${total}`,
  placeholder: "Or write an answer…",
  send: "Send",
  sent: "Answer sent",
  askedBy: (name) => `${name} asks`,
};

export type WorkflowQuestionCardProps = {
  questions: readonly WorkflowQuestion[];
  labels?: Partial<QuestionCardLabels>;
  onAnswer?: (id: string, answer: string) => void;
};

export function WorkflowQuestionCard({ questions, labels: labelOverrides, onAnswer }: WorkflowQuestionCardProps) {
  const labels = { ...QUESTION_CARD_LABELS, ...labelOverrides };
  const [draft, setDraft] = useState("");
  const current = questions[0];
  if (!current) return null;
  const answer = (value: string) => {
    const text = value.trim();
    if (!text) return;
    onAnswer?.(current.id, text);
    setDraft("");
  };
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2.5 rounded-card bg-surface p-3 shadow-card">
      <div className="flex items-center justify-between gap-2 text-[11px] text-ink-3">
        <span className="inline-flex items-center gap-1.5 text-orange">
          <HelpBubbleIcon size={13} />
          {labels.title}
        </span>
        {questions.length > 1 ? <span className="font-mono">{labels.of(1, questions.length)}</span> : null}
      </div>
      {current.actorName ? (
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-5 place-items-center rounded-full text-[10px] font-medium text-white"
            style={{ background: faceColor(current.avatarIndex ?? 0) }}
          >
            {current.actorName.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-[12px] text-ink-2">{labels.askedBy(current.actorName)}</span>
        </div>
      ) : null}
      <p className="text-[13px] leading-snug text-ink">{current.question}</p>
      {current.context ? <p className="rounded-control bg-inset px-2.5 py-2 text-[12px] leading-snug text-ink-2">{current.context}</p> : null}
      {current.choices && current.choices.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {current.choices.map((choice) => (
            <Button disabled={!onAnswer} key={choice} onClick={() => answer(choice)} size="sm" variant="secondary">
              {choice}
            </Button>
          ))}
        </div>
      ) : null}
      {onAnswer ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            answer(draft);
          }}
        >
          <input
            className="min-w-0 flex-1 rounded-full bg-field px-3 py-1.5 text-[12px] text-ink outline-none placeholder:text-ink-3 focus-visible:ring-2 focus-visible:ring-accent"
            onChange={(event) => setDraft(event.target.value)}
            placeholder={labels.placeholder}
            value={draft}
          />
          <Button disabled={!draft.trim()} size="sm" type="submit" variant="primary">
            {labels.send}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

const QUESTIONS: WorkflowQuestion[] = [
  {
    id: "cutover",
    actorName: "Shard B",
    avatarIndex: 1,
    question: "events is still copying. Cut reads over now, or wait for the last 800k rows?",
    context: "Verified 9.10M of 9.90M events. At the current rate the rest takes about four minutes.",
    choices: ["Wait for the copy", "Cut over now"],
  },
  {
    id: "drop",
    actorName: "Cutter",
    avatarIndex: 3,
    question: "Drop orders_v1 after the cutover, or keep it for a week?",
    choices: ["Drop it", "Keep for a week"],
  },
];

export default function WorkflowQuestionCardDemo({ variant }: { variant?: string }) {
  const [asked, setAsked] = useState<WorkflowQuestion[]>(variant === "Two questions" ? QUESTIONS : QUESTIONS.slice(0, 1));
  const [last, setLast] = useState<string>();
  const [lastVariant, setLastVariant] = useState(variant);
  if (variant !== lastVariant) {
    setLastVariant(variant);
    setAsked(variant === "Two questions" ? QUESTIONS : QUESTIONS.slice(0, 1));
    setLast(undefined);
  }
  return (
    <div className="flex w-full flex-col items-center gap-2 pb-8">
      {asked.length > 0 ? (
        <WorkflowQuestionCard
          onAnswer={(id, text) => {
            setAsked((current) => current.filter((question) => question.id !== id));
            setLast(`Answered “${text}”`);
          }}
          questions={asked}
        />
      ) : (
        <p className="w-full max-w-[420px] rounded-card bg-surface p-3 text-[12px] text-ink-2 shadow-card">
          {QUESTION_CARD_LABELS.sent}. The run continues.
        </p>
      )}
      {last ? <p className="text-[11px] text-ink-3">{last}</p> : null}
    </div>
  );
}
