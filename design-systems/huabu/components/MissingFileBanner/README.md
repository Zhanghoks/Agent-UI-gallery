What a node shows when the file it points at is no longer there.

Hand-written from `apps/web/src/components/Nodes/MissingFileBanner.tsx`, `missingFile.ts`, `MissingFileBanner.css` and the missing-file block in `NodeWrapper.tsx`.

## What the consumer provides

The missing-file kind, a description, the affected paths, and the locate and retry handlers.

## Rules

`warning`, never `danger`: the file is missing, not destroyed, and the node is still a valid reference. A 1px `warning-light` border on `bg-surface` with `fg-muted` text and the glyph in `warning`.

Two densities, picked by how much room the node has. Full: a 32px glyph at 80% opacity, the title in `sm` medium `fg-default`, the reason in `xs` `fg-subtle` at `line-clamp-3`, the offending paths in a bordered `bg-default` list capped at `max-h-20` and scrolling, then `Locate…` and `Retry` as `outline` buttons. Compact: one `xs` line, truncated, with the full description in a `title`.

The banner covers the node body (`absolute inset-0 z-20`) rather than replacing the node — so geometry, edges and selection are untouched and the node comes back intact when the file is found.

## Don't

Don't delete the node, and don't make the banner dismissible — the state is a fact about the Space, not a notification. Don't use `danger`.
