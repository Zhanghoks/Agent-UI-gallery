The row of circular swatches a person picks a node, edge or stroke colour from, and the nine-token palette behind it.

Hand-written from `packages/shared/src/types/canvas/color.ts`, `apps/web/src/components/Common/ColorPicker.tsx` and `apps/web/src/components/Nodes/sketch/sketchPath.ts`.

## What the consumer provides

The option list, the currently selected token, and a select handler. Identity is always the `token`; `value` is for display only.

## The palette

`white`, `grey`, `teal`, `blue`, `green`, `amber` (shown as "Yellow"), `orange`, `red`, `purple` — in that order, `white` first as the visually neutral default. Tokens are contracts: canvas files store them, so a token name never changes once shipped. A `value` is safe to swap, and every saved canvas re-skins with it.

Two other entries exist for specific surfaces. The accent picker prepends a `none` sentinel with `value: transparent`, rendered as a checkerboard so "no fill" cannot be mistaken for a white swatch — without it, picking a colour would be a one-way trip. The sketch picker prepends `ink-black`, because ink legitimately needs a true black that the accent palette does not carry.

The palette is theme-independent. A person chose that yellow; it stays that yellow in dark mode.

## Rules

Swatches are 14px discs inside 24px ghost buttons, ringed with `border-swatch` in `edge-default`, and in `info` at 1.1× scale when selected. Hover scales to 1.1× too, and the button's own hover fill is suppressed so only the disc responds. Every swatch carries its display name as both `title` and `aria-label` — colour is never the only label.

Tolerate a literal hex or CSS keyword in stored data as a user-fixed, theme-frozen custom colour, but let only palette tokens in at the write boundaries: agent tool schemas and the pickers.

## Don't

Don't use an accent as a status colour, or a status colour as an accent — `accent-red` is a choice, `danger` is a verdict. Don't extend the palette with a hue that only some node types offer; one palette serves node accents, edge strokes and sketch ink.
