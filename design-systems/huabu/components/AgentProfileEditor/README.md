The form for adding or editing an agent in your team.

Hand-written from `apps/web/src/components/Settings/agent-team/AgentProfileEditor.tsx`, `CommandProfileForm.tsx`, `ManifestProfileForm.tsx`, `ProfileEditFields.tsx`, `ProfileEditActions.tsx` and `ProfileFormFooter.tsx`.

## What the consumer provides

The profile being edited, its kind (a command or a manifest), and the save and cancel handlers.

## Rules

One `flex-col` form in a fixed order, and the order is the design: a `TabGroup` choosing the profile kind, then the fields, then a `px-3 pb-2.5 text-[11px] leading-snug` `fg-subtle` help line, then a `px-3 py-2.5 text-xs` `warning` `role="status"` line for anything unverified, then a right-aligned `gap-2` footer from `ProfileFormFooter`. Explain, then warn, then commit — never a warning the person meets only after saving.

Commands and paths are mono; anything the screen cannot change is a `ReadOnlyField` rather than a disabled input. The icon field is the `AgentIconPicker`, so the face is chosen where the agent is defined.

Say plainly that the command runs on the person's computer and that Huabu installs nothing for it. An agent profile is an execution contract, and the form is where that is disclosed.

## Don't

Don't validate by turning fields red as the person types a path, don't hide the warning line once shown, and don't let the footer's save button be the first place a problem is mentioned.
