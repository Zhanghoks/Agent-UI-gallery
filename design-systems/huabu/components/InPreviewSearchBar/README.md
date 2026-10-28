⌘F inside an expanded document.

Hand-written from `apps/web/src/components/Panels/ExpandedNodePanel/InPreviewSearchBar.tsx` and `PreviewSearchAdapterContext.tsx`.

## What the consumer provides

The query, the match count and index, and the next/previous/close handlers — through the preview search adapter, so each document type supplies its own matching.

## Rules

Floats `absolute top-3 right-3 z-50` over the document: `h-9`, 1px `edge-default` on `bg-surface`, `rounded-lg px-1.5 gap-1`, `shadow-lg`. It overlays rather than pushing the document down, so the person's place in the page does not move when they start searching.

The input is a fixed `w-44` transparent field and the count is **11px `tabular-nums`**, so stepping through matches never resizes the bar.

Next and Previous stay disabled until indexing completes. That is a correctness rule, not a nicety: pages are indexed in the background, and navigating mid-index would renumber the active result under the person's hand. The count is only final once indexing finishes.

This search is scoped to the open document. It does not touch canvas-wide search, and canvas-wide search does not drive it.

## Don't

Don't push the document down to make room, don't enable navigation before the index settles, and don't share state with the layers-panel search.
