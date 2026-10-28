A container node that groups other nodes, either freely positioned or laid out as a column, row or grid.

Hand-written from `packages/shared/src/canvas-engine/utils/constants.ts`, `canvas-engine/frame/*`, `apps/web/src/index.css` and `docs/architecture/canvas-input-interactions.md`.

## What the consumer provides

The child nodes, the layout mode (`free`, `column`, `row`, `grid`), and the frame's own geometry. The layout engine owns positions; this component owns how the container reads.

## Derived spacing, not fixed spacing

A frame's internal padding is 10% of a representative child extent — the median of all direct children's pooled widths and heights — floored at `frame-padding-min` (16px). The inter-item gap is 8% of the same extent, so padding lands at roughly twice the gap and the outer breathing room reads as a clear step up from the spacing between items.

There is deliberately no upper clamp on padding. It scales linearly with content so that during a uniform child-scaling resize the proportion between padding, gap and content stays exact; clamp it and the frame body settles smaller than the user's drag rect, which shows up as the bottom and right edges gaining inset relative to top and left mid-gesture.

An empty frame and a frame with one tiny child both resolve to the floor, so the first child arriving causes no visible jump.

## Labels and chrome

The frame label is a screen-space overlay, not canvas-space text: it keeps its physical size at every zoom and is collision-aware when frames nest, with interaction able to force it visible. The frame body itself is always rendered full — frames never drop to a placeholder.

Animate width and height with `ease-out` 200ms, but suspend it while a resize handle is being dragged (`body.canvas-resize-active`) or while React Flow marks the node `.dragging` — otherwise the body trails the handle by a beat. Structured reflow, where peers slide aside to show where a dragged node will land, uses `transform` at 140ms `cubic-bezier(0.2, 0, 0, 1)`, with the dragged node itself excluded so it stays glued to the cursor. Both have a `prefers-reduced-motion` escape.

## Ownership is pointer-first

The deepest permitted frame surface containing the pointer wins, and the dragged body only needs positive contact with it — overlap percentage never overrides a pointer aimed elsewhere. `frame-capture-margin` (24px, scaled up for large nodes) is the halo in which the pointer still counts as inside. Child frames are frozen during an unmodified drag; Cmd (macOS) or Ctrl enables nested entry, and Space preserves the current parent. In a structured frame the pending position is shown by reflowing the real peers, not by stacking translucent overlay rects — a person should see the outcome, not a diagram of it.

## Don't

Don't hard-code frame padding, and don't give a frame its own surface colour beyond a soft accent tint — it is a boundary, not a panel. Don't let the frame's pane swallow a lasso gesture: a frame's own background is a valid lasso start target and shows the `crosshair` cursor in lasso mode.
