The review strip above the composer: every change an agent has proposed on this canvas, with accept and reject for all of it.

Hand-written from `apps/web/src/components/Panels/ChatPanel/ChangeReviewCard.tsx`.

## What the consumer provides

The pending changes and the accept/reject handlers.

## Rules

It is welded to the composer: `rounded-t-2xl`, `border-b-0` and `-mb-px`, with the composer answering in `rounded-t-none rounded-b-2xl`. The negative margin collapses the two borders into one shared edge, so the strip and the input read as a single control rather than a card sitting on a card.

The header is `px-3 py-1.5 gap-1.5 text-xs` with a truncating `fg-muted` title and a chevron that rotates 90°. The row list is `max-h-48` and scrolls, above a 1px `edge-default` top border. Bulk actions are `h-5` `rounded-sm` buttons — small, because they are always present and only occasionally wanted.

Putting review here, rather than in the transcript, is a product decision: reviewing every proposed change is the promise, so the strip is impossible to scroll away from.

## Don't

Don't separate the strip from the composer with a gap, don't let the row list grow past `max-h-48`, and don't make "Accept all" the visually dominant action — it is a shortcut, not the recommended path.
