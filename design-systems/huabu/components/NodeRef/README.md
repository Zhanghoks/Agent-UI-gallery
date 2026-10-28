A reference to a node, inline in a sentence — how an agent names the things it is looking at.

Hand-written from `apps/web/src/components/Common/NodeRef.tsx`.

## What the consumer provides

The node id and label, the node type (which picks the icon through `getNodeIcon`), an optional `strokeCount` for a partial sketch reference, and the previewing and disabled states.

## Rules

A 10px inline badge with `rounded` corners, a 1px `edge-default` border at 60%, a transparent fill, the node-type icon at 9px, and a label truncated at 100px. `align-middle` so it sits on the text baseline in a paragraph without changing its line height. Hover fills `info-bg`.

Three states carry meaning. Default is clickable and focuses the node. Previewing takes the `info` border, `info-bg` fill and `info` text plus the `preview-blink` animation — 0.6s, opacity 1 → 0.3, faster than a pulse — so the badge and the node it is pointing at blink together. A deleted target drops to 40% with a line-through and stops responding, because the sentence stays true even after the node is gone.

It is a `role="button"` with a keyboard handler for Enter and Space, since it lives inside prose rather than a control row.

## Don't

Don't let the label wrap or grow past 100px — a reference is a pointer, not a quotation. Don't hide a reference whose node was deleted; strike it through so the sentence still parses.
