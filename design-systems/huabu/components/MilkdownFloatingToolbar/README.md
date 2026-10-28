The formatting bar that appears over a text selection in the editor.

Hand-written from `apps/web/src/components/Milkdown/MilkdownFloatingToolbar.tsx` and `MilkdownLinkPopover.tsx`.

## What the consumer provides

The editor selection and the command handlers.

## Rules

Toolbar chrome, with one difference from the canvas toolbars: `w-fit max-w-full flex-wrap`. It sits over text inside a panel or a node, so it wraps to a second row rather than pushing its container wider.

Format buttons are `h-4 w-4` `rounded-sm` glyphs at `sm semibold leading-none` — the tightest buttons in the system, because bold, italic, strike and code are single characters and a gap between them reads as separate controls. The block selector is a ghost `Button` at `gap-1` with a 14px glyph and the block's label.

Highlight swatches are `h-4 w-4` `rounded-sm` with a 1px `edge-default` border, and the highlight they apply is 25% accent — `accent-highlight-mix`, the same ratio a node uses for an inline highlight, so text highlighted in a note and in the editor match.

A link opens `MilkdownLinkPopover` out of this bar, in `FLOATING_TOOLBAR_POPOVER_CLASS`, with the URL in a mono `TextInput`.

## Don't

Don't let the bar exceed its container's width, don't use round swatches here (the canvas accent picker is round; text highlights are square), and don't put block and inline commands in the same group.
