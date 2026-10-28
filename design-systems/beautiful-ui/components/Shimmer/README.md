Shimmering label that signals the agent is processing.

## When to use

- A gradient sweep from `ink-3` through `ink`, 1.8s linear loop (`shimmer-text` keyframes in bundle.css).
- Use for the active step label only; settle to plain text when done.

## Props

```ts
{ children, className, }: {
    children: React.ReactNode;
    className?: string;
}
```

Full types: `components/Shimmer/Shimmer.d.ts`. Source: `components/atoms/Shimmer.tsx` in slev12397/beautiful-ui.
