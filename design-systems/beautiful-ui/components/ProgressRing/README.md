Small progress ring with content in the centre, used as a task badge.

## When to use

- `progress` runs 0 to 1; `tone` is `orange` (default), `green`, `red` or `accent`; `size` defaults to 28px.
- The track is `line`; the arc animates with the strong ease-out curve.

## Props

```ts
{ progress, tone, children, size, }: {
    progress: number;
    tone?: "orange" | "green" | "red" | "accent";
    children?: React.ReactNode;
    size?: number;
}
```

Full types: `components/ProgressRing/ProgressRing.d.ts`. Source: `components/atoms/ProgressRing.tsx` in slev12397/beautiful-ui.
