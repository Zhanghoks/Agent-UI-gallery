The canvas ground: a dot grid on `bg-default`, with every node, edge and overlay drawn on top of it.

Hand-written from `apps/web/src/components/Panels/Canvas/Canvas.tsx`, `SelectionOutlines.tsx`, `SnapGuidesOverlay.tsx` and `apps/web/src/index.css`.

## What the consumer provides

The node and edge collections, the viewport transform, and the current tool. React Flow owns the transform; this system owns what the surface looks like at a given transform.

## Rules

Draw the grid with `canvas-grid` at a `grid` (18px) pitch and nothing else — no lines, no second pitch, no vignette. The same 18px is React Flow's `snapGrid` and the layout engine's `snapToGrid`, so a node an agent places and a node a person drags land on the same dots.

Clamp zoom to `zoom-min` 0.05 and `zoom-max` 5 on every path that can change it, including custom pinch handlers. A gesture that can escape the clamp will eventually produce a canvas nobody can find their way back from.

Keep the two coordinate spaces separate and deliberate. Node bodies, frames and edge paths are canvas-space and scale with the viewport. Selection outlines, snap guides, frame labels, resize handles and toolbars are screen-space: they are positioned from transformed coordinates but keep their physical size, so they stay hittable at 0.05 and don't turn into slabs at 5.

Render selection on a layer above every node, never as a ring on the node's own DOM — clicking a node must not change its z-order. One `border-hairline` `info` outline plus a `0 0 6px 0 info-light` glow; a sketch node's outline drops to half opacity because its bounding box is mostly empty space. Hover, which an overlay cannot observe, stays on the node as a ring in `edge-default`.

Snap guides are 1px `info` lines, drawn when a dragged node comes within `snap-threshold` (6px on screen, so divide by zoom before comparing) and capped at `snap-max-guides` per frame.

Set `touch-action: none` on the React Flow root and `overscroll-behavior-x: none` on the page, or a two-finger pan becomes browser history navigation.

## Don't

Don't tint the canvas ground to signal state — a mode is communicated by the cursor (`text` for pending note/text/question, `crosshair` for frame, lasso and audio) and by the toolbar, not by recolouring the surface. Don't put content directly on `bg-default`; anything readable sits on a `bg-surface` card.
