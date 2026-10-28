Agent suggestion with a confidence meter and accept/alternative actions.

## When to use

- Uses `EntityChip` and `ValuePill` inline in the recommendation text, `Button` for actions.
- One filled action (Accept), alternatives as `secondary`.

## Props

```ts
{ options, labels, }?: {
    options?: RecommendationOption[];
    labels?: Partial<RecommendationLabels>;
    variant?: string;
}
```

Full types: `components/RecommendationCard/RecommendationCard.d.ts`. Source: `components/primitives/RecommendationCard.tsx` in slev12397/beautiful-ui.
