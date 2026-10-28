The slot a node type renders its own header controls into, so the preview keeps owning the geometry.

Hand-written from `apps/web/src/components/Nodes/PreviewHeaderSlot.tsx` and its consumers in `web/WebNode.tsx` and `pdf/PDFPreview.tsx`.

## What the consumer provides

Whatever that node type needs at the top of its preview: a URL row, a page indicator, a search affordance.

## Rules

It is a portal, not a layout. The preview decides where the header sits, how tall it is, and that it is separated by a hairline; the node type only supplies the contents. That split is why a PDF's page row and a web node's URL row line up at the same height with the same border.

Contents stay `xs` in `fg-muted`, and the slot introduces no surface colour of its own — it sits on the preview's `bg-surface`. Anything interactive inside it carries `nodrag`.

## Don't

Don't let a node type set the header's padding, height or background; if a type needs a different header shape, that is a change to the slot, not a local override.
