Previews of the nodes an agent is adding to the canvas.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/SnapshotNodesCard.tsx`.

## What the consumer provides

The pending nodes with their rendered snapshots and titles.

## Rules

Each preview is a `w-32` column: an `h-24` `bg-default` pane with a 1px `edge-default` border and `overflow-hidden`, then the node's title. They wrap at `gap-3` inside the disclosure's border-indented thread, so adding twelve nodes reads as a contact sheet rather than twelve cards.

Showing the actual snapshot is what makes this reviewable — the person is agreeing to specific content landing on their canvas, and a list of titles does not let them judge that.

A failure keeps the same thread and puts the reason in a `danger` mono block. The card itself never changes colour; the glyph does.

## Don't

Don't make the previews interactive here — the canvas is where nodes are handled. Don't drop a snapshot that failed to render; show the title and say so.
