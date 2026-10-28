The overlay that says where a dragged node will land inside a structured frame.

Hand-written from `apps/web/src/components/Panels/Canvas/StructuredDropOverlay.tsx` and `canvas-engine/autoLayout/*`.

## What the consumer provides

The hovered frame, the dragged node, and the solver's projected layout.

## Rules

The overlay is deliberately thin, because the real preview is the reflow: while a node hovers a `column`, `row` or `grid` frame, the solver's projected positions are written onto the actual peers so they slide aside over 140ms `cubic-bezier(0.2, 0, 0, 1)`. The person sees the outcome, not a diagram of it. The dragged node is excluded from that transition so it stays glued to the cursor.

Three opacities carry three meanings, and they should not be mixed up. A proposed drop zone is `z-40`, `pointer-events-none`, 2px dashed `info` at 50% over an `info` 10% wash with an `info` glyph centred. A chosen target's outline is 2px solid `info` at 60%. Contextual guides sit behind at `z-30` in `info` at 30%.

Cross-frame previews project the whole transaction: if removing the node reflows its source parent, the target branch is first moved to its projected source-layout position, and the drop zone is computed at that future absolute position — otherwise the preview shows the target's old slot and the node jumps on commit.

## Don't

Don't preview a structured drop with a stack of translucent rectangles, and don't animate the dragged node into the slot before release — the commit is when it lands.
