A title that looks like text until you click it, used for the Space name, a node title and a frame label.

Hand-written from `apps/web/src/components/Common/InlineEditableTitle.tsx`.

## What the consumer provides

The `title`, a `placeholder`, an `ariaLabel`, a `width` (`auto` or `fill`), and an `editor` object — `draft`, `maxLength`, `onChange`, `onCommit`, `onCancel`, `onStart`, `disabled`. Pass no `editor` at all and it renders as plain truncated text, which is how a read-only Space shows its name.

## Rules

All three states share one `TITLE_STYLE`, so the text does not move when it becomes editable. Resting is a ghost `Button` with a `text` cursor — the cursor is the affordance — in `fg-muted`, hovering to `fg-default`. Editing is a `md` `TextInput` with a visible `edge-default` border, `w-64` or flexing to fill. It always truncates rather than wrapping.

Enter commits, Escape cancels, blur commits. Key events stop propagating so canvas shortcuts do not fire while typing, and an in-progress IME composition is never treated as Enter — a title typed in Chinese would otherwise commit halfway through a character.

## Don't

Don't show a pencil icon, and don't change the text's size or weight between resting and editing — the whole point is that the title stays put.
