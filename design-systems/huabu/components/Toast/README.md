A transient message over the canvas, with an optional action or two.

Hand-written from `apps/web/src/components/Common/Toast.tsx`.

## What the consumer provides

`message`, an optional `tone` (default `info`), an optional `action` and `secondaryAction`, `duration`, and `dismissible`.

## Rules

The surface pairs a low-saturation `-bg` fill with a `border-hairline` border in the full tone colour, so the whole toast reads as one colour family from across the canvas. `radius-xl`, `elevation-toast`, `w-fit` up to a max of 28rem.

The severity signal is the badge: a solid tone-coloured disc with an `fg-inverse` glyph — `Info`, `Check`, `AlertTriangle`, `X` from Lucide at `strokeWidth: 3`. The badge is what carries meaning, which frees the message text to stay quiet. Message text takes the tone colour too, with `neutral` falling back to `fg-default`.

Inline action and close buttons are ghost buttons in the same tone, hovering to `-bg-hover` — one shade darker than the toast surface, so no opacity arithmetic is needed. With both an action and a secondary action the layout stacks: message row first, buttons right-aligned beneath it.

Default duration is 3000ms, except `danger`, which is persistent (`duration: 0`) because an error the person did not see is an error they will hit again. A persistent toast, or one with an action, shows a close button by default. Enter by fading in and sliding down 8px over 200ms.

`role="status"`, so a screen reader announces it without stealing focus.

## Contrast

In the light theme the tone text sits at 2.9:1 to 4.1:1 on its own `-bg` — below the 4.5:1 body-text floor. This is the source's own palette and stays exact. Keep messages short, lean on the badge for severity, and use `neutral` (`fg-default` on `bg-surface`, 17.6:1) when a longer sentence has to be read carefully. The dark theme's tone text is 5.2:1 or better on the same surfaces.

## Don't

Don't use a toast for anything the person must act on eventually — it disappears. Don't stack more than a few; a queue of toasts over a canvas is a canvas nobody can use.
