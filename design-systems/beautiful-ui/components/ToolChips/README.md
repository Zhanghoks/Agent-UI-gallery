An agent run as compact rows: tool calls with inline chips, then file-diff chips summarising the edits.

## When to use

- Hover a row to reveal its chevron; every row expands to show what the tool actually did.
- Map your agent's tool-call events and diffs onto `steps` and `diffs`.

## Props

```ts
{ steps, diffs, diffLines, labels, className, onOpenChange, onToggleRow, }?: {
    /** Accepted for gallery/registry parity; ToolChips has no visual variants. */
    variant?: string;
    steps?: ToolStep[];
    diffs?: ToolDiff[];
    diffLines?: Record<string, ToolDiffLine[]>;
    labels?: Partial<ToolChipsLabels>;
    className?: string;
    onOpenChange?: (open: boolean) => void;
    onToggleRow?: (label: string, open: boolean) => void;
}
```

Full types: `components/ToolChips/ToolChips.d.ts`. Source: `components/primitives/ToolChips.tsx` in slev12397/beautiful-ui.
