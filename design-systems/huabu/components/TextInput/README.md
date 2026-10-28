The standard design-system text field, and the only styled text input in the app.

Hand-written from `apps/web/src/components/Common/TextInput.tsx` and `Input.tsx`.

## What the consumer provides

Anything a native text input takes. `size` is `sm` (default) or `md`; `mono` switches to the monospace family for commands, paths and configuration values; `type` is restricted to text-like natives.

## Rules

`bg-surface`, a 1px `edge-default` border, `radius-md`, `fg-default` text and an `fg-subtle` placeholder. Focus replaces the outline with a 1px `info-light` ring — quiet, because a canvas app has many fields and a loud focus state turns the panel into a light show. Disabled is `disabled` opacity plus `not-allowed`.

`Input` is the unstyled primitive underneath. Reach for it only when a caller owns every visual detail; otherwise use `TextInput`, so every field in the app has the same density. Checkbox, radio, range and file inputs are not this component — use `Toggle`, `RangeSlider`, or the native element.

## Don't

Don't restyle the focus ring per surface, and don't put a text field on `bg-default` — a field is a raised control and needs the `bg-surface` it sits on to differ from the ground.
