Another Space, referenced on this canvas and shown as a live miniature.

Hand-written from `apps/web/src/components/Nodes/spacePreview/SpacePreviewNode.tsx`, `SpacePreviewViewport.tsx` and `docs/architecture/space-preview.md`.

## What the consumer provides

The referenced Space's id. Everything else — name, contents, missing-child count — is read from that Space.

## Rules

A header on `bg-surface` above a hairline: the node glyph at 16px in `fg-muted`, the Space name in `fg-default` medium and truncated, a `warning` `xs` count when the referenced Space has missing children, and an action marked `nodrag`.

The body is a non-interactive miniature of that Space's canvas — the grid and the node rectangles at their real positions, which is what makes it recognisable at a glance rather than just a name. It never accepts pointer input; the person opens the Space to work in it.

A Space that cannot be read is a state, not a failure to hide: a 24px `danger` glyph with one centred line. The node stays on the canvas, because the reference is still meaningful and the person may want to fix the path.

## Don't

Don't let the miniature be interactive or scrollable, and don't recurse — a Space preview inside a Space preview renders its miniature flat.
