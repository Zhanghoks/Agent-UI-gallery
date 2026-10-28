The plan an agent proposes before it starts work.

Hand-written from `apps/web/src/components/Messages/AIMessage/PlanCard.tsx`.

## What the consumer provides

The plan steps and the collapsed state.

## Rules

Unlike reasoning, this *is* a card: 1px `edge-default` on `bg-surface`, `rounded-md`, `ml-1`. A plan is something the person reads and may interrupt, so it gets a surface and an edge.

The header is `px-3 py-2 gap-1.5`: an `xs` `fg-default` medium title, the step count in `fg-muted`, and a chevron that rotates when open — the whole row is the toggle, and `Button`'s ghost treatment carries the hover.

Steps stay `xs` in `fg-muted`. A plan is a proposal; styling the steps like completed work would misrepresent what has happened.

## Don't

Don't show progress ticks on a plan — execution is reported by the tool rows that follow. Don't collapse it while the agent is still working through it.
