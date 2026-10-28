The quick-settings popover, for the handful of settings that change what is on screen.

Hand-written from `apps/web/src/components/Settings/SettingsPopover.tsx`.

## What the consumer provides

The subset of settings to expose, and the trigger.

## Rules

A `Popover` carrying the same section headers and row rhythm as the settings modal, at popover density — so a setting changed here and the same setting in the modal are recognisably one control rather than two implementations.

It holds only settings that affect what is on screen right now: snapping, the grid, pointer mode. Anything a person configures once — providers, keys, agent teams — belongs in the modal.

It ends with one `info` row into the full settings modal, which is what keeps the popover from growing: there is always somewhere else to put a setting.

## Don't

Don't duplicate a whole settings section here, don't put a destructive or irreversible setting in a popover, and don't let it scroll — if it needs scrolling, it should be the modal.
