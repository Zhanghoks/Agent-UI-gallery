The transcript's two failure rows: a generation the person stopped, and one that broke.

Hand-written from `apps/web/src/components/Messages/StatusMessage.tsx`.

## What the consumer provides

The status type (`interrupted` or `error`), the detail text, and an optional retry handler.

## Rules

One left-aligned row at `my-2 rounded-md px-2 py-1 text-xs gap-1.5`, full width. `interrupted` takes `bg-info-bg` with a 12px `info-light` glyph and `info` text; `error` takes the `danger` trio the same way.

The glyph uses the `-light` token and the text the full one. That is deliberate: severity should read from the words, with the tint and the glyph supporting them, rather than from a saturated block of colour in the middle of a conversation.

The message wraps with `break-words` rather than truncating — a provider error string is the only clue the person has. Retry is a ghost `Button` in the row's own tone, hovering to its `-bg-hover`.

There are exactly two types. Anything more specific belongs in the failing tool's own card, where the person can see what was being attempted.

## Don't

Don't use a toast for these — they belong in the transcript, at the point the conversation stopped, and they have to survive scrolling. Don't add a third status type without a matching tone in the shared vocabulary.
