The shell every canvas node wears: a rounded surface, a 3px accent border, and the state visuals for hover, edit, drag and selection.

Hand-written from `apps/web/src/components/Nodes/NodeWrapper.tsx` and `accentTokens.ts`.

## What the consumer provides

The node's type, its geometry, its `style.accent` token, and the body content. The shell owns nothing about the content; it owns the chrome.

## The one-token rule

A node stores exactly one colour field — `style.accent`, a palette token or `null`. Border, fill tint and text tint are all derived from it by `getAccentTokens`, using the mix ratios in Opacity: border 75% accent over transparent, fill 10% accent over `bg-surface`, text 60% accent into `fg-default`, divider 25%, static section tint 4%, inline highlight 25%. An edge of the same accent uses the raw colour at 100% — the node's border is held back to 75% because it covers far more perimeter, and the two still read as one family.

Never give a node independent background, border and text colours. The parallel `style.backgroundColor` and `style.textColor` fields were removed for exactly this reason: with three fields, an agent and the UI can desynchronise the three layers and produce an unreadable node.

`accent-white` is achromatic — mixing it into `fg-default` yields a washed mid-grey. Detect `white` / `#fff` / `#ffffff` and use `fg-default` unmixed. "No accent" is `null`, not a palette entry: the card goes transparent and the canvas shows through.

## States

Rest is a transparent `border-node` and no shadow. Hover and editing add `elevation-hover`; dragging adds `elevation-drag`. Hover also adds a ring in `edge-default` — but only while unselected, and never on a sketch.

Selection is *not* drawn here. It is a screen-space overlay above all nodes so that clicking never reorders z-index; see CanvasSurface.

Animate with `transition`, never `transition-all`: the outer React Flow container's pixel width and height are rewritten on every resize tick, and animating them makes the card trail the resize handle by a beat.

## Per-type exceptions

An image node paints its 3px accent border as a non-interactive overlay above the media instead of consuming layout, so the shell never insets the image and changes its aspect box. A question (agent) node forces `border-color: transparent`, overflows visibly for its badges and progress bar, and supplies its own fill. A sketch node's bounding box is pointer-transparent until a hit test against the stored stroke points tags it — clicks in its empty area drill through to whatever is underneath, the way a vector editor behaves — except when it is selected, when the whole box becomes grabbable.

Resize handles are screen-space squares with no radius: 8px for the mouse, 12px for touch and pen. The edge resize lines get a 12px invisible hit strip while the visible outline stays a hairline.

## Don't

Don't hide provenance on a card too small to read — below `badge-min-width` (150px on screen) the AI badge is dropped rather than shrunk. Don't add a coloured left border as an accent device; the accent is the whole border.
