A filesystem path field with a native folder picker beside it.

Hand-written from `apps/web/src/components/Common/PathInput.tsx`.

## What the consumer provides

The path `value`, `onChange`, the picker handler, and `size` (`sm` or `md`, default `md`), which drives the button size, the glyph size and the field's padding together.

## Rules

A mono `TextInput` — paths are configuration values, so they are always monospace — with an `outline` icon `Button` at `aspect-square` next to it, the two joined at `gap-1.5` with `items-stretch` so the button matches the field's height exactly.

The glyph is a `Folder` at 14px (`sm`) or 16px (`md`) in `fg-subtle`, replaced by an inline `Loading` spinner at the same size while the native dialog is open. Keeping the two the same size is what stops the button from jumping when the dialog opens.

## Don't

Don't validate a path by turning the field red as the person types — a path that does not exist yet is a normal thing to type. Report a missing folder where the path is used, the way the missing-file banner does.
