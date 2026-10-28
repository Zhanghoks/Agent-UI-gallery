The building block of every settings screen: a titled group of divided rows.

Hand-written from `apps/web/src/components/Settings/Common/SettingSection.tsx`, `SettingRow.tsx`, `SettingLabel.tsx`, `SettingControl.tsx` and `SettingSubGroup.tsx`.

## What the consumer provides

The section title, and the rows — each a label, an optional description, an optional leading element, and a control.

## Rules

The header is an `xs medium fg-muted` ghost row at `mb-1.5 px-1` whose chevron rotates `-90°` when collapsed; a non-collapsible section is the same text without the button.

The group is `bg-surface` at `rounded-md` with `divide-y divide-edge-default`, `overflow-hidden`, `shadow-sm` and a **`ring-1` in `edge-default` at 50%** rather than a border. The ring matters: a border would sit inside the rounded corner and the `divide-y` lines would stop short of the edge, leaving visible nicks at every divider.

Rows are `px-3` with two densities — `py-2.5` normally, `py-1.5` compact — and lay out as label group on the left, control on the right, at `gap-3`. A row with a description puts it under the title in `fg-subtle` at `xs`; `SettingLabel` renders the secondary part in `fg-subtle font-normal`.

A row whose label is a `<label>` for its control is `cursor-pointer`, so clicking the text toggles the switch.

## Don't

Don't use a border on the group, don't nest sections more than one level (that is `SettingSubGroup`), and don't put a control that needs its own explanation in a compact row.
