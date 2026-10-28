The control that picks which agent the chat is talking to.

Hand-written from `apps/web/src/components/Panels/ChatPanel/AgentSelector.tsx` and `agentMenu.tsx`.

## What the consumer provides

The available agent profiles and the current selection.

## Rules

It is a `Select` with a pill trigger: the agent's mark, its name, a chevron. Using the shared `Select` is what gives it group headers, descriptions, the fixed check lane and the footer slot for free.

Options are grouped by where the agent came from — built-in versus the person's own team — because that is the distinction that matters when something misbehaves. An external agent shows its manifest path as the `xs` `fg-muted` description, so two agents with the same name are still tellable apart.

The footer opens agent settings. That is why the list never needs a row explaining how to add an agent.

## Don't

Don't show an agent's colour as a status — it identifies the agent. Don't hide an unreachable agent from the list; show it and let `AcpConnectionBadge` say it is down.
