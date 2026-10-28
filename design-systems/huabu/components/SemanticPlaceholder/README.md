What a heavy node becomes when it is too small on screen to read: its title alone, at a size that expresses how big the node is.

Hand-written from `apps/web/src/config/semanticZoom.ts`, `SemanticPlaceholder.tsx` and `docs/architecture/canvas-zoom-rendering.md`.

## What the consumer provides

The node's title, its canvas width and height, and the current LOD. `note`, `pdf` and `web` opt into the `full → minimal` pipeline; every other type stays `full` at every zoom, and the agent node uses its own continuous takeover instead.

## The design principle

At a given zoom, a placeholder's font size expresses *hierarchy*, never content length. Pick the tier from the node's representative canvas size — the geometric mean √(width × height), so a wide-short and a tall-narrow node of equal area land in the same tier — and apply `lod-32` under 300px, `lod-52` under 600px, `lod-76` above. Same-size nodes therefore always render the same type, and the zoomed-out canvas keeps a stable typographic rhythm instead of a 42px label sitting next to an 11px one.

Because the tier is a canvas size, the label simply scales down with the node as the viewport zooms out. There is no separate icon or glyph floor: a smaller node just shows smaller text.

Titles wrap at word boundaries — never mid-word — up to the smaller of `lod-max-lines` (6) and however many lines physically fit the node's height, then ellipsize. They never keep shrinking to fit.

## Mechanics

`useNodeLOD` compares `nodeWidth × zoom` against `lod-threshold` (150px) with `lod-hysteresis` (10px): a full node must fall below 140px to collapse and a minimal one must reach 160px to expand, so nothing flickers at the boundary.

Keep both layers mounted in the same node shell and cross-fade them over `lod-fade` (120ms), transitioning `opacity` and `visibility` only — geometry stays immediate. Delay the visibility change until the outgoing opacity reaches zero so hidden editors leave the focus order without cutting the fade short. Honour `prefers-reduced-motion: reduce` by dropping the transition entirely.

The placeholder derives its accent tint from the same `getAccentTokens` formulas the full card uses. If it didn't, the node would visibly jump colour at the LOD boundary.

## Don't

Don't add a tier without adding it to `MINIMAL_TYPOGRAPHY_SCALE` — the scale and the config are pure data precisely so tuning never touches render logic. Don't scale the font by title length, and don't show an icon in place of the title: at zoomed-out scale the words are what a person is scanning for.
