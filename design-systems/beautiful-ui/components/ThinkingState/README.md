Expandable agent trace in four variants: steps, reasoning, search and coding.

## When to use

- `Steps`: a step list with spinner to muted checks. `Reasoning`: prose that expands, then settles. `Search`: query plus sources read. `Coding`: files read, edits, commands.
- The trace runs once, settles, and stays expandable. Feed it your agent's reasoning and step events.

## Props

```ts
{ variant, onSettled, rows, active, done, icon, }: {
    variant?: string;
    onSettled?: () => void;
    /** override the built-in trace content (keeps the primitive reusable) */
    rows?: Row[];
    active?: string;
    done?: string;
    /** override the header glyph (defaults to the sparkle) */
    icon?: ReactNode;
}
```

Full types: `components/ThinkingState/ThinkingState.d.ts`. Source: `components/primitives/ThinkingState.tsx` in slev12397/beautiful-ui.
