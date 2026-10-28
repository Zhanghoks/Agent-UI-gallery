Pill-shaped action button with six variants and three sizes. The app's core button.

## When to use

- `primary` (ink fill, canvas label) is the one filled action per surface; `accent` for an agent-confirm action; `secondary` (surface + `shadow-btn`) for alternatives; `ghost` and `quiet` for toolbars; `success` for approve.
- Sizes: `xs` (28px, 12px text) for dense toolbars, `sm` (27px, 13px) the canonical action pill, `md` (14px text, 9px vertical padding) for primary form actions.
- Scales to 0.96 on press; disabled drops to 50% opacity.
- The consumer supplies the label as `children`, plus any native button props.
- White labels on `accent` and `success` are the source's choice and sit near 3.6:1 in light; keep those labels short and bold enough to read.

## Props

```ts
{ variant, size, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "accent" | "success" | "quiet"; size?: "xs" | "sm" | "md" }
```

Full types: `components/Button/Button.d.ts`. Source: `components/atoms/Button.tsx` in slev12397/beautiful-ui.
