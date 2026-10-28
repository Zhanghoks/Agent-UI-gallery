The glyph for each agent mode — chat, plan, edit.

Hand-written from `apps/web/src/components/Panels/ChatPanel/ModeIcon.tsx`.

## What the consumer provides

Nothing but a size and a class; each mode has its own exported component.

## Rules

All three share one `SVG_PROPS` object — same viewBox, stroke width, linecap and linejoin — which is the only reason three separately drawn glyphs read as one set. Add a fourth mode by adding to that object's consumers, not by drawing something with its own weight.

They are line-only and take `currentColor`, so a mode selector, a message header and a menu row each tint them from their own text colour. Never give a mode icon a fixed colour: mode is not a status, and the same glyph appears on `bg-surface`, in `fg-muted` rows and on a solid pill.

## Don't

Don't fill them, don't pair a mode with a status colour, and don't use a mode glyph for anything other than the mode.
