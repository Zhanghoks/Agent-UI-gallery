The note: a markdown document living on the canvas. The most common node in a Space.

Hand-written from `apps/web/src/components/Nodes/note/NoteNode.tsx`, `NotePreview.tsx` and `docs/architecture/note-node.md`.

## What the consumer provides

The markdown content, the node geometry, and the accent. Editing is Milkdown's; see MilkdownEditor.

## Rules

The body is markdown rendered by Milkdown inside the standard node shell, inheriting the shell's accent-derived text colour rather than setting its own. Content is not scrollable: a note that overflows shows a fade — a gradient from `fg-subtle` at 30% to transparent over a 40px foot, with a chevron in `fg-subtle` — and the person opens it in the expanded panel to read the rest. A scrollbar inside a node would compete with canvas panning for the same wheel gesture.

While the body is being prepared the node shows a skeleton, not a spinner: the note's shape is already known.

Note is one of the three types on the binary LOD ladder (with PDF and web), so below `lod-threshold` its whole body is swapped for `SemanticPlaceholder`. Keep the two colour derivations identical or the node visibly changes hue as it crosses the boundary.

## Don't

Don't let a note scroll, don't put chrome inside the body — provenance and AI summary are overlays supplied by the shell — and don't set a font size on the body; it is auto-fitted.
