The shared layout behind every file-backed node: media on top, title and body below.

Hand-written from `apps/web/src/components/Nodes/PreviewCard.tsx` and `previews.ts`.

## What the consumer provides

The thumbnail, an icon, a title, and the body content as children. PDF, Office, image and web previews all render through this.

## Rules

A `bg-surface` column, `overflow-hidden`, in three parts: the media at `object-cover` over a `bg-default` backing that shrinks as the info area needs room; the title row at `px-4 pt-2`; and the body at `px-4 pb-2`.

The title is `lg` medium with `wrap-break-word`, and its icon is `float-left` with `mr-2` and `translate-y-1.75` rather than being a flex sibling. That is deliberate: floating makes a two-line title wrap *under* the icon instead of forming a narrow column beside it, and the small translate puts the 16px `rounded-sm` glyph on the text's optical centre.

The info area's height is driven by content, and the thumbnail yields to it — so a node with a long title shows less picture rather than clipping its own title.

## Don't

Don't reimplement this per node type; a node type supplies a thumbnail, an icon, a title and a body, and nothing else. Don't let the title's icon be a flex item — the float is the layout.
