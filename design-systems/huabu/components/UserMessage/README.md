What the person said, and what they attached when they said it.

Hand-written from `apps/web/src/components/Messages/UserMessage.tsx`.

## What the consumer provides

The message text and the node references that were attached to the turn.

## Rules

Right-aligned at `max-w-[80%]`, `bg-default` with `fg-default` text, `rounded-md px-4 py-2 text-sm`, and explicitly **no border** (`border-none` over the inherited `border`) — it is the only message in the transcript with a surface of its own, and that surface is the app's ground colour, so the person's words read as pressed into the panel rather than raised above it.

The body is `whitespace-pre-wrap` with `wrap-anywhere` and `leading-relaxed`: the person's own line breaks are meaning, and a pasted URL has to break rather than widen the panel. A leading slash command keeps the mono family.

Attached node references sit in their own right-aligned wrapping row below the bubble at `gap-1`, so the turn reads as "this, about these" without the references crowding the sentence.

## Don't

Don't give it a border or a shadow, don't truncate it, and don't move the references inside the bubble — they are the turn's context, not its text.
