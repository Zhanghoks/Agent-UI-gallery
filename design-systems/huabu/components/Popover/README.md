The floating surface under every menu, select panel, picker and anchored tip.

Hand-written from `apps/web/src/components/Common/Popover.tsx`, `FloatingToolbar.tsx` and `floatingChrome.ts`.

## What the consumer provides

The anchor element, the content, and optionally a placement, a z-index and extra classes.

## Rules

`bg-surface`, 1px `edge-default`, `radius-md`, `elevation-toast`, `position: fixed`. It renders hidden at the origin for one frame to measure itself, then clamps to the viewport — which is why content must not depend on being laid out at its final position.

Two variants exist as exported class constants, so a toolbar's own popovers match the toolbar rather than the menus: `FLOATING_TOOLBAR_CLASS` (`shadow-bottom`, `bg-surface`, `radius-lg`, `p-1.5`, no border) for the bar itself, and `FLOATING_TOOLBAR_POPOVER_CLASS` (the same plus a 1px border and `px-2 py-1.5`) for what opens out of it.

Spread `FLOATING_CHROME_PROPS` onto every portalled root, including popovers a toolbar portals out of itself. Attention tracking then treats an interaction inside that chrome as *neutral* — it leaves the current verdict alone. Neutral rather than "belongs to surface X" because ownership depends on who opened the popover: unmarked chrome vanishes under its own pointer, and chrome marked to the wrong surface drags attention back to a surface the person just left.

## Don't

Don't animate a popover's position, don't let one open on hover, and don't stack a popover over another popover's trigger — close the first.
