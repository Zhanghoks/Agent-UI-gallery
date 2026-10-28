The tiny status dot on an agent node's row in the layers tree.

Hand-written from `apps/web/src/components/Panels/CanvasLayerPanel/QuestionStatusDot.tsx`.

## What the consumer provides

The question's status, whether the result has been viewed, and any error message.

## Rules

A `h-1.5 w-1.5` `rounded-full` dot pinned `-right-0.5 -bottom-0.5` on whatever it marks. Three states: `info` while running, `success` with `animate-pulse` when finished, `danger` on error. `idle` has no dot.

The interesting rule is that `done` **and** viewed returns `null`. The pulse is a summons — an answer is waiting — so it stops the moment the person has looked. A permanent green dot would train them to ignore it.

It is `role="status"` with a tooltip and an `aria-label` that includes the error message (clipped at a maximum length), so the state is never conveyed by colour alone. The colours come straight from `DOT_COLORS` as `var(--info)`, `var(--success)`, `var(--danger)` — inline styles, but tokens, not hex.

## Don't

Don't keep the pulse after the answer is seen, don't grow the dot to fit a label, and don't use `warning` for a running agent — running is not a problem.
