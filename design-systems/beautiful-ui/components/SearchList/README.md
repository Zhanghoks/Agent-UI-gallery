Command search with live filtering and an empty state.

## When to use

- Consumer supplies `items` (strings) and `labels`; rows glide-highlight via `GlideMenu`.

## Props

```ts
{ items, labels, }?: {
    items?: SearchItem[];
    labels?: SearchListLabels;
    variant?: string;
}
```

Full types: `components/SearchList/SearchList.d.ts`. Source: `components/primitives/SearchList.tsx` in slev12397/beautiful-ui.
