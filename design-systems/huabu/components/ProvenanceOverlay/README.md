The record of what an agent changed inside a node, and the place you accept or reject it.

Hand-written from `apps/web/src/components/Nodes/note/ProvenanceOverlay.tsx`.

## What the consumer provides

The change rows — each with the removed and added text — the agent's explanation, and the accept and reject handlers.

## Rules

Two layers. On the node, a `z-10` `ai`-coloured pin marks where the change is, ringed in the canvas ground so it stays visible over any accent. Opening it gives a `z-20` panel: `bg-surface`, 1px `edge-default`, `radius-md`, `shadow-lg`, `p-3`, `max-h-100` and scrolling.

The explanation comes first, in `xs` `leading-relaxed` `fg-muted` — the agent says why before showing what. Then the diff rows, separated by a top border with `mt-1 pt-1` from the second row on. Removals take `diff-removed-bg` / `diff-removed-text` with a line-through; additions take the added pair. In light mode those alias `success` and `danger`; in dark they are their own values, so never hard-code them.

Actions are right-aligned at `gap-1`, with accept as the affirmative. Nothing is applied until the person acts — reviewing every proposed change is the product's promise, so this overlay is the one place agent work is provisional.

## Don't

Don't show a diff without the explanation, and don't let the overlay obscure the text it is describing — it anchors beside the change, not over it.
