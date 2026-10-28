A command an agent ran, with whatever it printed.

Hand-written from `apps/web/src/components/Common/CommandBlock.tsx`.

## What the consumer provides

The command string and, optionally, its output.

## Rules

Mono `xs` throughout, in a 1px `edge-default` box with a `bg-default` fill and `rounded` corners, capped at `max-h-48` and scrolling — a chat transcript must not be pushed off screen by a long build log.

The command line is `fg-default` with a `fg-subtle`, `select-none` `$` prompt, so copying the line does not copy the prompt. Output sits below on `bg-surface` in `fg-muted`, separated by a hairline at 60% opacity. Both parts use `whitespace-pre-wrap`: indentation is meaning in a terminal, and horizontal scrolling in a chat panel is not usable.

## Don't

Don't syntax-highlight the command — this is a record of what ran, not an editor. Don't hide the output behind a disclosure when it is a few lines; the scroll cap already bounds it.
