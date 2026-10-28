A custom select: a `Button` trigger with a `Popover` option panel. It replaces every native `<select>` in the app.

Hand-written from `apps/web/src/components/Common/Select.tsx`.

## What the consumer provides

`options` (value, label, optional icon, optional description, optional group), `value`, `onChange`, and optionally `variant`, `size`, `shape` and a `footerSlot`.

## Rules

The trigger inherits `Button`, defaulting to `outline` at `sm`, with `rounded` (`radius-sm`) or `rounded-full` from `shape`, a truncating label, and a chevron that rotates 180° while open.

The panel is a `Popover`: `py-1`, capped at `min(28rem, 100vh - 1.5rem)` tall and `min(24rem, 100vw - 1rem)` wide, scrolling vertically only. Group headers are 10px uppercase with wide tracking, set in `fg-muted` between two `edge-default` hairlines. Options are full-width ghost buttons with the icon first, the label next, a `fg-muted` `xs` description below it if there is one, and the check mark last in a fixed 14px lane — the fixed lane is why labels don't shift when the selection moves. A `footerSlot` sits under a full-width divider and receives a `dismiss` callback.

Because the panel is portalled, mark it as floating chrome; `Popover` already does.

## Don't

Don't use a native `<select>` anywhere in the app — it cannot carry icons, descriptions or group rules, and it renders differently on every platform. Don't use `Select` for two options; that is a `TabGroup` or a `Toggle`.
