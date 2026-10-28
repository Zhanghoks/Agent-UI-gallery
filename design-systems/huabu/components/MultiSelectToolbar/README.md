The toolbar for a multi-node selection.

Hand-written from `apps/web/src/components/Panels/Canvas/FloatingToolbars/MultiSelectToolbar.tsx`.

## What the consumer provides

The selected node ids and the group actions.

## Rules

Same `FLOATING_TOOLBAR_CLASS` chrome as every other canvas toolbar. The count leads — the selection is the subject of every action here, and saying "5 selected" is what makes a destructive action legible before it is taken.

Everything in it applies to the whole selection: set an accent, wrap in a frame, align, move to another Space, delete. Nothing type-specific goes here; an action that only makes sense for one node type belongs on `NodeFloatingToolbar`.

The selection's bounding box carries `MultiSelectResizer`'s own handles, so the toolbar never needs to offer resize controls.

## Don't

Don't show a per-type action because every selected node happens to share a type — the person selected a group, and the bar should not change shape as the group changes. Don't offer an action that would silently skip some of the selection.
