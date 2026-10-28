A value shown in a form that this screen cannot change.

Hand-written from `apps/web/src/components/Settings/agent-team/ReadOnlyField.tsx`.

## What the consumer provides

The label and the value.

## Rules

Same geometry as a `TextInput`, so a form does not reflow if a field later becomes editable — but on `bg-default` with `fg-muted` text, no border highlight and no focus ring.

It is deliberately **not** a disabled input. A disabled control says "you could change this, but not now"; this says "this is what it is, and it is set somewhere else". Paths, ids and protocol versions keep the mono family.

## Don't

Don't render it as a disabled `TextInput`, don't make it look copyable if it is not selectable, and don't truncate an id without a `title`.
