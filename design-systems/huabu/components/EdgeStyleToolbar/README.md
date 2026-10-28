The toolbar for a selected edge.

Hand-written from `apps/web/src/components/Panels/Canvas/FloatingToolbars/EdgeStyleToolbar.tsx` and `edges/LabelledEdge.tsx`.

## What the consumer provides

The selected edge, its current stroke token, width and dash, and the change handlers.

## Rules

Standard `FLOATING_TOOLBAR_CLASS` chrome. Stroke swatches come from the same nine-token accent palette nodes use — an edge paints the raw accent at 100% while a node holds its border to 75%, which is what makes an edge and a node carrying the same token read as one family without the edge disappearing.

Width and dash sit behind a divider, shown as line samples rather than numbers: the person is choosing a look, not a value. `Label` mounts the edge's label pill in edit mode — an empty label only exists while the edge is selected or being edited, so this button is how it is reached.

Delete is last, in `danger`. Deleting an edge is cheap to redo and easy to hit by accident, so keep it behind a divider like everywhere else.

## Don't

Don't offer a colour outside the palette, don't animate the edge on selection beyond the `info` stroke swap and its glow, and don't tie the label pill's border weight to the edge's `strokeWidth` — a chunky edge would get a chunky pill.
