The marker that says a frame's contents are instructions an agent reads, not just material.

Hand-written from `apps/web/src/components/Nodes/frame/InstructionFrameBadge.tsx`.

## What the consumer provides

Whether the frame is currently acting as instructions.

## Rules

A `size-2.5` dot plus a short label, on the frame's label line rather than inside its body — a frame's body belongs to its children.

Active takes `ai`, because an instruction frame is agent context and the AI colour is what marks agent involvement everywhere else in the app. It is deliberately not a status colour: nothing is wrong or right about a frame being instructions.

Inactive drops to `fg-subtle` with a hollow dot, so a frame that is not being read looks like any other frame. The badge always says which state it is in; an absent badge would be ambiguous with a frame that was never an instruction frame.

## Don't

Don't use `info` or `warning` here, and don't put the badge inside the frame where it would be mistaken for a child node.
