The canvas selection, shown in the chat panel as the context the next turn will carry.

Hand-written from `apps/web/src/components/Panels/ChatPanel/SelectedNodeRefs.tsx`.

## What the consumer provides

Nothing — it reads the live canvas selection.

## Rules

A `gap-0.5` column: a `sm` `fg-muted` `leading-tight` header, then the references as `NodeRef` badges at `xs`. The header is `cursor-default` with `focus:outline-none` because it is a readout, not a control.

It reflects the selection live, so it changes as the person clicks around the canvas. That is the point — the person can see what the agent will be given before they type, rather than discovering it in the answer. The references only become part of a turn when the turn is sent, at which point `UserMessage` keeps its own copy.

Use `NodeRef` rather than plain text, so a reference here behaves like a reference anywhere else: clickable, previewable, and struck through if its node is deleted.

## Don't

Don't let the list grow unbounded — summarise past a handful. Don't make the header interactive, and don't freeze the list while the person is still selecting.
