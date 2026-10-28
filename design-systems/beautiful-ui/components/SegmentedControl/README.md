Segmented control with equal-width segments and a sliding thumb.

## When to use

- Controlled: the consumer supplies `options`, `value` and `onChange`.
- Inactive segments are `ink-3`, the active one `ink` on a `surface` thumb.

## Props

```ts
{ options, value, onChange, className, }: {
    options: readonly T[];
    value: T;
    onChange: (v: T) => void;
    className?: string;
}
```

Full types: `components/SegmentedControl/SegmentedControl.d.ts`. Source: `components/atoms/SegmentedControl.tsx` in slev12397/beautiful-ui.
