AI-proposed edits sweeping through tabular data, with per-row accept and an apply-all action.

## When to use

- Removed rows tint `red`, added rows `green`; one accent Apply action.
- Consumer supplies the proposed rows.

## Props

```ts
{ rows, }?: {
    rows?: DiffRow[];
    variant?: string;
}
```

Full types: `components/DiffTable/DiffTable.d.ts`. Source: `components/primitives/DiffTable.tsx` in slev12397/beautiful-ui.
