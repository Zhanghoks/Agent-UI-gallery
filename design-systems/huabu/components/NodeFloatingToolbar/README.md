The toolbar that appears above a selected node.

Hand-written from `apps/web/src/components/Panels/Canvas/FloatingToolbars/NodeFloatingToolbar.tsx`.

## What the consumer provides

The selected node, and the actions its type supports.

## Rules

It uses `FLOATING_TOOLBAR_CLASS` and is anchored above the selection in screen space, so it keeps its physical size at any zoom and never covers the node it acts on. If there is no room above, it flips below.

Order is by frequency, and it is fixed: accent swatches first, because recolouring is the most common edit; then the type's own actions; then any read-only count in `px-1` `fg-subtle`; then the destructive action last, in `danger`, behind a divider. A person reaching for delete should never be able to hit "change colour" and vice versa.

Only show actions the selected type actually supports. An action that is present but inert teaches the person that the toolbar lies.

## Don't

Don't show it while a node is being dragged or resized, don't put more than about eight controls in it, and don't duplicate what the context menu offers in full — the toolbar is the short list.
