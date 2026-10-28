An open question living on the canvas as a handwritten sticky note, with an agent working on it.

Hand-written from `apps/web/src/components/Nodes/question/QuestionNode.css`, `QuestionAgentBadge.css`, `NodeTakeoverLayer.tsx` and `apps/web/src/utils/node/nodeFontConfig.ts`. Internally the type is `question`; users see "Agent Node".

## What the consumer provides

The question text, the assigned agent (or none), the run status, and the node geometry. The card supplies its own fill, so it overrides the node shell's accent border to transparent.

## Why it looks different from every other node

Every other node is a neutral or accent-tinted card in the interface font. This one is a paper sticky in `question-bg` with a `question-border` board offset `agent-depth-offset` (8px) down and to the right behind it at `z-index: -1`, and its text is set in the `agent` family — Comic Sans falling back to STXingkai, KaiTi and Kaiti SC. That fallback chain is the point: a question should read as handwritten in Chinese as well as in English. Do not "fix" this to the sans stack; the difference is what makes an unanswered question findable at a glance on a crowded canvas.

Padding is `agent-node-padding` on all four sides, the body is auto-fitted at `1.5` line-height, and the placeholder is `Ask a question…`. The card must overflow visibly — its status badge and progress bar sit outside the box.

## Zoom behaviour

The agent node deliberately opts out of the binary LOD boundary the other heavy nodes use. Instead it uses a continuous takeover driven by its representative size: the agent mark slides from the corner toward the node centre while the card — background, border, depth board and content together — fades as one binary step over 200ms once the node leaves the readable band. The depth board's opacity transition is delayed 200ms on the way in and zero on the way out, so the board never lingers as a bare yellow rectangle behind a faded card.

The mark lives in a separate screen-space portal, so it is not faded with the card and stays legible at any zoom. Keep pointer events on the invisible footprint: the node must still be selectable, and a double-click on the faded body routes to the same activate handler as the mark.

## Contrast

`question-fg` on `question-bg` is 2.53:1 in the light theme and 1.92:1 in dark. These are the source's own colours and they stay exact, but it means the sticky body is decorative-legible, not accessible body text. Anything a reader must not miss — status, errors, the agent's identity — belongs in the badge, the bar or the surrounding chrome, where `fg-default` and the status tokens apply.

## Don't

Don't give it an accent border, don't put it on the standard LOD ladder, and don't use `question-*` tokens anywhere else — they name this one node.
