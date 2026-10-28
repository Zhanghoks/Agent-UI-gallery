The banner that says an external agent runtime is down, with its last error.

Hand-written from `apps/web/src/components/Settings/agent-team/AgentletHealthBanner.tsx`.

## What the consumer provides

The agentlet's health state and its last error message.

## Rules

1px `warning-light` at 60% over a `warning-light` at 15% fill, `rounded-md px-3 py-2 mb-3`, laid out `items-start gap-2` with a `size-3.5` `warning` glyph nudged `mt-0.5` onto the first line of text.

The `-light` token at low opacity rather than `warning-bg` keeps this banner quieter than a toast, which is right for a settings screen the person opened deliberately.

The last error is a full-width ghost `Button` forced to `px-0 py-0 text-[11px] leading-snug` with a truncating label — so the raw error is quotable and expandable without becoming the loudest thing on the screen. Never hide it: a connection error string is usually the only diagnosis available.

## Don't

Don't use `danger`, don't show the banner when the runtime is healthy, and don't swallow the error text into a generic message.
