The collapsible one-line row that every piece of tool work folds into.

Hand-written from `apps/web/src/components/Messages/AssistantDisclosure.tsx`.

## What the consumer provides

A title, an optional status glyph, and the expanded content.

## Rules

The row is `px-2 py-0.5 text-xs gap-1.5 rounded-md` in `fg-muted`, filling `bg-hover` on hover. `py-0.5` is the tightest row in the app, because a transcript may hold twenty of them and they must not push the answer off screen. The title truncates with its full text in a `title` attribute.

The chevron is `fg-muted` at 50% and rotates 90° when open — quieter than the label, since it is a mechanism rather than content. A `size-3` slot holds the status glyph whether or not there is one, so rows stay aligned down the column.

Expanded content is indented behind a left border in `edge-default` at 40% (`ml-4 pl-3`) rather than sitting in a card. The border is the thread of the work: nested tool output reads as belonging to the row above it, and nothing acquires a surface it does not need.

## Don't

Don't expand by default, don't wrap the title, and don't put a card inside the disclosure — use the border-indent, which is what every tool card here does.
