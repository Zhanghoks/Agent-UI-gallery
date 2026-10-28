Every waiting state in the app, in one component.

Hand-written from `apps/web/src/components/Common/Loading.tsx` and the `skeleton-*` rules in `apps/web/src/index.css`.

## What the consumer provides

`variant` (`spinner`, `brand`, `skeleton`), `layout` (`block` or `inline`), `size` (`xs` 12px, `sm` 16px, `md` 18px), an optional `message`, and `lines` for the skeleton.

## Rules

Pick the variant by what is being waited for. `skeleton` when the shape of the result is known — a node body, a preview, a list — because it holds the layout still. `spinner` when it is not, or inside a control. `brand` only where the wait is the whole screen.

The spinner rotates a plain wrapping element rather than the SVG, so Chromium can promote the transform to the compositor and it keeps turning through canvas jank. Skeleton bars run at 100%, 75% and 50% width with a 1.8s shimmer staggered by 0.15s, built from `skeleton-1/2/3`; the thinking shimmer for text uses `shimmer-1/2/3` instead — see ThinkingIndicator.

Everything carries `role="status"` with a translated label. Size is one of the three steps; don't pass a pixel value.

## Don't

Don't put a spinner on a node card that already dims — the node's own state is the signal. Don't run a skeleton for more than a few seconds without a message; past that, say what is slow.
