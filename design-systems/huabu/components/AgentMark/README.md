The agent attached to a node — its avatar, whether it is running, and how many questions are waiting.

Hand-written from `apps/web/src/components/Nodes/question/QuestionTakeoverMark.tsx`, `QuestionAgentBubble.tsx`, `NodeTakeoverLayer.tsx` and `QuestionAgentBadge.css`.

## What the consumer provides

The agent identity (which supplies the avatar), the run state, and the pending-question count.

## Rules

The mark renders in a **screen-space portal**, not inside the node. That is what lets it keep its physical size and stay legible while the agent node's card fades out at low zoom — and why it must not inherit the card's opacity.

The avatar is a `radius-full` disc ringed in the canvas ground so it reads over any accent. The count chip is `h-6 min-w-6` at 11px bold, `warning-bg` on `warning`, offset `-top-2.5 -right-3.5` with `elevation-hover`. A running agent gets a solid `warning` pip with an `fg-inverse` glyph. `warning` is right here because a waiting question is a thing the person owes an answer to — not an error, not a success.

Zoomed far out the avatar collapses to a plain dot. That dot is the node's last readable form, so it keeps the agent's colour and its ring, and double-clicking it routes to the same activate handler as the card.

## Don't

Don't render the mark inside the node's DOM, don't fade it with the card, and don't show a count of zero — absence is the empty state.
