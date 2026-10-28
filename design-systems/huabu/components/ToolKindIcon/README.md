The glyph for each kind of tool work.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/ToolKindIcon.tsx`.

## What the consumer provides

The tool kind and a size.

## Rules

Line-only glyphs taking `currentColor`, so the row tints them from its own text colour and a status colour is applied by the card rather than baked into the icon. That separation is what lets the same glyph appear in `fg-muted` on a disclosure row and in `danger` on a failed call.

One map in one place. Every surface that mentions a tool call — `AssistantDisclosure`, `ToolCallCard`, `MergedAgentToolRow`, `SpaceCommandCard` — resolves its glyph here, so the same kind of work always looks the same, exactly as `nodeIcons.ts` does for node types.

## Don't

Don't fill a kind icon, don't give a kind its own colour, and don't add a kind here without adding it to the map — a missing kind should fall back visibly, not silently.
