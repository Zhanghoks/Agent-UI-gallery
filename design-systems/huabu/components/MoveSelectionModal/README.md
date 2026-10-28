The dialog for moving a selection into another Space.

Hand-written from `apps/web/src/components/Panels/Canvas/MoveSelectionModal.tsx`.

## What the consumer provides

The selection, the available destination Spaces, and the move handler.

## Rules

A `Modal` whose body is a stack of full-width controls at `mt-4` / `mt-3`: the destination `Select`, then the consequence in `xs` `fg-subtle`, then the options.

State the consequence before the confirm, in plain words — edges to nodes that stay behind are removed. A move across Spaces is not undoable by dragging back, so the dialog's job is to make the outcome legible, not to be brief.

The checkbox row is `items-start gap-2` in `sm` `fg-default`, with the box at `accent-info h-4 w-4` nudged `mt-0.5` onto the first line, and the whole label `cursor-pointer`. A native checkbox with `accent-color` is the one place the app uses a browser control rather than its own — and pointing `accent-color` at `info` is what keeps it inside the system.

## Don't

Don't default to leaving nothing behind without saying so, don't use `danger` for the confirm (this is a move, not a delete), and don't hide the destination list behind a search when there are few Spaces.
