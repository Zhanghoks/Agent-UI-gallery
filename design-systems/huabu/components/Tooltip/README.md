The label that names an icon button.

Hand-written from `apps/web/src/components/Common/Tooltip.tsx`.

## What the consumer provides

`content`, a single child to anchor to, an optional `placement` and an optional `wrapperClassName` (default `inline-flex`).

## Rules

`bg-inverse` with `fg-inverse` text at `xs`, `radius-md`, `px-2 py-1`, `shadow-bottom`, `max-width: 90vw`, and `pointer-events: none` so the tooltip can never intercept the click it is describing. It is the only inverse surface in the system besides a `solid neutral` button — 16.5:1 in light, 11.9:1 in dark.

`placement` defaults to `auto`: start above, flip below when there is no room. Pass `bottom` explicitly for controls at the top edge of the window, such as the Electron title bar, where "no room above" is permanent.

Every icon-only button needs one. `Button` does this for you: pass `title` and it wraps itself in a Tooltip and takes its `aria-label` from the same string, so the visible label and the accessible name can't drift.

## Don't

Don't put an action, a link or anything interactive in a tooltip — it has no pointer events by design. Don't use it to carry information the person needs before hovering; that belongs in the label or an empty state.
