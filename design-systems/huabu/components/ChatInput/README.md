The composer: what you attach, what you type, and which agent answers.

Hand-written from `apps/web/src/components/Panels/ChatPanel/ChatInput.tsx` and `ThreadChatInput.tsx`.

## What the consumer provides

The draft text, the attachments, the selected agent, session and mode, and the submit handler.

## Rules

One `rounded-2xl` box: 1px `edge-default` on `bg-surface` with `p-3`, transitioning colours only. A drag over it fills `info-bg` and keeps the border colour — nothing moves, because a composer that resizes under a dragged file is a composer you miss.

Its shape adapts to what sits above it. With a `ChangeReviewCard` attached, the top corners square off (`rounded-t-none rounded-b-2xl`) so the two share one edge.

Attachments are a `mb-2 flex-wrap gap-2` row of `h-12 w-12` `bg-surface` tiles at `rounded-md`, each with an 8px `fg-subtle` caption clamped to three lines — small enough that six attachments do not push the text field off screen, legible enough to tell two files apart. The add tile is a dashed `edge-default` square.

The footer splits: the compact session and mode selectors on the left, the `ContextUsageRing` and send on the right. On a solid footer the nested selectors are re-tinted through `[&>div]` selectors to `fg-inverse` with a 30% border — the one place in the app where a child component's colours are overridden by its container, and it is done with descendant selectors rather than props.

## Don't

Don't let the box grow past a few lines without scrolling, don't put a second primary action in the footer, and don't drop the ring — knowing the window is nearly full is what lets a person decide to start a new session.
