Streamed answer with inline source citations, actions and follow-up suggestions.

## When to use

- Renders word-by-word; cited spans link to sources shown as favicon avatars (`source-avatar` ring).
- Consumer supplies `tokens`, `sources` and labels; wire it to your token stream (SSE or the AI SDK's `streamText`).

## Props

```ts
{ content, sources, followUps, labels, loop, fill, onDone, onFollowUp, }?: {
    variant?: string;
    /** the streamed tokens; `cite` tokens render an inline source chip */
    content?: StreamingToken[];
    /** cited sources shown in the chip, avatar stack, and expanded list */
    sources?: StreamingSource[];
    /** follow-up prompt suggestions shown once the stream completes */
    followUps?: string[];
    /** prominent copy strings */
    labels?: Partial<StreamingLabels>;
    /** restart the stream after a hold; turn off when embedding in a real thread */
    loop?: boolean;
    /** fill the parent width instead of the gallery's fixed measure */
    fill?: boolean;
    onDone?: () => void;
    /** fired when a follow-up prompt is chosen */
    onFollowUp?: (text: string, index: number) => void;
}
```

Full types: `components/StreamingText/StreamingText.d.ts`. Source: `components/primitives/StreamingText.tsx` in slev12397/beautiful-ui.
