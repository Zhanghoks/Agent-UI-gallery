What appears when a connection is dragged out to empty canvas: pick the node type, and get the node and the edge together.

Hand-written from `apps/web/src/components/Panels/Canvas/ConnectedNodePicker.tsx`.

## What the consumer provides

The source node and handle, the drop point, and the creation handler.

## Rules

The connector stays drawn while the picker is open, on a `pointer-events-none` SVG layer pinned at the origin — `left: 0, top: 0, width: 1, height: 1`, `overflow-visible`, `zIndex: 50` — so a 1×1 element can paint anywhere on the canvas without affecting layout or hit testing. The path, its fill and its arrowhead marker all take the same `stroke` value at `strokeWidth: 1`, which is what stops the line and its head from ever disagreeing about colour.

The picker itself is toolbar chrome: `bg-surface`, `shadow-bottom`, `fg-muted`, `rounded-lg`, `p-1.5`, `gap-1`, ghost icon buttons grouped by kind.

Choosing a type performs one action — create the node *and* the edge — so it lands as a single undo step. The new node inherits the source's accent, which is why the line is drawn in it.

## Don't

Don't close the picker on pointer-up alone; the person let go to choose. Don't create the node first and the edge after — a half-applied connection is worse than none.
