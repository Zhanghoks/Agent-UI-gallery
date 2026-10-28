The status of the connection to an external (ACP) agent.

Hand-written from `apps/web/src/components/Panels/ChatPanel/AcpConnectionBadge.tsx`.

## What the consumer provides

The connection state.

## Rules

A 6px dot plus a word, at `px-0.5 py-0.5 gap-1`. The three states are deliberately unequal in loudness.

Connecting is `info` with `animate-pulse` — something is happening and the person may need to wait. Connected is `success` at **50% opacity**: a working connection is the expected state, and a bright green dot in a chat header earns attention it does not deserve. Disconnected is `danger` at full strength in 10px uppercase medium with wide tracking and more padding — the one state allowed to be loud, because the person's agent is not going to answer.

## Don't

Don't show a toast for a connection state; the badge is the durable signal and a toast would fire on every reconnect. Don't use `warning` for a degraded connection — it is either usable or it is not.
