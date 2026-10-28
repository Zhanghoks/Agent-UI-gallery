Collapsible workspace and chat navigation with gliding hover states.

## When to use

- Workspace switcher, primary navigation, searchable chat history, and a collapse to a 52px rail that keeps icons aligned.
- Consumer supplies `recents` and workspace data.

## Differs from the source

The source draws its icons from Central Icons, a paid library that needs a licence key. This bundle substitutes the closest open-source Iconoir glyphs (home, search, plus, settings, user-plus, sidebar-collapse, and so on), so the preview's icons are stand-ins, not the originals.

## Props

```ts
{ activeTitle, className, fill, onNewChat, onPick, activeNav, onNavigate, footerLabel, footerIcon, onFooterClick, recents, }: SidebarNavProps
```

Full types: `components/SidebarNav/SidebarNav.d.ts`. Source: `components/primitives/SidebarNav.tsx` in slev12397/beautiful-ui.
