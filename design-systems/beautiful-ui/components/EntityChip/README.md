Inline entity reference: a coloured monogram disc plus a name in a soft field pill.

## When to use

- Names a supplier, person or record inside running text. Softer than a `StatusPill` (no dot, no state).
- The consumer supplies `name`, and optionally `color` (the monogram disc, default `#e08a3c`) and a custom `monogram` glyph.
- `Monogram` is exported on its own for monogram headings.

## Props

```ts
{ name, color, monogram, className, }: {
    name: string;
    color?: string;
    monogram?: React.ReactNode;
    className?: string;
}
```

Full types: `components/EntityChip/EntityChip.d.ts`. Source: `components/atoms/EntityChip.tsx` in slev12397/beautiful-ui.
