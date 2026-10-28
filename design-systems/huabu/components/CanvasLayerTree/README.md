The layers tree: every node in the Space, nested by frame, reorderable by drag.

Hand-written from `apps/web/src/components/Panels/CanvasLayerPanel/CanvasLayerTree.tsx` and `TreeRowItem.tsx`.

## What the consumer provides

The node tree, the selection, and the reorder handlers.

## Rules

Rows are `h-9` on `bg-surface` with an inner `rounded px-1 py-1 text-sm` body that carries the fill, indenting **25px per depth**. Selection and hover both use `bg-bg-default` — in a dense list the ground colour is enough, and a stronger fill would make the tree noisier than the canvas it describes.

Drop intent has two distinct languages, and they should not be merged. `before` / `after` draws one `info` `h-0.5 rounded-full` caret at the **destination indent**, offset by `8 + depth * 25`, so a drop that nests deeper visibly sits further inside its parent. `into` is deliberately *not* a caret: the destination frame's own row takes a `bg-info-bg` fill plus a dashed `outline-info`, so the row itself reads as the target. A caret cannot express "inside this", and a fill cannot express "between these".

`hover:bg-info-bg` explicitly overrides the row's default `hover:bg-bg-default` while a drag is over it, since a hover variant beats the base.

Per-row actions are `opacity-0` until `group-hover`, with their hover fill suppressed, so a tree of sixty rows is not a wall of buttons.

## Don't

Don't use a caret for an "into" drop, don't animate the indent, and don't show every row's actions at rest.
