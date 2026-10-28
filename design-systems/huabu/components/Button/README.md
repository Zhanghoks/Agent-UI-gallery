The one button in the system: three variants, five tones, three sizes, optional pill shape, icon-only mode and a keyboard-shortcut badge.

Hand-written from `apps/web/src/components/Common/Button.tsx`.

## What the consumer provides

`children` (a label, an icon, or both), and any native button attributes. A `title` wraps the button in a `Tooltip` automatically and — in `iconOnly` mode — becomes the `aria-label`, so an icon button with a `title` is already accessible.

## Props

`variant`: `solid` | `outline` | `ghost`, default `solid`.
`tone`: `neutral` | `info` | `success` | `warning` | `danger`, default `neutral`. This is the shared tone vocabulary, so a container's tone maps 1:1 onto a button inside it — see Toast.
`size`: `sm` | `md` | `lg`, default `md`. Labels are 12/14/16px and icons 13/16/20px.
`shape`: `default` (`radius-md`) | `pill` (`radius-full`).
`iconOnly`: collapses padding to a square and takes the `aria-label` from `title`.
`shortcutBadge` / `shortcutBadgeActive`: a single character rendered as a 9px subscript in the bottom-right corner, in `fg-subtle` or `info` when the tool is active. It is cosmetic — the caller wires the actual key.
`tooltipPlacement`: pass `bottom` for buttons at the top edge of the window, where there is no room above.

## Rules

`solid` is `bg-inverse` (or the tone colour) with `fg-inverse` on top and an 80%-opacity hover. `outline` is `bg-surface` with a 1px border in the tone and `-bg` on hover. `ghost` is transparent with `-bg` on hover, and it is the right default for canvas chrome — most buttons in Huabu are ghost.

Use exactly one `solid` button per decision. Everything else in that group is `outline` or `ghost`.

Transition `colors` only, never `all`. Disabled is `disabled` opacity plus `not-allowed`, applied through `disabled:` and `enabled:hover:` so a disabled button never shows a hover state.

When a `shortcutBadge` is present on an icon-only button, shift the padding up-left by the amounts in `iconOnlyBadgeShiftClasses` so the badge gets a clear corner. Total button size is preserved — padding is traded, not added.

## Contrast

In the light theme, `fg-inverse` on a solid status fill is 3.1:1 to 4.3:1 — enough for large or bold labels and for the button's own border, short of 4.5:1 for small text. `solid` + `md` is 14px at weight 500, which sits below the large-text exemption, so prefer `sm`-and-up labels on solid status buttons in light, or use `outline` where the label is `bg-surface`-backed. `solid neutral` (`fg-inverse` on `bg-inverse`) is 16.5:1 in light and 11.9:1 in dark and is always safe. Dark-theme status fills are all 6:1 or better.

## Don't

Don't introduce a fourth variant or a sixth tone; the tone vocabulary is shared across surface components and adding to it breaks the 1:1 mapping. Don't use `solid info` as a generic primary — `info` means the system is pointing at something.
