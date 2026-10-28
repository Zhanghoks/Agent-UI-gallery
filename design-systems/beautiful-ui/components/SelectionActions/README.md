Highlight a passage and hand it to the agent to rewrite, from a contextual bar beneath the selection.

## When to use

- Actions such as explain, improve, shorten, rephrase; the rewrite streams in with `StreamText` while `Shimmer` shows progress.
- Composes only existing surface, ink, accent, radius and motion tokens.

## Props

```ts
{ text: textProp, actions, labels, onAction, }?: SelectionActionsProps
```

Full types: `components/SelectionActions/SelectionActions.d.ts`. Source: `components/primitives/SelectionActions.tsx` in slev12397/beautiful-ui.
