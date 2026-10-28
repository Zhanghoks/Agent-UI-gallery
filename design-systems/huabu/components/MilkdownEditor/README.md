The markdown editor behind note bodies and agent answers.

Hand-written from `apps/web/src/components/Milkdown/MilkdownEditor.tsx`, `MilkdownPreview.tsx` and `milkdown-overrides.css`.

## What the consumer provides

The markdown value, the change handler, and the surface it sits on.

## Rules

Milkdown's Crepe theme is **re-skinned, not restyled**: `milkdown-overrides.css` re-binds every `--crepe-*` token the version consumes to an app token, rather than overriding Crepe's rules. That is the whole strategy, and it has a payoff — re-theming the app's own `--fg-*` / `--bg-*` tokens re-themes the editor for free, dark mode included, with no editor-specific dark rules.

The bindings that matter: `--crepe-font-default` and `--crepe-font-title` **inherit**, so the surrounding surface owns the font; `--crepe-color-background` is **transparent**, so a note's accent tint shows through; surface, outline, hover, selected and inverse map to `bg-surface`, `edge-default`, `bg-hover`, `bg-hover` and `bg-inverse`; `--crepe-color-primary` is `info` and `--crepe-color-error` is `danger`.

Pin the Crepe version the overrides were written against (7.21.x), and re-check the token list when it moves — a new `--crepe-*` token with no binding falls back to Crepe's own palette and will look foreign.

## Don't

Don't set a font or a background on the editor root, don't style Crepe's internals by class, and don't add a dark-mode rule here — rebind the token instead.
