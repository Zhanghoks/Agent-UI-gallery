The compact pill density every selector in a chat header shares.

Hand-written from `apps/web/src/components/Panels/ChatPanel/SessionSelectorPill.tsx`, `AcpSessionSelectors.tsx` and `BuiltinSessionSelectors.tsx`.

## What the consumer provides

The options, the value and the change handler — it is a thin wrapper over `Select`.

## Rules

One exported constant does the whole job: `COMPACT_TRIGGER_CLASS = 'px-1.5 py-0.5 gap-1'`, applied to a `Select` pill trigger. It exists because a chat header carries four or five selectors — session, model, mode, agent — and without a shared density each one drifts to its own padding and the header stops looking like a row.

Treat the constant as the contract. A new selector in that header imports it; it does not copy the values.

## Don't

Don't put a selector this small outside a dense header — at `py-0.5` the hit target is only acceptable where the surrounding row is equally tight. Don't add an icon and a description to a compact pill; that is the full `Select`.
