Inline value badge that sets a plain value (a date, a name, a count) off in prose.

## When to use

- Tones: `neutral`, `green`, `orange`, `red`, `accent`; each gets a 28% ring of its own hue.
- Softer than a `StatusPill` (no dot) and not a mono token (see `Chip`).

## Props

```ts
{ children, tone, className, }: {
    children: React.ReactNode;
    tone?: Tone;
    className?: string;
}
```

Full types: `components/ValuePill/ValuePill.d.ts`. Source: `components/atoms/ValuePill.tsx` in slev12397/beautiful-ui.
