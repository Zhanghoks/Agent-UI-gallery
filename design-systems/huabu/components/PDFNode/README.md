A PDF on the canvas: its first page as a thumbnail, its title, and an extract.

Hand-written from `apps/web/src/components/Nodes/pdf/PDFNode.tsx`, `PDFFirstPageThumbnail.tsx`, `PDFPreview.tsx` and `docs/architecture/canvas-zoom-rendering.md`.

## What the consumer provides

The file, its title, and an extracted text summary.

## Rules

The card is the standard shell with a `bg-default` thumbnail strip, the title in `PreviewCard`'s pattern, and the extract in `base`/`fg-muted` at `line-clamp-5`.

Cost boundaries are part of the design. pdf.js loads lazily and only when an uncached first-page thumbnail is actually needed. In the expanded preview every page keeps a cheap aspect-ratio placeholder and only pages within one scroll viewport mount their canvas and text layer, with a six-page LRU so a short scroll back does not re-render. A PDF node is on the binary LOD ladder with note and web, so below `lod-threshold` it is just its title.

Selection and search paint differently here than anywhere else, because pdf.js draws transparent text spans over a rendered bitmap. Selection uses `pdf-selection-border` with a 12% `info` wash; search highlights go through the CSS Custom Highlight API at 45% `warning-light`, diluted again inside the text layer, and never set a `color` — forcing a visible foreground would ghost the text layer's system font next to the real PDF glyphs.

In-preview search (⌘F inside an expanded PDF) is its own state: a two-worker background index, a result count that is only final once indexing completes, and navigation held until then so concurrently indexed pages cannot renumber an active result. It never touches the Canvas Layers panel or canvas-wide search.

## Don't

Don't render every page eagerly, and don't let canvas-wide search inject its query into the PDF preview — they are separate searches with separate lifecycles.
