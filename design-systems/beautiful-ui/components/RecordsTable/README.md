CRM-style grid with tags, sorting, filters, a spreadsheet gutter and relationship status.

## When to use

- Sticky company column, resizable headers, selectable rows and columns, AI-calculated columns with a pulsing state.
- Consumer supplies `rows`; `fill` stretches the shell to its container.
- Needs the `records-*` block of bundle.css (in the source it is the component-specific block of globals.css).

## Props

```ts
{ rows, fill }: {
    rows?: RecordRow[];
    fill?: boolean;
    variant?: string;
}
```

Full types: `components/RecordsTable/RecordsTable.d.ts`. Source: `components/primitives/RecordsTable.tsx` in slev12397/beautiful-ui.
