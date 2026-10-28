Watch an agent's screen: open it, teach it a task, record.

## When to use

- Variants: `Working` and `Loading`.
- The consumer supplies `streamSrc` (a frame or stream of the agent's desktop) and `agentName`. The preview uses the repository's `agent-desktop.webp` from the Images group.

## Props

```ts
{ agentName, streamSrc, variant, }?: {
    agentName?: string;
    streamSrc?: string;
    variant?: string;
}
```

Full types: `components/AgentScreen/AgentScreen.d.ts`. Source: `components/primitives/AgentScreen.tsx` in slev12397/beautiful-ui.
