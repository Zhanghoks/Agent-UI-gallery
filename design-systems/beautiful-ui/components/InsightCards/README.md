Paged agent insights with scrub-ready live charts.

## When to use

- An 'Insights N' carousel of mini-visualisations: comparison lines, anomaly, allocation. Autoplay yields as soon as a person uses it.
- Charts use `liveline`; tooltips use the `tooltip-*` tokens and follow the theme.

## Props

```ts
{ pages, labels, }?: {
    variant?: string;
    pages?: InsightPage[];
    labels?: Partial<InsightCardsLabels>;
}
```

Full types: `components/InsightCards/InsightCards.d.ts`. Source: `components/primitives/InsightCards.tsx` in slev12397/beautiful-ui.
