Crafted, copy-paste interface primitives for AI-native products: thinking and reasoning states, streaming answers, human-in-the-loop approvals, tool-call and task status, records and diff tables, prompt bars. Every primitive is one self-contained component on a small token layer, themed light and dark from the same source.

The look in one line: a cool near-white canvas, white cards, hairline borders, layered single-digit-opacity shadows, a neutral ink ramp, and semantic colour used sparingly, as a condiment.

## Content fundamentals

- Write like a calm, competent agent. Short, plain, sentence-case labels: "Needs review", "Apply 3 changes", "Alternatives", "Skip". No exclamation marks, no emoji.
- Buttons are verbs or short noun phrases: "Accept", "Send", "Configure", "Continue". One word where one word will do.
- Status words carry the meaning, colour only confirms it: "Completed", "Needs review", "Failed", "Active".
- Numbers are exact and tabular: "780,704 USD", "0.0125 of 1 GB", "+8%", "3/10". Use `tabular-nums` wherever figures line up or tick.
- Code values sit in a mono `Chip`: `updated_at`. People and records sit in an `EntityChip`; plain values in a `ValuePill`.
- Demo copy is an ice-cream creamery (flavours, suppliers, waffle cones). Replace it with your product's own data; keep the tone.

## Visual foundations

### Colour

- Surfaces step from `page` (the ground) to `canvas` (recessed wells) to `surface` (cards, menus, inputs), with `inset`, `hover` and `hover-2` for quiet fills inside a card. Neutrals are cool and faintly blue.
- Text is a three-step ramp: `ink` for primary text, `ink-2` for secondary ("secondary gets colour, not weight"), `ink-3` for placeholders and timestamps. `ink-3` misses 4.5:1 on `surface` in both themes in the source, so never put essential copy in it.
- Borders are solid, never alpha: `line` by default, `line-strong` for controls and button rings, `line-soft` for dense row dividers.
- One blue accent. `accent` for fills, focus and active states; `accent-ink` for accent-coloured text and links; `accent-tint` for washes and selection.
- Semantic colour is used sparingly: `green` success, `orange` warning / needs review, `red` failure, each with a `-tint` fill. In light, `orange` on `orange-tint` is 2.7:1, so status pills always carry a word.
- Chart tooltips use the `tooltip-*` set, dark in both themes.
- Dark theme swaps every token at once; in dark the tints become 14% alpha washes of their hue.

### Type

- Inter, tuned: tight tracking (-0.01em body, -0.02em display) with the `cv11` and `ss01` features and tabular numerals. JetBrains Mono for code and tokens.
- `body` 14px / 1.5 is the default; `ui` 13px is the workhorse for menus, card titles (at 600) and secondary text; `ui-small` 12.5px for dense rows; `caption` 12px; `micro` 11.5px for counters and pill labels; `display` 24px semibold for headings.
- Weight does little work: 400 and 500 almost everywhere, 600 for titles only.

### Spacing and layout

- A 4px grid: `space-1` 4, `space-2` 8, `space-3` 12, `space-4` 16, `space-6` 24, `space-8` 32.
- Small cards share fixed optical offsets rather than hand-tuned ones: card padding `space-3` (12px); header bars, footers and table cells `card-bar-y` (10px) by `space-3`; icon buttons `icon-button` (28px square).
- Primitives sit centred in a stage no wider than 480px; tables and screens go wider.

### Radii, borders and shadows

- Tight radii: `radius-chip` 6, `radius-control` 8, `radius-card` 10, `radius-window` 14, and `radius-pill` for buttons, status pills and switches.
- Elevation is a hairline ring plus a smooth, layered shadow, never a harsh drop: `shadow-hairline` (flat tiles), `shadow-btn` (secondary buttons), `shadow-card` (cards, the default), `shadow-raised` (floating cards), `shadow-overlay` (menus, popovers), `shadow-inset-field` (pressed-in fields). In dark, the ring becomes a faint white edge graduated by how far the surface floats.

### Motion and states

- Strong curves, because the built-ins are too weak: ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for most movement, ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`, and `cubic-bezier(0.16, 1, 0.3, 1)` for link underlines.
- Buttons scale to 0.96 on press. Hover highlights glide between rows (`GlideMenu`) instead of blinking on each.
- Streaming text resolves out of a soft blur with a caret; working labels shimmer from `ink-3` to `ink`.
- Every animation has a `prefers-reduced-motion` fallback; theme switches freeze transitions so the flip is one repaint.
- Focus: a solid 2px `accent` outline with a 2px offset (inputs rely on their own field styling instead).

## Iconography

- Most primitives draw their own small inline SVG icons: 24px grid, `currentColor` strokes, round caps and joins, 1.5 to 2px stroke.
- `SelectionActions` uses Iconoir (regular, 1.5 stroke). `SidebarNav` uses Central Icons (round, outlined, radius 2, stroke 2), a paid set; this system's bundle substitutes Iconoir glyphs for it.
- Icons sit in `ink-2` or `ink-3` beside text and take `ink` on hover or when active. No emoji.

## Logo

- The mark is a hand-drawn blue "B" with a "UI" tab (`assets/Logos/beautiful-ui-logo.png`). Show it on `surface` or `page` in light; it is a single blue ink on transparent, so check it on dark grounds before use.

## Using this system

- Load `tokens.css`, then `components/bundle.css` (Tailwind v4 utilities, base rules, keyframes and the component-specific blocks), then React 19 (`components/lib/`) and `components/bundle.js`, which exposes every component on `window.BeautifulUI`.
- Themes follow `data-theme="light"` or `"dark"` on the root (the source's `.dark` class also works).
- In your own Tailwind v4 app, prefer the source: drop `app/globals.css` in once, then paste components or install them with `npx shadcn add https://www.beautifului.dev/r/<component>.json`.

## Not synced

- Skipped: `--grid-line` (a `color-mix()` of `line`; it lives in bundle.css) and the easing curves (no motion family; listed above).
- Fonts: Inter and JetBrains Mono are Google-hosted in the source (`next/font/google`), so there are no font files; bundle.css loads them from Google Fonts.
- Components built from source at main@44a274e with React 19.2 and Tailwind 4.1.8. Two dependencies could not be fetched: `glimm` (PromptBar's rainbow sweep is disabled) and Central Icons (SidebarNav shows Iconoir stand-ins). `tailwind-merge` is 3.5 rather than the source's 3.6.
- Site chrome (gallery grid, harness, nav, theme toggle, email capture, sounds) is not part of the library and was left out.
