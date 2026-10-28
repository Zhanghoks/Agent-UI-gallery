The raw markdown editor, for editing a note's source.

Hand-written from `apps/web/src/components/CodeMirror/RawMarkdownEditor.tsx` and `huabuLightTheme.ts`.

## What the consumer provides

The markdown source and the change handler.

## Rules

The CodeMirror theme is built entirely from `var(--token)` references rather than literal hex — `FG_DEFAULT`, `BG_SURFACE`, `INFO`, `SUCCESS`, `WARNING`, `DANGER` and the rest are declared once at the top of the theme file and reused. That is what lets a future token change re-theme the editor with no edits here, and it is why the editor matches its surroundings in both themes.

The content background is transparent so the editor inherits whatever surface it is placed on. The active line takes `info-bg` and selection takes `info-bg-hover`, deliberately reusing the app's selected-state convention: "where I am" means the same thing in the editor as in a list or a tree.

Syntax colours come from the status tokens — headings in `info`, emphasis in `warning`, links in `success` — rather than from a stock highlight palette. That keeps the editor inside the system's five hues, and it is also why the selection colour has to be set explicitly: the default would clash with the warning and success spans.

## Don't

Don't introduce a literal colour into the theme, don't add a second highlight palette for dark mode, and don't use this editor where the rendered Milkdown view is what the person expects to edit.
