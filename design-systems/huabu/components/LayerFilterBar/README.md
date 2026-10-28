The filter strip above the layers tree.

Hand-written from `apps/web/src/components/Panels/CanvasLayerPanel/LayerFilterBar.tsx`.

## What the consumer provides

The available node types, the active filters, and the sort and collapse actions.

## Rules

A `shrink-0` strip on `bg-surface` with a bottom border in `edge-default` at **40%** — deliberately lighter than a panel divider, because it separates a control from the list it acts on rather than two regions of the app.

`px-2 py-1.5 gap-1.5`, with filter chips wrapping at `gap-0.5` in a `flex-1` group and the actions pinned right, each icon button forced to `p-1!` to keep the strip under two rows.

Chips carry the node-type icons from `nodeIcons.ts`, so a filter looks like the thing it filters. Active is the same `bg-bg-default` fill the tree's selected row uses, which is what ties the control to the list.

## Don't

Don't use a full-weight divider under this strip, don't let the chips scroll horizontally (they wrap), and don't invent filter-specific icons.
