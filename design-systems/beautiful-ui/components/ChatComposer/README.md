Tabbed chat panel with reasoning replies and a composer.

## When to use

- The reply sequence begins only after the user sends.
- Consumer supplies `messages` and `labels`.

## Props

```ts
{ messages, suggestions, labels, onSend, }?: {
    variant?: string;
    /** scripted agent replies revealed in sequence after the user sends */
    messages?: ChatMessage[];
    /** header chips (tabs) for switching context */
    suggestions?: string[];
    /** prominent copy strings */
    labels?: Partial<ChatComposerLabels>;
    /** fired with the trimmed prompt text when the user sends */
    onSend?: (text: string) => void;
}
```

Full types: `components/ChatComposer/ChatComposer.d.ts`. Source: `components/primitives/ChatComposer.tsx` in slev12397/beautiful-ui.
