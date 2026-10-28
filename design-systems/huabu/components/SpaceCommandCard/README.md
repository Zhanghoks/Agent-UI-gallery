A canvas command an agent performed, reported as a single line.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/SpaceCommandCard.tsx` and `docs/architecture/canvas-command-architecture.md`.

## What the consumer provides

The command's outcome description and its status.

## Rules

A `w-full px-2 py-1 text-xs gap-1.5` row in `fg-muted` hovering to `bg-hover`, with a `fg-muted/60` chevron and a truncating description.

Canvas commands are the most frequent thing an agent does in this app, so they are deliberately the flattest thing in the transcript: one line each, no card, no surface. Twenty of them should still let the person find the sentence that explains why.

Write the description as the *outcome* in the canvas's own vocabulary — "Created frame "Themes" and moved 6 nodes into it" — not as the call that produced it. The person thinks in frames, nodes, accents and connections; the command name is an implementation detail.

## Don't

Don't give a command its own card, don't show the raw command payload in the collapsed row, and don't use a status colour for a successful command — `info` is enough, and `fg-muted` is often better.
