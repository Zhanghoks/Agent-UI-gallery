The title bar Huabu draws itself in the Electron window.

Hand-written from `apps/web/src/components/Shell/WindowChrome.tsx` and `UpdateButton.tsx`.

## What the consumer provides

The window controls' inset, the Space name and path, and the update state.

## Rules

A `shrink-0` `bg-surface` row at `gap-2 px-2`, with `h-7 w-7` `rounded-md` ghost buttons — one size smaller than the app header's, because a title bar is chrome about the window, not the work.

The centre block is `absolute left-1/2 -translate-x-1/2 max-w-[50%]` and **`pointer-events-none`**, with only the name itself `pointer-events-auto`. That is what lets the title sit centred over the whole bar without stealing the draggable region the window needs — a fully interactive centre block makes the window impossible to move by its middle.

The name is `sm medium fg-muted` hovering to `fg-default`, with the folder path in `fg-subtle` beneath it. An available update is an `info` pill, not a toast — it should be visible whenever the person looks up, and never interrupt.

Buttons at the top edge of the window pass `tooltipPlacement="bottom"`, since there is no room above.

## Don't

Don't make the whole centre block clickable, don't put an action in the title bar that belongs in the header, and don't use `warning` for an available update.
