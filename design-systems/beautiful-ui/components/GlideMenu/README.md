A single hover highlight that glides between interactive menu rows.

## When to use

- Wrap rows in `GlideMenu`; mark each row with `data-menu-row` (or pass another `rowSelector`).
- The highlight defaults to `bg-hover` with an 8px radius; override with `highlightClassName`.
- Shared by `ApprovalCard`, `RecordsTable`, `SidebarNav`, `SearchList` and `FineTuneCard`.

## Props

```ts
{ children, className, highlightClassName, rowSelector, }: GlideMenuProps
```

Full types: `components/GlideMenu/GlideMenu.d.ts`. Source: `components/primitives/GlideMenu.tsx` in slev12397/beautiful-ui.
