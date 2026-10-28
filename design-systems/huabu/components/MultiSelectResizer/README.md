The resize frame around a multi-node selection.

Hand-written from `apps/web/src/components/Panels/Canvas/MultiSelectResizer.tsx`.

## What the consumer provides

The selection's bounding box in flow space, the zoom, and the resize handler.

## Rules

The frame is a `z-999` `pointer-events-none` overlay drawn with `outline: 1px solid var(--color-info-light)` — an outline rather than a border, because a border would occupy layout and shift the box's dimensions, which in turn would misalign every handle offset from the real bounding box.

Handles are the only `pointer-events-auto` part: squares filled `info-light` with a 1px white edge, positioned at `-handleSize / 2` from each corner so they straddle the outline, each carrying the correct `nwse`/`nesw` cursor and `touch-action: none`.

`info-light` rather than `info` is deliberate: a single node's selection outline is the saturated colour, and the group frame sits one step back so the two are distinguishable when both are on screen.

Handle size follows the pointer, like every other canvas handle — larger for touch and pen.

## Don't

Don't use a border or a box-shadow for the frame, and don't add edge handles — a group resizes from its corners, and edge handles on a bounding box invite non-uniform scaling of content the person did not select for that.
