Label-left, value-right row: the workhorse of every card.

## When to use

- Label in `ink-2`, value in `ink` at medium weight with tabular figures, optional `meta` in `ink-3`.
- Stack rows inside a card with `line` dividers between them.

## Props

```ts
{ label, value, meta, className, }: {
    label: React.ReactNode;
    value: React.ReactNode;
    meta?: React.ReactNode;
    className?: string;
}
```

Full types: `components/TextRow/TextRow.d.ts`. Source: `components/atoms/TextRow.tsx` in slev12397/beautiful-ui.
