The layers panel's one-line summary of everything in the Space whose file is missing.

Hand-written from `apps/web/src/components/Panels/CanvasLayerPanel/MissingNodesSummary.tsx`.

## What the consumer provides

The missing-node count and the reveal and dismiss handlers.

## Rules

A full-width ghost `Button` forced to `justify-start px-1.5!` with a truncating label, and a dismiss button forced to `p-1!`. Both overrides exist for the same reason: this row lives inside a resizable panel and must never be the thing that sets its minimum width.

`warning`, matching `MissingFileBanner` on the node itself — the panel row and the thing it points at should agree, so a person who sees one recognises the other.

It summarises and navigates; it does not fix. The detail and the repair actions live on the node, where the person can see which file is meant.

## Don't

Don't list the missing nodes here, don't use `danger`, and don't make the row permanent once dismissed — the node banners remain the durable record.
