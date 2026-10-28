A single tool call: its input, its result, and whether it worked.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/ToolCallCard.tsx` and `ToolKindIcon.tsx`.

## What the consumer provides

The tool name and kind, the arguments, the result or error, and any follow-up link.

## Rules

The collapsed row is an `AssistantDisclosure`; everything below sits in its border-indented thread. Input and output are both `xs` mono blocks on `bg-default` at `rounded-sm px-2 py-1`, with `whitespace-pre-wrap` and `overflow-x-auto` so a long JSON line scrolls inside the block instead of widening the panel.

Status lives in the 12px glyph, never in the block's background: `info` while running or done, `danger` on failure, `fg-muted/60` when skipped. Tinting a whole output block would make a normal failure look like a system error, and tool failures are ordinary.

A result the person can act on gets an `info` underlined `xs` link. Secondary detail — counts, paths, durations — is `fg-subtle` `xs`.

`ToolKindIcon` maps the tool kind to its glyph in one place, so read, write, search, command and canvas tools are recognisable across every card that mentions them.

## Don't

Don't hide a failed call, don't put the error in a `Toast`, and don't give the output block a tone — the glyph carries it.
