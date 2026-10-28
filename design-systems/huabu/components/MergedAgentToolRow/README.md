Several consecutive tool calls of the same kind, folded into one row.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/MergedAgentToolRow.tsx`.

## What the consumer provides

The run of calls to merge and their individual results.

## Rules

A `w-full px-2 py-1 text-xs gap-1.5` row in `fg-muted` hovering to `bg-hover`, with a `fg-muted/60` chevron — the same shape as `SpaceCommandCard`, because both are one-line reports of work already done.

The status glyph shows the merge's **worst** outcome: `info` when everything succeeded, `danger` if any call failed. The label counts both ("Wrote 2 files · 1 failed"). Folding must never hide a failure — if it did, the person would have to expand every row to know whether the run was clean.

Expanding reveals the individual `ToolCallCard`s inside the same border-indented thread, so the merge is a summary of the rows beneath it rather than a replacement for them.

## Don't

Don't merge calls of different kinds, don't merge across a failure boundary without saying so in the label, and don't show a success glyph for a partially failed run.
