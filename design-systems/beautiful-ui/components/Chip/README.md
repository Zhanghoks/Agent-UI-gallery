Monospace token chip for code values such as `updated_at`.

## When to use

- Tones: `neutral` (default), `accent`, `orange`.
- Use inline in running text; for names of people or records use `EntityChip`, for plain values `ValuePill`.

## Props

```ts
{ children, tone, className, }: {
    children: React.ReactNode;
    tone?: "neutral" | "accent" | "orange";
    className?: string;
}
```

Full types: `components/Chip/Chip.d.ts`. Source: `components/atoms/Chip.tsx` in slev12397/beautiful-ui.
