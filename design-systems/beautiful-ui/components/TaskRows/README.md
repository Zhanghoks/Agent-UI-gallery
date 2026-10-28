Live agent task status: running, failed, retried and completed, as capsules or a list.

## When to use

- Variants: `Capsules` and `List`. Rows enter staggered 80ms apart; progress rings sweep; a failed row offers retry.
- The status run plays once; task details stay clickable.

## Props

```ts
{ variant, rows, labels, className, onToggleRow, }: {
    variant?: string;
    rows?: TaskRow[];
    labels?: Partial<TaskRowsLabels>;
    className?: string;
    onToggleRow?: (key: string, open: boolean) => void;
}
```

Full types: `components/TaskRows/TaskRows.d.ts`. Source: `components/primitives/TaskRows.tsx` in slev12397/beautiful-ui.
