Status filter chips that reorganise a live table.

## When to use

- Chips show counts per status; rows animate their height as filters change.
- Status pills derive from one base hue each via `color-mix` (`filter-status-*` classes).

## Props

```ts
{ rows, labels, }?: {
    rows?: TableRow[];
    labels?: FilterTableLabels;
    variant?: string;
}
```

Full types: `components/FilterTable/FilterTable.d.ts`. Source: `components/primitives/FilterTable.tsx` in slev12397/beautiful-ui.
