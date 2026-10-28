Huabu is an infinite canvas where a person and their agents think together. Everything in this system serves that one surface: the canvas is the product, and the chrome around it stays quiet so the materials on it can be loud.

## Principles

Let the canvas be the ground and the content be the figure. `bg-default` is the whole app's ground — the window, the canvas, the gaps between panels — and `bg-surface` is only for things that sit *on* it: node cards, panels, popovers, the toolbar. Never introduce a third neutral surface.

Keep chrome self-effacing. Scrollbars are invisible until the pointer enters their 8px lane. The floating toolbar carries `shadow-bottom` and no border. Buttons are `ghost` by default and `solid` only where an action is the point of the screen. If a control is not being used, it should be nearly impossible to notice.

Reserve `info` for interaction, never for decoration. Selection outlines, snap guides, a selected edge, a focused input border, an active shortcut badge — all `info`. A blue thing on the canvas means *the system is pointing at this right now*.

Reserve `ai` for provenance. The muted lavender marks what an agent authored or changed, and nothing else. It is deliberately the quietest accent in the system: agent work should be legible as agent work without shouting over the person's own material.

One token drives three visuals. A node's `style.accent` is a single palette token, and the border, fill tint and text tint are all derived from it by `getAccentTokens`. Never let a node carry independent border, background and text colours — the AI and the UI would drift apart.

Store tokens, not colours. Canvas data persists the accent *token* (`purple`, `amber`), never a hex. Re-skinning means changing one `value` in `ACCENT_PALETTE` and every saved canvas follows. The `amber` token is presented to users as "Yellow" — keep the token, change only the label.

## Content fundamentals

Write labels in sentence case, as short noun phrases: `Note`, `Text`, `PDF`, `Website`, `Frame`, `Space Preview`, `Sketch`, `Agent Node`. Say "Space" for a canvas and "Home" for the local folder the user picks. Placeholders are quiet invitations — `Type...` in a text node, `Ask a question…` in an agent node, `Add label` on an empty edge. No emoji anywhere in the interface.

Address the person as "you" and never as "we"; say what a thing does rather than what the product offers. Product voice is plain and declarative: "Where you and your agents think together." "Bring scattered information together." Avoid exclamation marks and avoid describing agent output as certain.

## Visual foundations

### Colour

Text uses exactly three weights: `fg-default` for what must be read, `fg-muted` for what supports it, `fg-subtle` for what can be ignored. Solid neutral fills use `bg-inverse` with `fg-inverse` on top.

Status colours come in a four-part set each — `info`, `success`, `warning`, `danger` — and every part has a job: the bare token for text, borders, badges and solid fills; `-light` for glows and dashed secondary marks; `-bg` for a tinted surface; `-bg-hover` for a control sitting on that surface. A status surface pairs the soft `-bg` fill with a 1px border in the full token, so the whole thing reads as one hue from across the canvas.

Status colours never double as accents. `accent-red` is a colour a person chose for a note; `danger` means something is wrong.

### The accent palette

Nine tokens — `accent-white`, `accent-grey`, `accent-teal`, `accent-blue`, `accent-green`, `accent-amber`, `accent-orange`, `accent-red`, `accent-purple` — plus a true `ink-black` that exists only for sketch strokes, and a "No accent" sentinel that renders the node transparent so the canvas shows through. The palette is theme-independent on purpose: a yellow note stays the same yellow in dark mode, because the person chose it.

Derive every accent surface with the mix ratios in the Opacity section rather than hand-picking tints: fill is 10% accent over `bg-surface`, text is 60% accent into `fg-default`, the node border is 75% accent, and an edge uses the raw accent at full strength. A white accent is achromatic — skip the text mix and use `fg-default`, or the label turns mid-grey.

### Type

There are no font files. Every family is a system stack, so text renders natively on macOS and Windows: `sans` for the entire interface, `serif`, `mono` and `hand` as per-node choices a person can make, and `agent` — Comic Sans falling back to STXingkai and KaiTi — reserved for the agent node's handwritten sticky voice. That last stack is the one deliberately unfashionable thing in the system: an agent's question should look handwritten, and it should look handwritten in Chinese too.

Interface text lives at `sm` almost everywhere, with `xs` for node chrome and `base` for dialog copy. Use `sm-medium` for button labels. Node body text is not on a scale at all: it is auto-fitted to the node box at a fixed `1.5` line-height, so a note re-fits its own type when it is resized.

### Zoom is a design layer

The canvas spans `zoom-min` 0.05 to `zoom-max` 5, and what a node shows depends on how big it is *on screen*, not on how much content it holds. Below `lod-threshold` (150px screen width, with `lod-hysteresis` so it cannot flicker) a note, PDF or web node drops its body and shows just its title, cross-fading over `lod-fade`.

A minimal label's size expresses hierarchy, never content length: pick `lod-32`, `lod-52` or `lod-76` from the node's representative canvas size — the geometric mean of width and height — so two nodes of the same size always show the same type, and a bigger node reads as more important at the same zoom. Labels wrap at word boundaries up to `lod-max-lines`, then ellipsize; they never keep shrinking to fit.

Structural geometry stays in canvas space and scales with the viewport. Interaction chrome — selection outlines, frame labels, toolbars, resize handles — is screen-space and keeps its physical size, because a handle you cannot hit is not a handle.

### Borders, not shadows

`border-hairline` in `edge-default` separates things; shadows only lift things that float. A node card carries a transparent `border-node` at rest, its accent border when it has one, `elevation-hover` on hover and while editing, and `elevation-drag` while it moves. `shadow-bottom` belongs to chrome that hovers over the canvas.

Selection is drawn on a screen-space layer above every node, not as a ring on the node itself — clicking a node must never change its z-order. The outline is a 1px `info` line with a soft `info-light` glow; a sketch's outline is drawn at half opacity because its bounding box is mostly empty.

### Spacing and shape

`grid` is 18px and it is the only spatial constant that matters: the dot background, React Flow's snap step and every programmatic layout read the same number, so a node placed by an agent lands exactly on the grid a person sees. A frame's padding is derived, not fixed — 10% of the median child extent, floored at `frame-padding-min` — so padding grows with content and a uniform resize keeps the frame body flush with the drag rect.

Radii step by role: `radius-sm` for chips and badges, `radius-md` for controls, `radius-lg` for node cards and the toolbar, `radius-xl` for toasts, `radius-full` for pills and swatches.

### Motion

Motion is short and explanatory: 120ms for LOD cross-fades and node state, 140ms for structured-frame reflow, 200ms for a frame resize and the agent card's takeover fade, 220ms for panel slides. The two easings in use are `ease-out` for state changes and `cubic-bezier(0.4, 0, 0.2, 1)` for layout travel. Nothing loops except the deliberate waiting signals — the thinking shimmer, skeleton bars and the recording equalizer. Every transition has a `prefers-reduced-motion: reduce` escape, and geometry is never animated while a gesture is driving it.

### Iconography

Icons are [Lucide](https://lucide.dev) React components at `[&_svg]` sizes 13px / 16px / 20px for small / medium / large controls, and 14px in node chrome. Node types map to icons in exactly one place, `config/nodeIcons.ts`; change it there and the canvas card, the layers sidebar and the breadcrumb all follow. The current map: Note `Clipboard`, Text `Type`, Image `Image`, PDF `BookOpen`, Office `FileType2` (or `FileText` / `Sheet` / `Presentation` per format), Video `Film`, Audio `Mic`, Website `Globe`, Frame `Frame`, Space Preview `PanelsTopLeft`, Sketch `Pencil`, Agent Node `MessageCircleQuestionMark`. No emoji, no custom glyph set.

## Accessibility notes from the source

These pairs are the repository's own colours and are kept exactly as they are; they are listed so a consumer knows where to add a border or raise a size rather than assuming the palette is safe.

In the light theme the status colours are 3.0:1 to 4.3:1 on `bg-surface` (`info` 3.2, `success` 3.3, `warning` 3.1, `danger` 4.3) and a little lower on their own `-bg` surfaces. They meet the 3:1 floor for borders, icons and large text but not the 4.5:1 floor for body text, and `fg-inverse` on a solid status fill sits at the same ratios. Use them for badges, borders, icons and headings; for a sentence of status prose, prefer `fg-default` with the status colour carrying the badge — which is what `Toast` does. The dark theme's status colours are all 5.2:1 or better, so this only affects light.

`fg-subtle` is 4.54:1 on `bg-surface` but 4.17:1 on `bg-default`, and 3.3:1 on `bg-surface` in dark. Treat it as a large-text and non-text colour; body copy that must be read uses `fg-muted` (7.3:1 or better everywhere).

`question-fg` on `question-bg` is 2.5:1 in light and 1.9:1 in dark. The agent node's handwritten body is the one place the system knowingly misses the text floor, in both themes, and dark is the worse of the two. Anything a reader must not miss belongs in the agent node's chrome rather than its body.

`edge-default` is 1.25:1 on `bg-surface` and `canvas-grid` is 1.47:1 on `bg-default`. Both are intentionally sub-threshold — they are texture, not information. Never let a border in `edge-default` be the only thing conveying state; that is what the `info` selection outline is for.

## Not synced

No fonts: every family is a system stack, so `type.fonts` is empty and there is nothing to fetch.

Three values in `index.css` are `color-mix()` expressions and cannot be static tokens, so they are documented here instead of in `tokens.json`: `--pdf-selection-bg` (12% `info` over transparent), `--pdf-highlight-bg` (45% `warning-light` over transparent, diluted to 45% of itself again inside the pdf.js text layer), and the live-lasso preview ring (1px `info` plus a 3px halo at 18% `info`). The selection glow `0 0 6px 0 var(--color-info-light)` is likewise a `var()`-based shadow and lives in the Shadows note.

Components were not built from the repository: no build was run and no bundle is shipped, so every preview here is a hand-written static rendition of the component's real classes and tokens, and each component's page names the source files it was written from. That is the honest limit of this system — the previews are faithful to the code, but they are not the code, and a change in `apps/web` will not update them.

The inventory is the whole of `apps/web/src/components`, reverse-engineered into 110 cards in eight groups: Canvas (the surface, node shell, accent palette, overlays, connection affordances and every floating toolbar), Nodes (all twelve node types plus the shared preview card, banners and agent marks), Controls (the full `Common` set), Chat (the transcript, every message and tool card, the composer and change review), Agents (icons, pickers, selectors, connection and context readouts), Panels (header, sidebar frame, layers tree and its filters and search, expanded node panel, preview tabs, window chrome, shortcut sheet), Settings (section and row primitives, credentials, health and readiness notices, the profile editor) and Editors (the Milkdown skin, its floating toolbar, and the CodeMirror markdown theme).

Deliberately not given cards: contexts, providers, hooks and bridges (`PreviewSearchAdapterContext`, `NativeMenuBridge`, `GlobalModals`, `canvasInputPolicy`, `pointerRouter` and the rest of `handler/`), and the settings *screens* (`GeneralSettings`, `LLMSettings`, `ImageProviderSettings`, `IntegrationsSettings`, `AgentTeamConfigs`, `ExternalAgentsSettings`) — those are compositions of `SettingSection` and add no new visual rules. `SketchIcon`, `SketchControls`, `SketchPreview`, `SketchModeSwitcher`, `SketchSizePicker`, `SketchColorPresetPicker` and `SketchPresetPicker` are documented together under SketchSettingsPanel; `QuestionAgentBubble` and `QuestionTakeoverMark` under AgentMark; `AgentAvatarMark` and `BuiltInAgentAvatar` under AgentIcon; `SnapGuidesOverlay`, `SelectionOutlines` and `StrokeSelectionRegion` under CanvasSurface and its toolbars.

Ask if you want a real `bundle.js` built from `apps/web` — that would make these previews live React rather than renditions.
