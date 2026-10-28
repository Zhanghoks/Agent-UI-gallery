Composer with @ data sources, / commands, a model picker, dictation and send.

## When to use

- Type `@` or `/` to open the menus; arrow keys and Enter to pick.
- Variants: `Rounded` (window radius) and `Pill` (full radius).
- Map the model picker to your available models.

## Differs from the source

The source plays a rainbow shader sweep (the `glimm` package) when the flagship model is picked. That package could not be fetched here, so this bundle disables the sweep; everything else is the source's.

## Props

```ts
{ variant, demo, tall, placeholder, onSend, }: {
    variant?: string;
    /** the self-running walkthrough; turn off when embedding in a real surface */
    demo?: boolean;
    /** hero sizing: a multi-line input with controls on their own row */
    tall?: boolean;
    placeholder?: string;
    onSend?: (text: string) => void;
}
```

Full types: `components/PromptBar/PromptBar.d.ts`. Source: `components/primitives/PromptBar.tsx` in slev12397/beautiful-ui.
