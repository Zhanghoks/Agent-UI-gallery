Bare text on the canvas — a label, a heading, a question written large.

Hand-written from `apps/web/src/components/Nodes/text/TextNode.tsx`, `shared/TextNodeBody.tsx`, `utils/node/nodeFontConfig.ts` and `utils/node/textMeasure.ts`.

## What the consumer provides

The text, the box, and the style fields: `fontFamily` (`default`, `serif`, `mono`, `hand`), `fontWeight`, `fontStyle`.

## Rules

A text node has no surface: transparent fill, transparent border, nothing but type over the canvas. Padding is `node-padding-x` 12 and `node-padding-y` 4, and the line-height is fixed at `1.5`.

The font size is measured, not chosen: `computeFontSizeForHeight` fits the text to the box, and the same measurement runs again in the frame-resize cascade, so a text node inside a frame re-fits when the frame changes. Renderer and measurer must agree exactly on family, padding and line-height — which is why all of them live in `nodeFontConfig.ts` and are imported, never re-declared.

The placeholder `Type...` is measured the same way, so an empty node is sized to fit its placeholder rather than filling its height with one oversized line.

## Don't

Don't give a text node a background or border — that is a note. Don't hard-code a font size, and don't add a family outside the four the store allows.
