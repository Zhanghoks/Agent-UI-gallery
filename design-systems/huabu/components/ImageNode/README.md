An image on the canvas.

Hand-written from `apps/web/src/components/Nodes/image/ImageNode.tsx` and `ImagePreview.tsx`.

## What the consumer provides

The image source and the node geometry.

## Rules

The image is `object-contain` across the full node footprint and `pointer-events-none`, so a drag anywhere on it moves the node rather than starting a browser image drag.

The accent border is the exception in the whole system: instead of the shell's 3px border consuming layout, the image node paints it as an absolutely positioned overlay above the media, marked `data-node-image-border`, with `rounded-[inherit]`. A shell inset would shrink the content box, change the image's aspect ratio and expose gaps between the media and the border — so the border floats and the media keeps the full box.

Loading is a pulsing `fg-subtle` glyph centred on `bg-surface`; a failed load is a single `sm` line in `fg-subtle`. Both keep the node's geometry, so nothing reflows when the image resolves.

## Don't

Don't crop to fill — `object-contain` means the person sees the whole image, which is what they dropped. Don't put a caption inside the node; a caption is a note beside it.
