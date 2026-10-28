What a panel, list or search result shows when it has nothing in it.

Hand-written from `apps/web/src/components/Common/EmptyState.tsx`.

## What the consumer provides

`message`, and optionally an `action` element.

## Rules

A centred column at `py-20`. The message is `sm` in `fg-subtle` — the quietest text colour in the system — because an empty surface is usually a starting point, not a failure. An optional action sits `mt-4` below it, and it is the only thing here that may be a button.

Say what to do next, not that there is nothing: "Drop a file, or press N for a note" beats "No nodes". One sentence.

## Don't

Don't add an illustration, an icon or a heading — this component is deliberately one line. Don't use it for an error; an error has a tone and belongs in a banner or a toast.
