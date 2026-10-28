Reusable streaming-text primitive: characters reveal quickly out of a soft blur, with a caret.

## When to use

- The consumer supplies `text`; tune `charsPerTick`, `tickMs`, `blurTail`, `caret`.
- Inherits typography from its context, so it drops into any text surface.
- `onProgress` fires each tick (re-anchor UI to reflowing text); `onDone` once the text settles. Change `key` to replay.

## Props

```ts
{ text, charsPerTick, tickMs, blurTail, caret, className, onProgress, onDone, }: {
    text: string;
    /** characters revealed per tick — higher is faster */
    charsPerTick?: number;
    /** interval between reveals, ms */
    tickMs?: number;
    /** how many trailing characters carry the soft blur edge */
    blurTail?: number;
    /** render the caret (solid while streaming, blinks once idle) */
    caret?: boolean;
    className?: string;
    /** fires each tick — useful for re-anchoring UI to reflowing text */
    onProgress?: () => void;
    /** fires once the full string is shown */
    onDone?: () => void;
}
```

Full types: `components/StreamText/StreamText.d.ts`. Source: `components/atoms/StreamText.tsx` in slev12397/beautiful-ui.
