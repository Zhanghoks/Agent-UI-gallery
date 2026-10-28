The agent asking permission to do something outside the canvas.

Hand-written from `apps/web/src/components/Messages/AIMessage/PermissionCard.tsx`.

## What the consumer provides

The request title, the command or operation, the scope it affects, and the options with their kinds.

## Rules

1px `edge-default` on `bg-surface` at `rounded-xl` with `px-3 py-2.5` — the roundest card in the transcript, so a decision does not read as another log line.

`warning`, not `danger`: nothing has gone wrong, and the person is being asked, not warned. A `size-6` `warning-bg` disc with a `warning` glyph leads the header, then the title in `sm` medium `fg-default`. The command sits in a `CommandBlock` tinted `warning-bg` at 45% with its prompt in `warning`. Scope chips are mono `xs` on `bg-default` with a 1px border — the paths and modes the person is actually agreeing to.

Options map their kind onto `Button`'s shared `variant` and `tone` through `variantForOption` / `toneForOption`, so "allow once", "always allow" and "deny" get their weight from the button system rather than from local styling.

Once answered, the entire header drops from `warning` to `fg-subtle`. The card stays in the transcript as a record, visibly spent.

## Don't

Don't use `danger` for a permission request, don't pre-select an option, and don't let the card disappear once answered — what was allowed is part of the session's history.
