The device-code step of an OAuth sign-in: a code to type somewhere else.

Hand-written from `apps/web/src/components/Settings/sections/OAuthDeviceCodePrompt.tsx`.

## What the consumer provides

The verification URL, the user code, and the pending state.

## Rules

The code is the largest type on the screen — mono, wide tracking, `fg-default`, on `bg-default` inside a hairline box, and `select-all`. Everything about it assumes the person is reading it aloud or typing it on a phone: tracking so characters do not run together, mono so `0` and `O` differ, select-all so one click copies it.

The verification URL is quoted in mono too, because it is something to type rather than a link to follow.

Waiting is an inline `Loading` with a plain `fg-subtle` line. This step routinely takes a minute, so it must not look like a failure; there is no timeout styling and no `warning`.

## Don't

Don't hyphenate or reformat the code beyond what the provider returned, don't auto-advance on a guess, and don't put a spinner where the code should be.
