The command list that opens above the composer when a message starts with `/`.

Hand-written from `apps/web/src/components/Panels/ChatPanel/SlashCommandMenu.tsx`.

## What the consumer provides

The available commands — name, argument hint, description — and the selection handlers.

## Rules

Anchored `absolute bottom-full left-0 right-0 mb-2 z-50`: it grows upward from the composer and spans its full width, so the person's eye does not move sideways to read it. 1px `edge-default` on `bg-surface`, `rounded-lg`, `elevation-toast`, `max-h-64` and scrolling.

A row is a `px-3 py-2 gap-0.5` column, not a single line: the name in **mono** `xs` medium with its argument hint beside it in truncated `fg-subtle`, then the description in `fg-muted` at two lines. Mono for the name is what makes a command look typed rather than clicked.

Loading is its own row — a `size-3.5` `edge-default` ring with an `fg-muted` top, in a `px-3 py-2.5` row — rather than an empty panel, because commands can come from an external agent and may take a moment.

The highlighted row uses the same `bg-hover` fill as keyboard navigation, so mouse and keyboard agree on what is selected.

## Don't

Don't open downward, don't filter out a command the person has already typed in full, and don't run a command on hover.
