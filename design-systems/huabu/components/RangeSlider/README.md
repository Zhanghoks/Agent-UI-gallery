A compact numeric slider with an optional readout, for stroke size, eraser radius and settings values.

Hand-written from `apps/web/src/components/Common/RangeSlider.tsx`.

## What the consumer provides

`value`, `min`, `max`, `step`, a `label` (the `aria-label` and the title), `size` (`sm` for floating toolbars, `md` for tool panels), `showValue`, `onChange`, and optionally `onDragStart` / `onDragEnd`.

## Rules

A native `<input type="range">` with the appearance stripped: `edge-default` track at h-1.5 `rounded-full`, borderless `info` thumb at 12px (`sm`) or 16px (`md`), and an `fg-subtle` readout in `tabular-nums` with a minimum width. The tabular numerals and the min-width are load-bearing — without them the toolbar reflows on every tick of a drag.

The size classes must stay literal strings so Tailwind's JIT can see them; never build them by concatenation.

`onDragStart` and `onDragEnd` fire exactly once per interaction even though the browser emits several terminal events (`pointerup`, `lostpointercapture`, `blur`), so a consumer can open one undo gesture that every per-tick `onChange` folds into. The bracket also closes on unmount, in case the slider's toolbar disappears mid-drag.

Stop propagation on `click` and `pointerdown`: the slider usually sits on a canvas overlay where those events would otherwise pan or deselect.

## Don't

Don't let the slider's width depend on its value or label, and don't use it for a value the person cannot see the effect of while dragging — that is a number field.
