A video on the canvas, at rest.

Hand-written from `apps/web/src/components/Nodes/video/VideoNode.tsx` and `VideoPreview.tsx`.

## What the consumer provides

The media source and the node geometry.

## Rules

The node's own fill is `fg-default` at 5% — a neutral mat behind letterboxed media, deliberately derived from the text colour rather than being a surface token, so it works in both themes without a second value. The media is `object-contain`, `pointer-events-none` and `select-none`.

A `bg-inverse` scrim at 10% sits over the media and goes to 20% on group hover, with a play disc at `bg-inverse` 40% plus `backdrop-blur-sm` that scales to 1.1×. The scrim is what makes a paused frame read as playable without chrome; only colour and transform animate.

No inline controls on the canvas card. Playback is the expanded preview's job — a 200px-wide node cannot hold a usable scrubber, and the card's whole purpose is to be recognisable at a glance.

## Don't

Don't autoplay, don't loop a preview, and don't put a duration badge on the card — that is metadata for the preview panel.
