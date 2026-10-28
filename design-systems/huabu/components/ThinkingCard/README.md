The agent's reasoning, shown as it arrives.

Hand-written from `apps/web/src/components/Messages/AIMessage/ThinkingCard.tsx`.

## What the consumer provides

The reasoning text and whether it is still streaming.

## Rules

Set in `fg-muted` at 70%, italic, at `px-1 gap-1`, with `whitespace-pre-wrap` and `wrap-break-word`. It is the quietest text in the transcript on purpose: this is thinking, not an answer, and a person skimming for the conclusion should be able to skip it without effort.

While it streams, a `fg-muted/60` spinner and three 4px `fg-muted/50` dots stand in for the text that has not arrived.

It is not a card — no border, no fill, no radius. Giving reasoning a surface would put it on the same footing as a plan or a permission request, which are things the person has to act on.

## Don't

Don't render reasoning in `fg-default`, and don't box it. Reasoning that needs a card is an answer.
