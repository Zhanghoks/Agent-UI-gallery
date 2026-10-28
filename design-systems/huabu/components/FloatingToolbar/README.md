The shared chrome behind every floating toolbar on the canvas, and the popovers that open out of them.

Hand-written from `apps/web/src/components/Common/FloatingToolbar.tsx` and `floatingChrome.ts`.

## What the consumer provides

The rows: `FloatingToolbar.Root`, `.Group`, `.Divider`, `.Label` and whatever buttons belong in them.

## Rules

Two exported class constants keep every canvas toolbar identical. `FLOATING_TOOLBAR_CLASS` is `bg-surface`, `fg-muted`, `rounded-lg`, `p-1.5`, `shadow-bottom`, `gap-1` and deliberately **no border** — floating over a canvas, the shadow is the separation, and a border would read as a second node outline. `FLOATING_TOOLBAR_POPOVER_CLASS` is the same plus a 1px `edge-default` border and `px-2 py-1.5`, because a popover can land over another surface.

Dividers are `mx-0.5 h-4 w-px` in `edge-default`. A group label is `xs` `fg-subtle` at `px-0.5`, never a heading. Controls are ghost `Button`s, usually `sm` and icon-only.

Stop propagation on `click` and `pointerdown` at the toolbar root, and mark every portalled part as floating chrome — a toolbar sits inside the canvas's pointer surface, so an unstopped event pans, deselects or draws.

## Don't

Don't give a toolbar a border, don't stack two toolbars over the same selection, and don't put a label where an icon with a tooltip would do — the bar has to stay narrow enough to float beside the thing it acts on.
