The connection ports on a node, and the line you drag out of one.

Hand-written from `apps/web/src/components/Nodes/NodeConnectAffordance.tsx`.

## What the consumer provides

The node's geometry, the zoom and viewport transform, and the connection handlers.

## Rules

Ports sit on the node's **border box**, centred on the side they name — not inset, not outside — so aiming at a side and aiming at its port are the same gesture. `portCircleStyle` gives each one a 2.5px `info` border *and* an `info` fill: same colour for both, so a port never reads as a hole in the node.

The aimed-at port grows and shows an `fg-inverse` glyph at 60% of its size, painted at the grown size by the drag layer rather than by the port itself. The dragged line is dashed `info` with a filled tip.

Two layers, deliberately. The in-flow dots live inside the node card, so they fade with it when the card fades at low zoom. The drag tip and the grown target are `z-999` screen-space overlays, so they stay crisp and hittable no matter what the card is doing.

## Don't

Don't show ports until the node is hovered or selected — four `info` discs on every node turns the canvas into a pegboard. Don't put a port on a corner; the four sides are the connection model.
