Pixel-grid loader for long-running work, with a shimmering label and a live elapsed timer.

## When to use

- Variants: `Drive` (square cells, chevron wavefront), `Dots` (circular cells), `Orbit` (a comet lapping the perimeter), `Surfer` (Drive plus a looping video below).
- The timer uses mono tabular figures; reduced motion freezes the grid but the timer still ticks.
- `Surfer` streams its demo video from a public URL (`videoSrc`); supply your own or avoid that variant.

## Props

```ts
{ label, variant, 
/** the meme feed for the Surfer variant; hosted on Vercel Blob so it plays in
 *  production (the local /public/subway-surfers.mp4 stays gitignored).
 *  Heavily compressed (288px, 20fps, no audio → ~265 KB, from 1.1 MB) to keep
 *  Blob data transfer down. */
videoSrc, }: {
    label?: string;
    variant?: string;
    videoSrc?: string;
}
```

Full types: `components/LoadingState/LoadingState.d.ts`. Source: `components/primitives/LoadingState.tsx` in slev12397/beautiful-ui.
