The app's top bar.

Hand-written from `apps/web/src/components/Panels/Header/Header.tsx`, `CanvasHeader.tsx`, `AppMenu.tsx` and `CanvasMenu.tsx`.

## What the consumer provides

The menus, the Space title, and the session controls.

## Rules

One row: `h-12`, `bg-surface`, `gap-3 px-3`, a 1px `edge-default` bottom border and **no shadow**. The header is attached to the app rather than floating over it — shadows in this system are reserved for chrome that hovers over the canvas.

A `flex-1` spacer splits it: navigation and menus on the left, session controls and identity on the right. Every control is a ghost icon `Button`, and the Space name is an `InlineEditableTitle` so renaming happens in place rather than in a dialog.

Menus are `DropdownMenu`s; the header contributes no menu styling of its own.

## Don't

Don't give the header a shadow or a second row, and don't put a `solid` button in it — the header holds navigation, not the screen's primary action.
