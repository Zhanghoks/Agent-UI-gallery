An edge between two nodes, and the editable pill that names the relationship.

Hand-written from `apps/web/src/components/Panels/Canvas/edges/LabelledEdge.tsx`, `edgeZ.ts` and `apps/web/src/index.css`.

## What the consumer provides

The source and target handles, the edge's `style.stroke` (a palette token resolved to a colour), and the label text with its change handler.

## Rules

An edge uses its accent at full strength, while a node of the same accent holds its border to `accent-border-mix` (75%). That asymmetry is intentional: the node's border covers far more perimeter, and at equal strength the node would overpower the line.

Edge paths and markers are always rendered — there is no zoom visibility threshold for them. A non-empty label is a canvas portal with a bounded inverse scale so it stays readable as the viewport zooms, and its idle text clamps to three lines. An empty label mounts only while the edge is selected or being edited, and shows `Add label` in `fg-subtle` via a `::before` on the empty editable.

A selected edge swaps its stroke to `info` and adds a `drop-shadow(0 0 2px info-light)`; the label pill's border follows the same rule. React Flow's own selected-stroke fallback has to be neutralised (`--xy-edge-stroke-selected` re-pointed at the edge's own stroke), or an unstyled edge flashes a near-black grey between `mousedown` and the `.selected` class landing.

The label pill's border tracks the edge's colour but not its `strokeWidth` — a chunky 8px edge must not get a chunky pill border. When the edge has no explicit stroke, fall back to React Flow's default token so a freshly created edge and its pill match.

## Don't

Don't let the pill's fill be anything but `bg-surface`: it sits over arbitrary canvas content and needs to be opaque. Don't make an edge a status colour — `info` on an edge means selected, and nothing else.
