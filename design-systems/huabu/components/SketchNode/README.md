Freehand ink on the canvas, with a hit test that respects where the ink actually is.

Hand-written from `apps/web/src/components/Nodes/sketch/SketchNode.tsx`, `sketchPath.ts`, `sketchMerge.ts`, `SketchOverlay.tsx` and the `.react-flow__node-sketch` rules in `apps/web/src/index.css`.

## What the consumer provides

The stroke points, `strokeColor` (a palette token) and `strokeSize`, plus the node geometry.

## Rules

Outlines come from `perfect-freehand` with the repo's exact settings: size `sketch-stroke-default` 4, thinning 0.4, smoothing 0.5, streamline 0.35, `simulatePressure: false`, linear easing, no taper, caps on. Colour is a palette token resolved at render time — `ink-black` and `accent-white` fall through `resolveAccent` as literal CSS colours.

Hit testing is the distinctive part. By default the sketch wrapper and all its descendants are `pointer-events: none`, so a click in the blank part of the bounding box drills through to nodes underneath, the way a vector editor handles overlapping freehand. `useSketchHoverRouting` runs a JS hit test against the stored points — the same geometry the eraser uses — and tags the matching node `data-sketch-hover`, which re-enables pointer events and adds a `drop-shadow(0 0 2px info-light)` so the person can see which stroke they are about to grab. Resize and connection handles stay clickable throughout.

A *selected* sketch is the exception: its whole box becomes grabbable, so it (or a multi-selection containing it) can be dragged from anywhere. Without that, sketches felt stuck on touch and impossible to move in a group.

On pointer-up a new stroke merges into the nearest sketch within `sketch-merge-distance` (80px on screen, converted to flow space by dividing by zoom). Merging is purely spatial — time plays no part — which matches Whiteboard and Procreate.

## Don't

Don't make the bounding box grabbable at rest, and don't scale the eraser with the stroke size: the eraser's radius is screen-space and user-set precisely so the target stays predictable at any zoom.
