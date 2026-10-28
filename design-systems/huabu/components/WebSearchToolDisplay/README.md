A web search the agent ran: the query it actually sent, then its results.

Hand-written from `apps/web/src/components/Messages/AIMessage/Tool/WebSearchToolDisplay.tsx`.

## What the consumer provides

The query string and the results.

## Rules

The query echoes back verbatim in a bordered `xs` block on `bg-surface` at `rounded-md px-2 py-1` with `whitespace-pre-wrap`. Showing the literal query rather than a paraphrase is the point: a bad answer is often a bad search, and the person can only see that if the search is quoted.

Results are a `space-y-2` column of `SourceCard`s behind a `w-full justify-start px-2 py-0.5` ghost toggle — full width and left-aligned, so the toggle reads as a row in the transcript rather than a button floating in it.

## Don't

Don't summarise the query, don't show more than a handful of results expanded, and don't reformat a result's title — the source's own words are the citation.
