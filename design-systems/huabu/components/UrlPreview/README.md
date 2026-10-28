A web page in the preview workspace, with its address.

Hand-written from `apps/web/src/components/Panels/PreviewWorkspace/UrlPreview.tsx`.

## What the consumer provides

The URL.

## Rules

The bar is `h-10 shrink-0` with a 1px `edge-default` bottom border and `gap-1.5 px-2`. The address sits in an `h-7` `bg-default` field at `rounded-md px-2 text-xs` — it *looks* like an input, and it is deliberately not one: the content is `select-text` text, so the person can copy the URL but cannot navigate by typing. This panel previews a node's address; changing it is the node's business.

Inside it, the **host** is `fg-muted medium` and the rest of the path is quieter, truncated from the end. `dir="ltr"` is set explicitly so an RTL page cannot reorder the URL's parts — a well-known spoofing vector and, more prosaically, unreadable.

An invalid URL is one `p-4` `fg-subtle` line, not an error card: a malformed address is a property of the node, and the node's own banner is where it belongs.

## Don't

Don't make the address editable here, don't drop `dir="ltr"`, and don't hide the host to fit a long path — truncate the path instead.
