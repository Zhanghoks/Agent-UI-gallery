The shared frame for the layers, chat and preview panels — including what a panel looks like collapsed.

Hand-written from `apps/web/src/components/Panels/SidebarPanel.tsx`.

## What the consumer provides

The title, the header actions, the body, and the collapsed state.

## Rules

A `bg-surface` column at full height. Two header densities: `h-12 px-3` with a 1px `edge-default` bottom border, or `h-9 px-2` and **borderless** in compact mode. Dropping the border in compact is deliberate — a 36px header with a rule under it reads as a toolbar, and a panel should read as a panel.

The title is `sm semibold fg-muted`, truncated with its full text in a `title` attribute plus an `sr-only` copy, so a truncated panel name is still announced in full.

Collapsed, the panel becomes a `pt-3` rail: an icon button and the title set in `writing-mode: vertical-rl` with `text-orientation: mixed`, which keeps Latin and CJK labels both readable rotated. The rail is the same `bg-surface`, so collapsing changes the width and nothing else.

## Don't

Don't let a panel set its own surface or header height, and don't hide the title when collapsed — the vertical label is what makes a collapsed rail navigable.
