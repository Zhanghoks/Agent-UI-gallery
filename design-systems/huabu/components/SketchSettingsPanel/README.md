The controls that follow the sketch tool: pen or eraser, colour, and size presets.

Hand-written from `apps/web/src/components/Nodes/sketch/SketchSettingsPanel.tsx`, `SketchModeSwitcher.tsx`, `SketchSizePicker.tsx`, `SketchPresetPicker.tsx` and `SketchColorPresetPicker.tsx`.

## What the consumer provides

The `sketchDraft` state from the tool store — mode, colour presets, size presets, eraser size — and the select and update handlers.

## Rules

It floats above the sketch at `bottom-full left-1/2 mb-3 -translate-x-1/2` in `FLOATING_TOOLBAR_CLASS` chrome, and its density follows the *current pointer*, not the persisted preference: `p-1.5` with an `h-9` control row on touch, `px-1.5 py-1` with `h-8` for the mouse.

The control row's height is fixed, so swapping between pen and eraser presets keeps the bar exactly where it is — a bar that resizes under the pen is a bar you miss.

A size preset is an `h-6 w-7` ghost button whose glyph is a pill of the *actual* stroke height, clamped to 2–10px, so the control shows what it does. It sits on `bg-default` when grouped and takes a 1px `info` ring on `bg-surface` when open or selected. Sizes are presets the person can re-tune, not a fixed scale: the eraser spans `sketch-eraser-radius` 4–64px and the pen 1–32px.

Stop `click` and `pointerdown` at the panel root. This bar lives inside the drawing surface, and an unstopped pointer event draws on the canvas behind it.

## Don't

Don't show pen settings while erasing, don't let the bar's width change as values change, and don't couple the eraser radius to the stroke size — they are independent by design.
