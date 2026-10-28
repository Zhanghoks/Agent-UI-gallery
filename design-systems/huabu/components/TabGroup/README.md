A row of mutually exclusive tabs, built from ghost buttons.

Hand-written from `apps/web/src/components/Common/TabGroup.tsx`.

## What the consumer provides

`options` (value plus label), the current `value`, `onChange`, and an optional `size` passed straight through to `Button` (default `md`).

## Rules

Every tab is a `ghost` `Button` in `fg-muted` that hovers to `fg-default`. The active tab takes a `bg-default` fill with `fg-default` text — this is the one place the app's ground colour is deliberately used as a control fill, which is why an active tab reads as recessed rather than raised. Items sit at `gap-1`.

Because the tabs are buttons, everything `Button` gives you still applies: the same paddings, the same transitions, `title` becoming a tooltip.

## Don't

Don't add an underline or a border to the active tab as well — the fill is the whole signal. Don't use a TabGroup for more than about five options; that is a `Select`.
