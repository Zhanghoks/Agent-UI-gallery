The shortcut sheet.

Hand-written from `apps/web/src/components/Panels/Header/KeyboardShortcutsModal.tsx` and `apps/web/src/config/shortcuts.ts`.

## What the consumer provides

Nothing — it reads the shortcut config, which is the same source the handlers use.

## Rules

A `Modal` with the standard title, laid out in columns of label-and-keys rows. Keys are `kbd` chips: mono `xs` on `bg-default` with a 1px `edge-default` border at `rounded-sm` — the same chip `PermissionCard` uses for scopes, so a "thing you type" looks the same everywhere.

Group by how the canvas is used — navigate, create, select, agents — not by key order or alphabetically. The person is looking for "how do I pan", not for "what does Space do".

Read the bindings from `shortcuts.ts` rather than writing them into the sheet, or the documentation drifts from the handlers.

## Don't

Don't hard-code key labels, don't list a shortcut the current pointer mode cannot use without saying so, and don't make the sheet scroll if columns can hold it.
