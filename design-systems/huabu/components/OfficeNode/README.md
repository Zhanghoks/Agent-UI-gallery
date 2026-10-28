A Word, Excel or PowerPoint file on the canvas.

Hand-written from `apps/web/src/components/Nodes/office/OfficeNode.tsx`, `OfficePreview.tsx` and `apps/web/src/config/nodeIcons.ts`.

## What the consumer provides

The file, its `format` (`docx`, `xlsx`, `pptx`), the title, and an extracted text summary.

## Rules

One node type covers all three formats; only the glyph changes. Resolve it through `getNodeIcon(type, data)` rather than reading `format` locally — that is what keeps the canvas card, the layers sidebar and the expanded breadcrumb showing the same icon. Surfaces without a node instance in hand (filter bars, type pickers) get the generic `FileType2`.

Above the metadata sits a centred format block: the glyph, then the extension in `xs` uppercase with wide tracking in `fg-muted`. Below it the title is `lg` medium with the icon floated into its first line — the `float-left` plus `translate-y-1.75` trick `PreviewCard` uses, so a two-line title wraps under the icon rather than beside it — and the extract is `base` in `fg-muted` at `line-clamp-5`.

## Don't

Don't try to render the document's contents on the canvas card; the extract is the preview. Don't hard-code the per-format colours anywhere else — they belong to the icons.
