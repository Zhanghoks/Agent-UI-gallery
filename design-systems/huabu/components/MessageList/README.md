The chat transcript: how a conversation with an agent is laid out.

Hand-written from `apps/web/src/components/Messages/MessageList.tsx`.

## What the consumer provides

The message parts in order, and the streaming state.

## Rules

One `space-y-1` column inside a `px-3` scroller that is `overflow-x-visible` — horizontally visible so a node reference or a popover can escape the panel's width without a scrollbar appearing.

Alignment carries the speaker. A user turn is right-aligned and capped at `max-w-[80%]`; everything from the agent is left-aligned and free to use the full width. That asymmetry is the only speaker indicator — there are no name labels.

Tool work collapses. A run of reads, searches and commands becomes a stack of `AssistantDisclosure` rows rather than bubbles, so twenty tool calls stay about one screen tall and the person can still find the sentence that matters.

Spacing is tight on purpose (`gap-1`, not `gap-4`): a transcript beside a canvas competes for vertical space, and the separation comes from alignment and surface, not air.

## Don't

Don't give agent messages a bubble — only the user's turn has a surface. Don't insert date or speaker separators; the panel is one continuous session.
