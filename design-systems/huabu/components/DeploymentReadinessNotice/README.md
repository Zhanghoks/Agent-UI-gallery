The notice that this build is missing configuration the screen needs.

Hand-written from `apps/web/src/components/Settings/DeploymentReadinessNotice.tsx`.

## What the consumer provides

The readiness problem and what to do about it.

## Rules

1px `warning` over `warning-bg` with `warning` text: `rounded-lg px-3 py-2 text-xs mb-4`, a `size-4` glyph nudged `mt-0.5`, and a `space-y-1` body.

It is the one notice in the app rendered entirely in its own tone — border, fill, glyph *and* text. That is allowed here because the notice is about the build's configuration rather than about anything the person did or any data they own, so there is no content for the colour to compete with.

Name the fix concretely, with identifiers in mono: which file to copy, which variable to set. A readiness notice that only states the problem leaves the person in the terminal guessing.

## Don't

Don't use it for a runtime failure (that is a toast or a status row), and don't let it appear on a screen whose settings do not depend on the missing configuration.
