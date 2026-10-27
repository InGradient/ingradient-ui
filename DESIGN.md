# Ingradient UI Design System

This document records the design system already implemented in `src/tokens`, `src/primitives`, `src/components`, `src/patterns`, and `packages/platform-pages`. Sections 3–9 describe the 4px foundation adopted on 2026-10-27; decision numbers (Dn) refer to `docs/reports/2026-10-27-foundations-report.ko.html`. The Platform `0.0.1` stories use the `platformV001` preset: industrial-dark theme, compact density, dark mode, and the default brand.

## 1. Atmosphere & Identity

Ingradient is a compact industrial command surface: dark, quiet, and information-dense without looking crowded. Its signature is the layered workspace shell—near-black canvas, slightly lighter translucent panels, restrained blue interaction color, and image-led working areas that keep controls secondary to inspection content.

## 2. Color

### Palette

All application code uses semantic `--ig-color-*` variables. Foundation values below come from `src/tokens/core/colors.ts`; light mode keeps the same semantic contract.

| Role | Token | Dark | Light | Usage |
|---|---|---:|---:|---|
| Canvas | `--ig-color-bg-canvas` | `#0f1115` | `#ffffff` | Page background |
| Header | `--ig-color-surface-header` | `rgba(12,15,20,.88)` | `rgba(255,255,255,.92)` | Top bars and persistent chrome |
| Panel | `--ig-color-surface-panel` | `rgba(12,15,20,.80)` | `rgba(255,255,255,.85)` | Sidebars and work panels |
| Raised | `--ig-color-surface-raised` | `#10151d` | `#f7f9fb` | Cards, menus, raised controls |
| Interactive | `--ig-color-surface-interactive` | `rgba(255,255,255,.04)` | `rgba(15,18,25,.04)` | Resting interactive surface |
| Text primary | `--ig-color-text-primary` | `#edf2f7` | `#0f1219` | Titles and primary content |
| Text secondary | `--ig-color-text-secondary` | `#d7deea` | `#384155` | Secondary content |
| Text muted | `--ig-color-text-muted` | `#98a2b3` | `#475467` | Metadata and hints |
| Border subtle | `--ig-color-border-subtle` | `rgba(255,255,255,.08)` | `rgba(15,18,25,.08)` | Panel and control boundaries |
| Accent | `--ig-color-accent` | `#4d88ff` | `#214bb8` | Selected, focus, primary actions |
| Accent strong | `--ig-color-accent-strong` | `#2962d9` | `#143fa6` | Pressed and high-emphasis actions |
| Success | `--ig-color-success` | `#35c6a7` | `#1a8f6f` | Success and running states |
| Warning | `--ig-color-warning` | `#ffd179` | `#b8761a` | Warnings and uploading states |
| Danger | `--ig-color-danger` | `#ff9a9a` | `#cc2929` | Destructive and failed states |

Rules:

- Use semantic tokens, including the existing status, chart, annotation, selection, and overlay aliases; do not add raw colors to page code.
- Accent denotes interaction or selection, not decoration.
- The default Platform page contract is dark mode. Light mode must preserve the same hierarchy and AA-oriented text contrast.

> **Status.** The values below are in code (commits `7f71ae2` to `4379689` on `feat/surface-depth`). Remaining migrations are listed under Accepted Debt (§11).

## 3. Typography

### Scale *(D10–D11)*

Sizes keep the dense character of the product (13px and 12px are the most used today) but drop unused or near-duplicate steps. Line heights are fixed pixel values on the 4px grid instead of multipliers, because a multiplier such as 13px × 1.5 = 19.5px falls off the grid.

| Token | Size | Line height | Usage |
|---|---:|---:|---|
| `micro` | 11px | 16px | Dense technical overlays only (badges on images, canvas labels) |
| `caption` | 12px | 16px | Metadata, captions, table secondary text |
| `body-sm` | 13px | 20px | Compact controls, table cells, list rows |
| `body` | 14px | 20px | Default body and control text |
| `title-sm` | 16px | 24px | Section and card titles |
| `title` | 20px | 28px | Page and modal headings |
| `display` | 24px | 32px | Empty-state and authentication headings |

Migration from current tiers: 10→11, 15→16, 18→20, 22 (unused) removed, 28→24.

- Sans: `"IBM Plex Sans", "Segoe UI", sans-serif`. Mono: `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace`.
- Fonts load from the package (D13): `import '@ingradient/ui/fonts'` once at the app root brings IBM Plex Sans and IBM Plex Sans KR (400–700) and IBM Plex Mono (400–600) via `@fontsource`; Korean is split by `unicode-range`. Licensed under SIL OFL 1.1.
- Weights: 400, 500, 600, 700. New code uses the typography tokens or `Text`/heading primitives.

## 4. Spacing *(D1–D4)*

### Scale

All spacing is a multiple of 4px. One optical step of 2px exists for hairline alignment only (icon nudges, focus offsets), never for layout gaps.

| Token | Value |
|---|---:|
| `--ig-spacing-2` | 2px (optical only) |
| `--ig-spacing-4` | 4px |
| `--ig-spacing-8` | 8px |
| `--ig-spacing-12` | 12px |
| `--ig-spacing-16` | 16px |
| `--ig-spacing-20` | 20px |
| `--ig-spacing-24` | 24px |
| `--ig-spacing-32` | 32px |
| `--ig-spacing-40` | 40px |
| `--ig-spacing-48` | 48px |

The token name equals its value. The legacy `--ig-space-*` names now carry the 4px values (mapped as below) and are deprecated; new code uses `--ig-spacing-{px}` or a spacing role.

### Semantic spacing

Components choose a role, not a number:

| Role token | Value | Use |
|---|---:|---|
| `--ig-gap-inline` | 4px | Inside a control: icon ↔ label in small controls, chip padding |
| `--ig-gap-related` | 8px | Between related items: list rows, label ↔ field, buttons in a group |
| `--ig-inset-card` | 16px | Padding inside cards and sections |
| `--ig-gap-section` | 24px | Between sections or cards |
| `--ig-inset-page` | 24px | Page and modal edges |

### Dense workspaces and single-form pages

Workspace screens (Catalog, Class, Dashboard, Settings, Edge) are dense: 32px controls, 8px between related items, 16px card insets. Single-form pages (Login, Signup, Create Project) have one task on an otherwise empty screen and use generous spacing instead:

| Single-form page | Value |
|---|---:|
| Form box inset | 32px |
| Logo → form box, title → first field, sections apart, last field → primary action | 24px |
| Field groups apart | 16px |
| Label → field | 8px (`FieldGroup` + `FieldLabel`) |
| Primary action → footer link | 16px |
| Field and button height | 40px (`size="lg"`) |

Fields always have a visible label (`FieldLabel` linked with `htmlFor`, 13px sentence case, the same as Create Project); placeholders show an example, never the label. The primary action is a `solid` button. Sections of a longer form (Create Project) are a heading plus fields separated by a 1px line, not boxes inside the form box, so fields keep the same 32px inset.

### Migration of current values (D2)

| Current | → | Reason |
|---:|:-:|---|
| 3px, 5px | 4px | Off-grid |
| 6px, 7px | 8px | 4px reads cramped between interactive items; 8px is the main rhythm |
| 10px | 8px | Compact; merges into the most used value |
| 14px | 12px | |
| 18px | 16px | |
| 22px | 24px | Large gaps follow the 8px rhythm |
| 28px | 32px | |

Uniform rounding down or up was trialed and rejected.

### Layout *(in code)*

- Maximum content width: `1280px` (`--ig-page-max-width`; the earlier DESIGN.md named it `--ig-layout-page-max-width`, which does not exist).
- Breakpoints: 640, 720, 768, 860, 1024, and 1280px. Storybook verification widths: 375, 768, 1280, 1440, and 1920px.
- Full pages own the viewport and scrolling; panels own their internal scroll areas. Collapsed columns are `inert`.
- Page background is the flat canvas (`--ig-color-bg-canvas`); no decorative gradients.

## 5. Shape

### Surface depth *(D5)*

A rounded surface inside another rounded surface must be less rounded than its parent. Radius is therefore chosen by nesting depth, not by component name.

| Depth | Examples | Radius |
|---|---|---:|
| 1 | Modal, dialog, drawer, popover, menu; rounded page panel | 16px |
| 2 | Card, section, widget inside a depth-1 surface | 12px |
| 3 | Preview frame or cell inside a card | 8px |

Rules:

1. Surfaces read their depth from `SurfaceDepthProvider` (React context, so depth survives portals). Without a provider they keep their legacy radius.
2. Floating surfaces restart at depth 1 wherever they open.
3. Page regions (header, sidebars, main area) are flush: radius 0, no inset, no shadow, separated by 1px lines. A region that holds cards wraps them in `SurfaceRegion`, which counts as depth 1 without drawing a surface, so the cards stay depth 2.
4. Maximum depth is 3. A fourth nested decorative surface violates section 8's no-wrapping rule.
5. An explicit radius (`Card radius`, `styled(Surface)` override) wins; each one needs a reason.

### Other radii *(D5)*

| Use | Radius |
|---|---:|
| Buttons, inputs, selects | 8px |
| Checkbox, chip, small badge | 4px |
| Pill (status badge, toggle track) | 999px |

## 6. Size

### Controls *(D7)*

| Density | xs | sm | md | lg |
|---|---:|---:|---:|---:|
| compact (Platform 0.0.1) | 24px | 28px | 32px | 40px |
| comfortable | 28px | 32px | 36px | 44px |

- The unused `control-height-xs-plus` (30px) and `control-height-sm-plus` (34px) and the duplicate `mid-plus` (= `lg`) remain for compatibility; see Accepted Debt.
- `xs` exists for icon-only buttons in panel headers; it must be smaller than `sm` in every density.

### Icons *(D6)*

Icon sizes are 12, 16, 20, and 24px. Line icons are drawn on a 24px grid and render crisply at these sizes; 13, 14, and 18px blur.

| Context | Icon |
|---|---:|
| Inline with 11–12px text | 12px |
| Default; inside 24–32px controls | 16px |
| Inside 40px controls | 20px |
| Inside 48px+ controls, empty states | 24px |

Never pass numeric sizes (`size={14}`, `width="14"`); use the icon tokens so the scale stays changeable.

### Component sizes do not borrow other axes *(D12)*

A component's own dimensions use component size tokens, never spacing or icon tokens. Component sizes are `--ig-size-*` tokens (checkbox, radio, switch, badges, dots, overlay actions, toolbar buttons, and others), all multiples of 4 and enforced by a unit test. Before 2026-10-27, 72 sizes borrowed icon or spacing tokens, so changing one axis resized unrelated components.

## 7. Borders and focus *(D9)*

- Borders are 1px (boundaries) or 2px (focus and emphasis).
- Focus is a 2px ring inside the control (`outline-offset: -2px`), so focus never changes layout. A focused control does not show hover styling.

## 8. Depth and surface tone *(in code; background and shadow by depth deferred)*

The strategy is mixed, restrained elevation: tonal shifts and subtle borders define normal hierarchy; shadows are reserved for floating surfaces (menus, popovers, drawers, dialogs, toasts) and hover lift.

- Surface boundary: `1px solid var(--ig-color-border-subtle)`.
- Do not wrap an existing panel in another decorative panel; every border or shadow marks a real interaction or stacking boundary.
- Background tone and shadow by depth (depth 2+ without shadow) are not applied yet; see Accepted Debt.

## 9. Components

These rules apply to the shared `@ingradient/ui` components that Platform and Edge both use. Page code composes them; it does not restyle them.

### Button

- **Variants**: `solid` (primary action), `secondary`, `accent`, `ghost`. Line, ghost, and icon buttons never take the solid fill; hover and pressed states use the same color family.
- **Sizes**: `xs` (icon-only, panel headers), `sm`, `md`, `lg`; height from the control-height table.
- **Padding** *(D8)*: horizontal 8 / 12 / 12 / 16px (xs / sm / md / lg).
- **Icon ↔ label gap** *(D8)*: 4px up to 28px height, 8px above.
- **Radius**: 8px. **Tone**: `danger` for destructive actions.
- Icon-only buttons are `IconButton`, always have an accessible name, and keep a square size (`flex-shrink: 0`).

### IconButton

- Square, size from the control-height table, icon size from the icon table.
- Panel collapse/expand uses `PanelLeftClose/Open` (left) and `PanelRightClose/Open` (right). `X` closes modals and dialogs only.
- Never put a text glyph (`‹`, `›`, `×`, `▲`) inside; use the icon components.

### TextButton

- Inline text action. Persistent underline in toolbars and selection bars, visible focus ring.

### Inputs (text field, search, select, date picker)

- Height from the control-height table; radius 8px; 1px border, 2px inner focus ring.
- Search shows a clear icon only after text is entered; clicking it clears the text. Icons inside inputs use icon tokens.
- Select: focused state wins over hover; the dependent second control becomes usable after the first selection.

### Checkbox and toggle

- Checkbox and radio 16px, radius 4px, labelled. Toggle track (40×24px) and thumb (16px) use their own size tokens; the thumb's inset is computed from them so it stays centred (D12).

### Card, SectionPanel, ChartCard

- Depth-aware surfaces (section 5). Padding `--ig-inset-card`; gap between cards `--ig-gap-section`.
- A card inside a card is depth 3 at most; do not nest a fourth level.

### Dialogs, modals, drawers

- `ModalCard` / `DialogShell` / `TwoColumnDialog`: floating, depth 1. Labelled title, Escape closes, focus moves in on open and returns on close, `tabIndex={-1}` on the shell.
- `MediaDialogContent` becomes full-screen with radius 0 on narrow screens; it adopts depth styling when its page migrates.

### Settings sections

- `SettingsSection` is a heading (14px semibold) plus rows, separated from the previous section by a 1px line with 24px above and below. It is not a box inside the modal.
- `tone="danger"` keeps an alert box (danger border and tint, depth radius) because it marks a real boundary around irreversible actions such as deleting an account or project.
- The Settings modal body has a 24px inset; the Edge tab's own sections follow the same rule.

### Menus and popovers

- `Menu`, `PopoverCard`, `MenuPopover`, `ContextMenu`: floating, depth 1. Submenu indicator is a chevron icon. Purely visual backdrops are `aria-hidden`.

### Table

- Rows may be clickable only with keyboard activation (Enter/Space) and a contextual row label. Headers stay sticky during vertical scroll. Every sortable header cycles default → first direction → opposite → default.

### Empty, loading, and error states

- `EmptyState` uses `Button` for actions. Skeletons mirror the final layout so content does not jump.

### Badges and status

- Count badges are circular at one digit and grow with padding beyond it. Status uses text or shape in addition to color.

### Clickable non-button elements

- A `div` with `onClick` needs `role="button"`, `tabIndex`, Enter/Space handling, an accessible name, and a `:focus-visible` ring. Secondary controls are siblings, never children, of such an element.

### Resizable columns

- Collapsed columns are `inert` so their zero-width controls cannot be focused. A strong divider precedes an optional right inspector.

### Platform app shell

- `PlatformAppShell` (`@ingradient/platform-pages`) frames workspace pages with the app-wide `SidebarShell`: brand, project switcher, Dashboard / Catalog / Classes, Settings and Sign out. Render it once at the app's route-layout level so the sidebar keeps its state while pages change.
- The shell is router-free: the app passes `activeKey` and performs navigation in `onNavigate`; rows keep real `href`s so modifier-clicks open new tabs.
- Default state: expanded (180px) at 1440px and wider, collapsed (72px) below, so pages keep room for their own side panels. Apps can control `expanded` and persist it.
- Page views size themselves with `height: var(--ig-page-height, 100vh)`; the shell sets `--ig-page-height: 100%` for its page area. The page area is not a landmark; pages own theirs.
- The current project name lives in the shell's project switcher, not in page headers.
- Single-form pages (Login, Signup, Create Project) and mobile layouts render without the shell.
- Panel collapse/expand uses `PanelLeftClose/Open`; the sidebar `<aside>` and `<nav>` carry unique labels (`App sidebar`, `Main`).

### Platform Page Contracts

`@ingradient/platform-pages` owns controlled product views; `stories/pages/platform/0.0.1` supplies deterministic fixtures/runtime and executable documentation. Page views do not import story fixtures and do not own router, API, global store, permission, or persistence.

| Product area | Stories | Purpose groups | Canonical visual/review entry |
|---|---:|---:|---|
| Auth | 10 | 6 | Login `pages-platform-0-0-1-auth-login-workspace--overview`; Signup `pages-platform-0-0-1-auth-signup-workspace--overview` |
| Dataset Catalog | 40 | 8 | `pages-platform-0-0-1-dataset-catalog-workspace--overview` |
| Class Management | 24 | 7 | `pages-platform-0-0-1-class-management-workspace--overview` |
| Create Project | 5 | 3 | `pages-platform-0-0-1-create-project-workspace--overview` |
| Settings Modal | 33 | 7 | `pages-platform-0-0-1-settings-modal-general--preferences` |
| Dashboard | 16 | 6 | `pages-platform-0-0-1-dashboard-workspace--overview` |

The 128 stories across 37 groups use scoped Controls, explicit Actions, named workflows where behavior matters, and blocking accessibility for all Platform page stories. Canonical IDs are downstream contracts shared by probes, visual targets, handoff metadata, and documentation.

- Auth Login/Signup, Create Project, and Dashboard use package-owned controlled views and shared story runtimes.
- Catalog mobile props form a discriminated contract: mobile requires mobile state and excludes desktop-only sidebar/stats slots.
- Class Management remains a three-pane desktop workspace. Narrow status/collapsed states are valid, but a full 375px workflow is not claimed until a product mobile shell exists.
- Responsive behavior is reviewed through production probes/manual widths; canonical Playwright snapshots run against platform-specific baselines.

See [`packages/platform-pages/README.md`](./packages/platform-pages/README.md) and the [Platform Story Contract](./stories/pages/platform/0.0.1/README.md).


## 10. Motion & Interaction

| Type | Token/value | Usage |
|---|---|---|
| Micro | 120–160ms | Hover, button, focus, small control feedback |
| Standard | 200–240ms ease | Menus, panel state, common transitions |
| Mobile navigation | 280ms cubic-bezier(0.4,0,0.2,1) | Sidebar/mobile navigation |
| Continuous | 700–1500ms | Spinner, shimmer, progress, synchronization only |

- Motion communicates state change. Avoid decorative motion in dense workspaces.
- Interactive elements must expose hover, active, focus-visible, and disabled treatment where applicable.
- Respect `prefers-reduced-motion`; continuous status motion must retain a non-motion state cue.

## 11. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA for product text and controls; visual state cannot rely on color alone.
- All primary tasks must be keyboard reachable with a visible focus state.
- Dialogs need a labelled title, deterministic close path, and sensible focus behavior.
- Image-heavy workflows require stable alternative labels or adjacent text metadata where the component contract provides them.
- At 375px, primary content must remain usable without page-level horizontal scrolling; secondary chrome may collapse.
- Reduced motion, theme mode, density, and text scaling must not remove task-critical information.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| High-contrast mode is currently a Storybook placeholder | `.storybook/preview.tsx` | Existing product state; this migration does not introduce it | Implement a real high-contrast token preset before claiming high-contrast support |
| Locale toolbar does not yet provide full i18n | `.storybook/preview.tsx` | Existing product state; migrated stories currently use English product copy | Add translated content and CJK layout verification with the i18n phase |
| Legacy spacing names | `--ig-space-*` in about 1,650 CSS and 330 JSX uses | Values already follow the 4px scale; renaming is mechanical but touches every file | Move to `--ig-spacing-{px}` or spacing roles page by page |
| Spacing roles not adopted | `--ig-gap-*`, `--ig-inset-*` | Tokens exist; components still pick numbers | Adopt in shared components first |
| Surface tone and shadow by depth | `surfacePanel` recipe | Radius depth shipped first; tone and shadow change visuals more | Trial, then apply with the surface depth provider |
| Unused or duplicate control-height tokens | `control-height-xs-plus`, `sm-plus`, `mid-plus` | Public token names; removal is breaking | Remove in the next breaking release |
| Visual baselines | `tests/visual` | Foundation values changed most screenshots | Regenerate from CI (ubuntu) and approve |
| ClassManage has no source mobile workspace shell | `packages/platform-pages/src/class-manage` | The migrated reference defines a resizable three-pane desktop workspace but no mobile navigation/detail pattern | Add a dedicated narrow shell or drawers before claiming the full ClassManage workflow at 375px |
