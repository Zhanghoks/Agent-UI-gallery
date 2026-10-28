An agent's face, and the animation that says it is working.

Hand-written from `apps/web/src/components/Common/AgentIcon.tsx`, `AgentIcon.css`, `AgentAvatarMark.tsx` and `BuiltInAgentAvatar.tsx`.

## What the consumer provides

The agent profile (which selects the icon or supplies an initial and a colour) and whether it is currently working.

## Rules

The working state is a **windmill, not a spinner**: `agent-icon-working-body` rotates 360° over 3s linear while `agent-icon-working-avatar` keeps the face still, both using `transform-box: fill-box` with a centre origin. The face staying upright is the whole idea — a working agent still looks at you — and rotating the entire icon would read as a loading state rather than as work.

Both animations stop under `prefers-reduced-motion: reduce`, with no replacement: the agent is still identifiable, and its status is also carried in text elsewhere.

`AgentAvatarMark` is the fallback for an agent with no icon: an initial on a `radius-full` disc in the agent's own colour, ringed in whatever surface sits behind it so it reads on the canvas, in a list and on a sticky note. `BuiltInAgentAvatar` covers the agents that ship with the app.

## Don't

Don't spin the whole icon, don't tint the face, and don't use the agent's colour as a UI accent anywhere else — it identifies that agent.
