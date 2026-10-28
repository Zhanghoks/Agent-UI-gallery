The floating tool palette at the bottom of the canvas: navigation tools, creation tools, and the resource and agent menus.

Hand-written from `apps/web/src/components/Panels/Canvas/CanvasToolbar.tsx` and `docs/architecture/canvas-input-interactions.md`.

## What the consumer provides

The active tool, the tool handlers, and the current pointer type. The toolbar reads the pointer, not the persisted input preference.

## Rules

One `bg-surface` row, `radius-lg`, `shadow-bottom` and **no border** — the shadow is the whole separation from the canvas. `px-4 py-2`, items `gap-1.5`, and groups split by a 1px `edge-default` divider `h-4` with `mx-1`. Every tool is a ghost icon button; the active tool takes the `bg-hover` fill and `fg-default`.

Shortcut hints ride on the buttons as 9px badges — `fg-subtle` normally, `info` when that tool is active. They are cosmetic; the keyboard listener lives elsewhere.

Layout follows the current pointer. With a mouse, Select, Pan and Lasso are all visible with their shortcut badges. With touch or pen, Pan collapses into internal direct manipulation and disappears from the bar, Select and Lasso stay, Sketch is listed among the creation tools, and hit targets grow — resize handles go from 8px to 12px. A hybrid device gets whichever layout matches the pointer that was last used, mid-session.

Portal the toolbar's own popovers — colour pickers, resource menus — and mark every portalled root with `data-floating-chrome`, or attention tracking will read a click in a popover as the person leaving the surface the popover belongs to.

Select is the safe home base. After any one-shot placement tool finishes, fall back to Select rather than re-arming — a resting finger or pen must never be able to draw. Lasso and Sketch are the two explicit sticky modes and stay active until the person switches away. A mode is signalled by the cursor (`text` for pending note, text and question; `crosshair` for frame, lasso and audio) and by the active button, never by tinting the canvas.

## Don't

Don't give the toolbar a border, don't make a tool `solid`, and don't hide a tool behind a menu on the touch layout that is a top-level button on the mouse layout — the two layouts differ in density, not in capability.
