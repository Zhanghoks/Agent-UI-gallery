The tab strip over the preview workspace.

Hand-written from `apps/web/src/components/Panels/PreviewWorkspace/PreviewTab.tsx`, `PreviewTabStrip.tsx`, `PreviewGroup.tsx` and `PreviewWorkspace.tsx`.

## What the consumer provides

The open tabs, the active one, and the activate, close and reorder handlers.

## Rules

Tabs are `h-9 min-w-20 max-w-48` with `gap-1.5 px-2.5 text-sm`, a 14px node-type glyph and a truncating title. The strip sits on `bg-default` and the active tab takes `bg-surface` — the same figure-on-ground relationship the whole app uses, so the active tab reads as the panel's front edge.

A **transient** tab — one opened by a single click, replaced by the next single click — is set in *italic*. That is the convention code editors use for a preview tab, and it is the only place italics carry meaning in this system.

The drag overlay is the tab itself with a 1px `edge-default` border and `elevation-drag`, so what is being dragged is literally the thing, lifted.

Glyph and title stay `fg-subtle` until `group-hover`, then move to `fg-muted`, with the transition on colour only.

## Don't

Don't let a tab grow past `max-w-48`, don't show a close button only on hover (it shifts the title), and don't use italics for anything other than a transient tab.
