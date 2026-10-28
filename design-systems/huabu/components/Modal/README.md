A focused decision that has to interrupt: move a selection, confirm a destructive action, show the shortcut sheet.

Hand-written from `apps/web/src/components/Common/Modal.tsx`.

## What the consumer provides

`title`, `description`, the body, a `footer`, and the open/close state. `aria-labelledby` and `aria-describedby` are wired to the title and description automatically.

## Rules

The ground is `bg-default` at 80% with `backdrop-blur-sm`, fading in over 200ms; a click on it closes. The panel is `w-96` capped at `calc(100vw - 3rem)`, `bg-surface`, 1px `edge-default`, `radius-lg`, `shadow-bottom`, `p-6`, entering with `zoom-in-95` over the same 200ms.

The title is `text-md font-semibold` in `fg-default`, the description `text-sm` in `fg-muted` with `mt-1` — or no top margin when there is no title. The footer is right-aligned at `gap-2` with `mt-5`, and holds exactly one `solid` button.

`role="dialog"`, `aria-modal`, and `tabIndex={-1}` on the panel so focus can move into it.

## Don't

Don't put a form longer than the viewport in a modal — that is a settings section or a panel. Don't stack modals, and don't use one for a message: a message is a `Toast`.
