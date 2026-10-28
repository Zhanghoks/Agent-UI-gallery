A web page on the canvas: framed live where the site allows it, a link card where it does not.

Hand-written from `apps/web/src/components/Nodes/web/WebNode.tsx` and `WebPreview.tsx`.

## What the consumer provides

The URL, and the node geometry.

## Rules

A URL row above the view, separated by a hairline: `nodrag`, `xs` medium in `fg-muted` hovering to `info`, shortened by `shortenForToolbar` and truncated at `max-w-24`. It is the one part of the node that is a link.

Many sites refuse to be framed, so the fallback is a first-class state, not an error: a centred card with the favicon at 64px `object-contain`, the title in `sm` truncated, and the reason in `fg-subtle`. Treat it as the normal outcome for a large share of the web.

Web is on the binary LOD ladder with note and PDF — below `lod-threshold` the frame is dropped entirely for the title, which also means a canvas full of web nodes stops paying for their frames when you zoom out.

Content rendered into the fallback view is styled with system fonts at `line-height: 1.5` and 16px padding; keep that, since the page's own stylesheet is not available.

## Don't

Don't retry framing on a loop, and don't strip the URL row to save space — a framed page with no address is unidentifiable.
