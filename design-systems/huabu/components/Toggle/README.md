A binary switch for a setting that takes effect immediately.

Hand-written from `apps/web/src/components/Common/Toggle.tsx`.

## What the consumer provides

`checked`, `onChange`, an optional `label` (used as the `aria-label`) and `disabled`.

## Rules

A 20×36 pill with a 2px transparent border, `edge-default` when off and `info` when on, carrying a 16px `bg-surface` knob with `elevation-hover` that translates 16px. Both the track colour and the knob position animate over 200ms `ease-in-out`.

It is a `<button role="switch">` with `aria-checked`, not a checkbox, and it always carries an accessible name — `label` if given, otherwise the literal "Toggle", which is a fallback, not a design. Focus shows a 2px `info` ring with a 1px offset; this is the one control with a loud focus ring, because it has no text of its own to anchor on.

Use it only where the change applies at once. A setting that needs saving belongs in a form with a button.

## Don't

Don't put a label inside the track, don't add an intermediate state, and don't use `info` for an off state — the colour is what says "on".
