Binary on/off switch: ink when on, `line-strong` when off.

## When to use

- Controlled: `checked` and `onChange`; pass `label` for its accessible name, since the switch has no visible text.

## Props

```ts
{ checked, onChange, label, }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
}
```

Full types: `components/Switch/Switch.d.ts`. Source: `components/atoms/Switch.tsx` in slev12397/beautiful-ui.
