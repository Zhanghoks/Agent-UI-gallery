A popover anchored to something on the canvas rather than to a DOM element.

Hand-written from `apps/web/src/components/Common/CanvasFloatingPopover.tsx` and `floatingChrome.ts`.

## What the consumer provides

A flow-space anchor (a node, a point, a bounding box) and the content.

## Rules

The anchor is in flow space and is run through the viewport transform each frame, so the popover stays attached to its node while the canvas pans and zooms. The popover itself renders in screen space, so it keeps its own size and legibility at any zoom — the same split every other piece of canvas chrome uses.

Chrome is `FLOATING_TOOLBAR_POPOVER_CLASS`: `bg-surface`, 1px `edge-default`, `radius-lg`, `shadow-bottom`. It carries `FLOATING_CHROME_PROPS` and stops pointer events from reaching the canvas, or opening it would immediately deselect the thing it describes.

It closes on canvas interaction, never on hover — a popover that vanishes when the pointer leaves cannot be read on a surface where the pointer is also the pan gesture.

## Don't

Don't position it in flow space (it would shrink away at low zoom), don't let it open on hover, and don't stack one over the node it is anchored to — offset it.
