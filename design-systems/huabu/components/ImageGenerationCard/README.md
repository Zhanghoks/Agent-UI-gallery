An image an agent generated, with the prompt that produced it.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/ImageGenerationCard.tsx`.

## What the consumer provides

The prompt, the generation state, and the resulting image.

## Rules

While it runs, a fixed `h-32 w-48` `bg-default` box with a 1px `edge-default` border holds the space and shows an `fg-muted` glyph. Reserving the box matters here more than elsewhere: generation takes seconds, and a transcript that jumps when the image lands loses the person's place.

The result is `max-h-64 max-w-full object-contain` in a 1px `edge-default` frame, inside a `w-fit` wrapper so the frame hugs the image rather than the column width.

The prompt is shown as `xs` mono, like any other tool input — the person should be able to see what was asked for and judge the result against it.

## Don't

Don't let the image exceed `max-h-64` in the transcript; a full-size image belongs on the canvas as an image node. Don't drop the prompt once the image arrives.
