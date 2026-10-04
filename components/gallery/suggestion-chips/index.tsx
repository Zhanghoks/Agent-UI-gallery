"use client";

import { useState } from "react";
import { SparkIcon } from "@/components/atoms/Icons";

/* Prompts the agent offers after an answer. A chip is a whole message: tapping
 * it hands the text to the host to send. "Row" wraps chips inline; "Stack" is a
 * list for narrow panes. */

export type Suggestion = { id: string; text: string };

export type SuggestionChipsProps = {
  suggestions: readonly Suggestion[];
  layout?: "row" | "stack";
  onPick?: (text: string, id: string) => void;
};

export function SuggestionChips({ suggestions, layout = "row", onPick }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;
  return (
    <div className={layout === "stack" ? "flex w-full max-w-[320px] flex-col items-stretch gap-1.5" : "flex w-full max-w-[460px] flex-wrap gap-1.5"}>
      {suggestions.map((suggestion) => (
        <button
          className={`inline-flex items-center gap-1.5 bg-surface px-3 py-1.5 text-left text-[12.5px] text-ink shadow-btn hover:bg-inset disabled:pointer-events-none ${
            layout === "stack" ? "rounded-control" : "rounded-full"
          }`}
          disabled={!onPick}
          key={suggestion.id}
          onClick={() => onPick?.(suggestion.text, suggestion.id)}
          type="button"
        >
          <SparkIcon className="shrink-0 text-ink-3" size={12} />
          {suggestion.text}
        </button>
      ))}
    </div>
  );
}

const SUGGESTIONS: Suggestion[] = [
  { id: "1", text: "Show me the diff" },
  { id: "2", text: "Run the tests again" },
  { id: "3", text: "Explain why it was flaky" },
  { id: "4", text: "Open a PR" },
];

export default function SuggestionChipsDemo({ variant }: { variant?: string }) {
  const [picked, setPicked] = useState<string>();
  return (
    <div className="flex w-full flex-col items-center gap-2 pb-8">
      <SuggestionChips layout={variant === "Stack" ? "stack" : "row"} onPick={(text) => setPicked(text)} suggestions={SUGGESTIONS} />
      {picked ? <p className="text-[11px] text-ink-3">Sent “{picked}”</p> : null}
    </div>
  );
}
