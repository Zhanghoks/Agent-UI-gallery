Retrieved knowledge chunks with their sources.

## When to use

- Chunks enter once, then remain available. Feed it your retrieval or memory results.

## Props

```ts
{ chunks, labels, className, }?: {
    /** Accepted for gallery/registry parity; ContextCards has no visual variants. */
    variant?: string;
    chunks?: ContextChunk[];
    labels?: Partial<ContextCardsLabels>;
    className?: string;
}
```

Full types: `components/ContextCards/ContextCards.d.ts`. Source: `components/primitives/ContextCards.tsx` in slev12397/beautiful-ui.
