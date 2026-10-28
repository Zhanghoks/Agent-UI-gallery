The app's menus: the window menu, the canvas menu, and the context menu on a node.

Hand-written from `apps/web/src/components/Common/DropdownMenu.tsx`.

## What the consumer provides

The trigger, and rows built from `DropdownMenuItem` (a button), `DropdownMenuLink` (a router link) and dividers. Each row takes an `icon`, `children`, an optional `shortcut` and an optional `trailing` slot.

## Rules

The panel is a `Popover` at `py-1` with a `min-w-44` default. Rows are ghost `Button`s forced to `rounded-none` with `px-3 py-1.5 text-xs` — dropping the radius is deliberate, so the hover fill bleeds to both edges of the panel and the menu reads as a list rather than a stack of pills.

Inside a row: the icon in `fg-subtle` at 16px, the label flexing to fill, the shortcut in `fg-subtle` pushed right with `ml-4`. Row text is `fg-muted`; a destructive row takes `danger` for the whole row, icon included.

A navigation row must be `DropdownMenuLink`, which renders a real anchor with `role="menuitem"`. Native anchor semantics are what keep ⌘-click and middle-click working while React Router still handles a plain click.

## Don't

Don't give rows their own radius or horizontal inset, don't nest more than one level, and don't mix a destructive row into the middle of a list — it goes last, under a divider.
