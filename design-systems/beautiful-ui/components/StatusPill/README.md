Dot-plus-label pill for a state: completed, needs review, failed, active, queued.

## When to use

- Tones: `green`, `orange`, `red`, `accent`, `neutral`. Colour is a condiment, so the label always carries the meaning.
- Set `dot={false}` to drop the leading dot.
- The consumer supplies the label as `children`.

## Props

```ts
{ tone, children, dot, className, }: {
    tone?: Tone;
    children: React.ReactNode;
    dot?: boolean;
    className?: string;
}
```

Full types: `components/StatusPill/StatusPill.d.ts`. Source: `components/atoms/StatusPill.tsx` in slev12397/beautiful-ui.
