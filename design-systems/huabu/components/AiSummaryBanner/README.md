An agent's summary of a node, attached to the node itself.

Hand-written from `apps/web/src/components/Nodes/AiSummaryBanner.tsx`.

## What the consumer provides

The summary text and its keywords. Collapsed state is the component's.

## Rules

It sits above the node body at `z-10 shrink-0` with its own `0 1px 2px rgba(0,0,0,0.08)` shadow, which is how it lifts off the content without needing a divider. The surface is `ai-bg` and the badge border is `ai-light` — this is provenance, so it takes the AI colour and nothing else.

The trigger is a ghost `Button` with its hover fill explicitly suppressed (`hover:bg-transparent!`): only the label brightens from `fg-muted` to `fg-default`. A full-width hover fill inside a node reads as a menu row, which this is not.

Collapsed is the default. Expanding fades the body in over 150ms: the summary at `sm` `leading-relaxed` in `fg-default`, then keyword chips at `xs` on `bg-hover` in `fg-muted`, `rounded-full`.

Hide the banner entirely when the node is too small for it, the same way the AI badge drops below `badge-min-width` — a banner taller than the content it describes is not a summary.

## Don't

Don't show the summary expanded by default; the node's own content is what the person put there. Don't style the chips as accents — they are keywords, not colours.
