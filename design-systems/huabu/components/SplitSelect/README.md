A primary action with its own option menu attached — run *this*, or pick a different thing to run.

Hand-written from `apps/web/src/components/Common/SplitSelect.tsx`.

## What the consumer provides

The action's label and handler, the `options` for the menu, `value`, `onChange`, and optionally `variant`, `size`, `shape` and a `menuClassName`.

## Rules

Two `Button`s that read as one control. The left keeps the leading radius, the right the trailing one, and in `outline` the left drops its right border (`border-r-0`) so the seam between them is a single hairline rather than two stacked borders. The menu button takes one size step down from the action, so it reads as subordinate.

`ghost` is the exception: with no borders there is no seam to manage, so the two buttons separate by a small gap instead of welding together.

## Don't

Don't let the two halves disagree on `variant` or `shape` — they are one control. Don't put a destructive action on the left half with its confirmation in the menu; the menu is for choosing, not confirming.
