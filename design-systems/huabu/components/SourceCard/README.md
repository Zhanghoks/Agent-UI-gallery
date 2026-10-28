A web source the agent used, cited in the transcript.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/SourceCard.tsx`.

## What the consumer provides

The URL, title, domain, favicon and an optional snippet.

## Rules

A `group`-hovered row at `px-4` with `items-start gap-2`: a 16px `rounded-sm` favicon nudged `mt-0.5` onto the first line of text, then the title in `xs` medium `fg-muted` and truncated, the domain beside it, and an optional snippet below at two lines.

The whole row is the link, and the hover affordance is a `bg-hover` fill rather than a border or an underline — a list of five sources with five borders reads as five cards, which they are not.

The title is `fg-muted`, not `fg-default`: a citation supports the answer rather than being it.

## Don't

Don't show the raw URL, don't open a source in the app's own preview unless the person asked for a web node, and don't let the snippet run past two lines.
