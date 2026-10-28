The signal that an agent is working, shown as the agent's own words shimmering.

Hand-written from `apps/web/src/components/Common/ThinkingIndicator.tsx` and the `.thinking-shimmer` rule in `apps/web/src/index.css`.

## What the consumer provides

The text — either "Thinking…" or the current intent, in the agent's own phrasing.

## Rules

The text carries the animation instead of sitting beside a spinner: a five-stop gradient running `shimmer-1 → shimmer-2 → shimmer-3 → shimmer-2 → shimmer-1`, `background-clip: text` with a transparent text fill, sliding 400% of its width over 3s linear. Set it at `sm`, weight 400.

It is deliberately slow and low-contrast. An agent thinking is the normal state of this app, not an event, and a fast or bright indicator next to a canvas of real work reads as an alarm.

## Don't

Don't pair it with a spinner — one waiting signal per place. Don't shimmer text a person needs to read carefully; the gradient costs legibility, which is fine for a status line and not for content.
