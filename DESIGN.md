# Ingradient UI Design System

This document records the design system already implemented in `src/tokens`, `src/primitives`, `src/components`, `src/patterns`, and `packages/platform-pages`. It is an extraction of the current product, not a redesign. The Platform `0.0.1` stories use the `platformV001` preset: industrial-dark theme, compact density, dark mode, and the default brand.

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

## 3. Typography

### Scale

| Token tier | Size | Typical usage |
|---|---:|---|
| `3xs` / `2xs` | 10 / 11px | Exceptional micro-labels and dense overlays only |
| `xs` / `sm` | 12 / 13px | Captions, metadata, compact controls |
| `md` / `lg` | 14 / 15px | Default body and control text |
| `xl` / `2xl` | 16 / 18px | Section titles and emphasized values |
| `3xl` / `3xlPlus` | 20 / 22px | Page or modal headings |
| `4xl` / `5xl` | 24 / 28px | Large empty-state or authentication headings |

- Sans: `"IBM Plex Sans", "Segoe UI", sans-serif`.
- Mono: `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace`.
- Weights: 400, 500, 600, 700, 800. Body line height uses the tokenized 1.35–1.6 range.
- New page code uses the typography variables or `Text`/heading primitives. Text below 12px is reserved for existing dense technical overlays and is not a general body style.

## 4. Spacing & Layout

The implemented spacing scale is compact and tokenized: 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, and 32px, exposed as `--ig-space-*`. Platform `0.0.1` overrides the small/medium/large control heights to 28/32/40px.

- Maximum standard content width: `1280px` (`--ig-layout-page-max-width`).
- Breakpoints: 640, 720, 768, 860, 1024, and 1280px.
- Storybook verification widths: 375, 768, 1280, 1440, and 1920px.
- Full pages own the viewport and scrolling; panels explicitly own their internal scroll areas.
- Workspace pages favor resizable sidebar/content/detail columns. Narrow layouts collapse secondary navigation or expose a mobile selector rather than shrinking primary image content beyond usability.
- Layout props that require numbers use numeric token exports such as `popupSizeNumbers`; CSS-variable strings are only used in CSS-capable values.

## 5. Components

### Application Shells

- **Structure**: viewport root, header/navigation, one or more workspace columns, overlay layer.
- **Variants**: dashboard grid, catalog three-column workspace, class-management three-column workspace, settings modal, authentication form.
- **States**: default, loading, empty, error, permission denied, sidebar collapsed, modal/drawer open.
- **Accessibility**: landmark elements and labelled controls remain keyboard reachable; collapsed navigation retains an accessible trigger.
- **Layout**: the viewport is the outer scroll boundary; each long list or image grid owns its panel scroll.

### Resizable Columns and Selectable Grid Panel

- **Structure**: navigation/sidebar, resize handle, primary grid panel, optional detail sidebar.
- **Variants**: bordered panel or flush shell column; selected, no-selection, loading, empty.
- **Spacing**: panel and grid padding use `--ig-space-*`; sidebar widths use popup/layout tokens.
- **Accessibility**: resize handles and selectable rows expose keyboard/ARIA behavior through their shared components.
- **Layout**: columns preserve `min-width: 0`; overflow belongs to the list/grid region.

### Image Grid

- **Structure**: `GridContainer` → image cells → annotation/footer/top-right slots.
- **Variants**: padded or flush, auto-fit or fixed columns, selectable, highlighted, paginated.
- **Spacing**: minimum cell widths use numeric token exports; gaps use spacing-scale indices.
- **States**: default, hover, selected, highlighted, loading-more, empty at the containing panel.
- **Accessibility**: cells forward click, double-click, selection, drag, and context-menu behavior; highlighted items scroll into view.
- **Layout**: responsive auto-fit grid with `minmax(min(cellWidth, 100%), 1fr)`; never coerce CSS strings into numeric layout props.

### Dialogs and Menus

- **Structure**: backdrop/anchor, labelled surface, content, explicit confirm/cancel or close controls.
- **Variants**: text input, confirm, media/lightbox, context menu, transfer/export flows.
- **States**: open/closed, default/destructive confirm, validation or progress where applicable.
- **Accessibility**: dialog semantics, readable title, close/escape path, focusable actions, and persistent labels.
- **Motion**: shared overlay primitives and motion tokens; non-essential movement respects reduced motion.

### Dashboard Widgets

- **Structure**: widget shell, heading/actions, chart or metric content.
- **Variants**: loading, error, empty, populated, draggable/customizable.
- **Spacing**: shared widget shell and grid tokens; no page-specific raw colors.
- **Accessibility**: widget labels remain visible independently of chart color; controls retain focus states; the existing drag handle supports direct arrow-key reorder with `aria-keyshortcuts` and polite status feedback.
- **Layout**: responsive grid; widget keys provide stable ordering and test hooks.

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

## 6. Motion & Interaction

| Type | Token/value | Usage |
|---|---|---|
| Micro | 120–160ms | Hover, button, focus, small control feedback |
| Standard | 200–240ms ease | Menus, panel state, common transitions |
| Mobile navigation | 280ms cubic-bezier(0.4,0,0.2,1) | Sidebar/mobile navigation |
| Continuous | 700–1500ms | Spinner, shimmer, progress, synchronization only |

- Motion communicates state change. Avoid decorative motion in dense workspaces.
- Interactive elements must expose hover, active, focus-visible, and disabled treatment where applicable.
- Respect `prefers-reduced-motion`; continuous status motion must retain a non-motion state cue.

## 7. Depth & Surface

The strategy is **mixed, restrained elevation**: tonal shifts and subtle borders define normal hierarchy; shadows are reserved for panels, menus, popovers, drawers, dialogs, toast surfaces, and hover lift.

- Panel boundary: `1px solid var(--ig-color-border-subtle)`.
- Common radii: 6–20px; 24px is reserved for the largest surfaces; pills use 999px.
- Do not wrap an existing panel in another decorative panel. Each border or shadow must identify a real interaction or stacking boundary.

## 8. Accessibility Constraints & Accepted Debt

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
| ClassManage has no source mobile workspace shell | `packages/platform-pages/src/class-manage` | The migrated reference defines a resizable three-pane desktop workspace but no mobile navigation/detail pattern | Add a dedicated narrow shell or drawers before claiming the full ClassManage workflow at 375px |
| Auth canonical Linux snapshots predate the approved inline-link underline | `tests/visual/storybook-visual.spec.ts-snapshots` | The accessibility fix is intentional, but Linux is the repository baseline platform | Approve both Auth snapshots on a Linux runner; never substitute Darwin captures |
| Settings Modal and Dashboard lack first approved Linux baselines | `tests/visual/storybook-visual.spec.ts` | Canonical targets are registered and rendering was reviewed, but no Linux snapshot is checked in yet | Capture and approve the canonical targets on a Linux runner |
