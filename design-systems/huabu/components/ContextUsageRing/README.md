A 24px ring showing how much of the model's context window this session has used.

Hand-written from `apps/web/src/components/Panels/ChatPanel/ContextUsageRing.tsx`.

## What the consumer provides

`usedTokens` and `contextWindow`.

## Rules

An `edge-default` track with an `fg-muted` arc, round-capped, starting at 12 o'clock and sweeping clockwise. No arc is drawn at zero.

The arc keeps one colour at every level. A context window filling up is a fact to plan around — start a new session, drop some references — not a failure, and colouring it `warning` then `danger` would make every long conversation look broken.

The numbers belong in the tooltip: tokens used, window size, percentage, formatted by `formatTokens`. The ring is `cursor-default` with `focus:outline-none` because there is nothing to click; it is a readout.

## Don't

Don't animate the arc as it grows, don't add a numeric label beside it in the header, and don't threshold it into colours.
