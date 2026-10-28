A single node opened at reading size, beside the canvas or embedded in the workspace.

Hand-written from `apps/web/src/components/Panels/ExpandedNodePanel/ExpandedNodePanel.tsx`.

## What the consumer provides

The node, and whether the panel is docked or embedded.

## Rules

A `bg-surface` column, `overflow-hidden`, with a 1px `edge-default` **left** border when docked and no border when embedded. The divider belongs to the layout that placed the panel, not to the panel itself — so the same component works in the sidebar and inside the preview workspace.

The breadcrumb is a `Select` capped at `min-w-56` with its glyphs forced to 14px, so a deep path stays one row. The metadata strip is `px-3 py-1 text-xs font-medium uppercase` in `fg-subtle`, and any long value switches to `normal-case` — uppercasing a filename makes it unreadable.

The body scrolls; the header and metadata are `shrink-0`. Content comes from the node type's own preview, so this panel supplies the frame and nothing else.

## Don't

Don't duplicate the node's canvas chrome here, don't uppercase a filename or a path, and don't give the panel a shadow — it is docked, not floating.
