A recording on the canvas — playable, scrubbable, and recordable in place.

Hand-written from `apps/web/src/components/Nodes/audio/AudioNode.tsx` and the `audio-live-bars` rule in `apps/web/src/index.css`.

## What the consumer provides

The audio source or the live recording stream, and the node geometry.

## Rules

Transport is a 32px `bg-inverse` disc with an `fg-inverse` glyph at `fill-current`, hovering to 80% — the same solid-neutral treatment a primary button uses, because it is the one action on the node.

The waveform *is* the scrubber: bars are painted `fg-default` up to the playhead and `edge-default` after it, so position needs no separate track. Elapsed time is 11px `tabular-nums` in `fg-muted`, which keeps the row from reflowing every tenth of a second.

Recording swaps the play disc for a stop button — transparent, with a 2px `danger` border at 60% and a `danger` square, scaling 1.05× on hover — and the static waveform for the Voice Memos-style equalizer: `audio-live-bar`, 900ms `ease-in-out`, height 25% ↔ 90%, staggered per bar. The recorder is `danger`-coloured throughout, because it is the one node state that consumes something outside the canvas.

Every interactive part carries `nodrag`, or dragging the scrubber would pan the node.

## Don't

Don't show a separate progress bar under the waveform, and don't leave a recording node in the recording state after focus leaves — stop it and keep what was captured.
