The search field above the layers tree, and its result count.

Hand-written from `apps/web/src/components/Panels/CanvasLayerPanel/CanvasSearchInput.tsx` and `CanvasSearchResults.tsx`.

## What the consumer provides

The query, the running state, the match count, and the clear handler.

## Rules

It is a row, not a bordered field with a button: an `fg-subtle` glyph, then a transparent `py-1 text-xs` input with `outline-none` that inherits the row's surface, then the state on the right. Search is continuous here — there is no submit — so the field should not look like a form.

The right side shows a spinning `fg-subtle` ring while a search runs and an **11px `tabular-nums`** `fg-subtle` count when it settles. Tabular figures matter: the count changes on almost every keystroke, and proportional digits make the row twitch.

The clear button is forced to `p-0.5!` so it fits the row's height without enlarging it.

Canvas-wide search is separate from a PDF's in-preview search: it finds and opens nodes, and never injects its query into a PDF preview, builds its page index, or navigates inside a document.

## Don't

Don't add a search button, don't hide the count while typing (a stale count is better than a jumping layout), and don't let this field drive an in-document search.
