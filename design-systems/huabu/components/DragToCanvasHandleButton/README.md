The grip that lets a chat result, a search hit or a preview be dragged onto the canvas.

Hand-written from `apps/web/src/components/Common/DragToCanvasHandleButton.tsx`.

## What the consumer provides

The drag payload and the drag handlers. The button itself is presentation.

## Rules

A ghost icon `Button` that deliberately opts out of `Button`'s icon-size clamp with `[&_svg]:h-auto [&_svg]:w-auto`, so the grip glyph carries its own dimensions rather than being forced to the size step. `cursor: grab`, `fg-subtle` at rest, `fg-muted` on a `bg-hover` fill while hovered or dragging.

It is a drag handle, not a click target. Put it at the trailing edge of the row it belongs to, and let the row's own click do whatever the row does — opening the result, focusing the node. The handle's whole message is "this can go on the canvas".

## Don't

Don't make the entire card draggable when it is also clickable — the two gestures collide and the person loses the ability to select text in the row. Don't label it; the grip is the label.
