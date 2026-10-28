An agent's answer, rendered from markdown.

Hand-written from `apps/web/src/components/Messages/AIMessage/MilkdownMessageCard.tsx` and `apps/web/src/components/Milkdown/MilkdownPreview.tsx`.

## What the consumer provides

The markdown text, streaming or complete.

## Rules

The answer is prose, not a card: no border, no fill, full panel width, `sm` at `leading-relaxed` in `fg-default`. It is the only thing from the agent set in the primary text colour, and that is how the person finds it among reasoning, tool rows and status lines.

Rendering goes through Milkdown, so headings, lists, tables and fences come out in the app's own type scale rather than a library's. Node mentions render inline as `NodeRef` badges; code uses the mono family on `bg-default`.

The markdown *source* is the message. Copying the answer should give markdown back, which also means the renderer must not invent structure the source does not have.

## Don't

Don't box the answer, don't truncate it, and don't re-style the markdown per surface — the same renderer paints a note's body on the canvas, and the two should look alike.
