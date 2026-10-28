The handle beside a node for dragging a new node out of it.

Hand-written from `apps/web/src/components/Nodes/FloatingDragHandle.tsx`.

## What the consumer provides

The source node and the node types it can spawn.

## Rules

Rows are `px-2.5 py-1.5` `xs` in `fg-default` that fill `info-bg` on hover, with `cursor: grab` becoming `grabbing` on press. The cursor is the whole instruction — there is no "drag me" label, because the grab cursor says it at the moment the person is looking.

The container is a `grid auto-rows-auto` rather than a flex column, so one row can hold a single label and another two glyphs without either changing the other's height. A hint row is `xs` `fg-subtle` and is not a button.

One row opts out of `Button`'s icon-size clamp with `[&_svg]:h-auto [&_svg]:w-auto`, the same escape hatch `DragToCanvasHandleButton` uses, so its glyphs render at their natural size.

`info-bg` on hover rather than `bg-hover`: this handle creates a connected node, and the connection is `info`.

## Don't

Don't make the rows clickable as a shortcut for "create beside" — a click and a drag would produce different geometry from the same control. Don't show more than a few types; the toolbar has the full set.
