The shape-and-colour picker that gives an agent its face.

Hand-written from `apps/web/src/components/Settings/agent-team/AgentIconPicker.tsx`, `AgentIconField.tsx` and `PersistedAgentIconPicker.tsx`.

## What the consumer provides

The current icon and colour, and the change handler. `PersistedAgentIconPicker` is the same control wired to a saved profile.

## Rules

The trigger is a `rounded-full p-0.5` ghost `Button` with its glyph forced to 20px, showing the agent's current face — so the control is the thing it edits.

The panel is a `w-auto p-2` popover with a `gap-2` column: a 10px uppercase wide-tracked `fg-subtle` section header at `px-0.5`, then a `gap-1` row of options. That header style is the system's standard group label, the same one `Select` uses, so pickers and menus read alike.

Colour swatches reuse the accent palette's behaviour exactly — `border-swatch` in `edge-default`, `info` at 1.1× when selected — because a person who has learned the node palette already knows this control.

## Don't

Don't offer a colour that is not in the palette, and don't preview the choice only in the panel; the trigger updates as the person picks, so the face they will see is the face they are choosing.
