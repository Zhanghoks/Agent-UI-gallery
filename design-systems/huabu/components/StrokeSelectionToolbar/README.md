The toolbar for a region of ink selected inside a sketch.

Hand-written from `apps/web/src/components/Panels/Canvas/FloatingToolbars/StrokeSelectionToolbar.tsx` and `StrokeSelectionRegion.tsx`.

## What the consumer provides

The selected stroke ids, their current colour and size, and the restyle, extract and delete handlers.

## Rules

The subject is a *region*, not a node, and the bar says so: the count is of strokes. Every action applies to exactly those strokes — recolour, resize, split out into a sketch node of their own, delete.

Colour and size controls are the same pickers used while drawing (`SketchColorPresetPicker`, `SketchSizePicker`), so the bar a person sees after selecting ink matches the one they had while making it. The palette includes `ink-black`, which the node accent palette does not.

The region itself is drawn with a dashed `info` outline over an 8% `info` wash — the lasso's own visual language, not a node selection outline, because what is selected is not a rectangle.

## Don't

Don't offer node-level actions here (accent, frame, connect) — the selection is not a node until `Split out` makes one. Don't let the region's outline look like a selection outline; the difference is the point.
