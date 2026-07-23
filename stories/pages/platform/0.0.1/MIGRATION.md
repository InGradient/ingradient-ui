# Platform 0.0.1 Story Migration

## Result

The migration is feasible and the checked-out target now retains the complete original Platform `0.0.1` page-story surface without blindly overwriting the current component architecture.

- Source: `/Users/homebodify/Projects/ingradient-ui-old/stories/pages/platform/0.0.1`
- Target: `/Users/homebodify/Projects/ingradient-ui/stories/pages/platform/0.0.1`
- Source files reviewed: 25 project files plus `.DS_Store`
- Target files present: all 25 project files
- Renamed or deleted source files: none
- Story coverage: 157 of 157 source story IDs retained, with no extra or missing IDs
- `.DS_Store`: intentionally not migrated
- Blind copy/overwrite: not used

The comparison used source file content, the target Git `HEAD`, and the checked-out target worktree. This distinguished original story coverage from cleaned/consolidated target code and from API adapters already required by the current design-system packages.

## Coverage

| Story group | Source | Target | Result |
|---|---:|---:|---|
| Catalog | 59 | 59 | Complete |
| ClassManage | 27 | 27 | Complete |
| CreateProject | 5 | 5 | Complete |
| Dashboard | 19 | 19 | Complete |
| SettingsModal | 37 | 37 | Complete |
| Auth / Login | 7 | 7 | Complete |
| Auth / Signup | 3 | 3 | Complete |
| **Total** | **157** | **157** | **Exact story-ID match** |

This ID-level comparison matters because several cleaned target stories had previously grouped multiple states behind Storybook controls. Retaining every original export makes empty, loading, error, permission, menu, modal, mobile, stress, and layout states directly discoverable again.

## File Decisions

The source and target were compared by content rather than filename. The exact adapted-file count is recorded again in the final verification evidence because fidelity repairs intentionally changed several target files after the initial comparison.

### Original code retained directly

- `ClassManage.stories.tsx`
- `CreateProject.stories.tsx`
- `SettingsModal.stories.tsx`
- `catalog/mock-dashboard.ts`
- `class/use-class-manage-scene.ts`
- `dashboard/use-dashboard-scene.ts`
- `settings/build-admin-props.tsx`
- `settings/build-edge-slots.tsx`
- `settings/build-view-props.tsx`
- `settings/use-edge-tab-state.ts`

`README.md` also initially matched the source and was then updated to point to this report and to reflect the current probe counts.

### Current-API adapters retained

| File | Original dependency/shape | Current equivalent and decision |
|---|---|---|
| `Catalog.stories.tsx` | Desktop/mobile states selected only by a fixture flag | Retains the named mobile fixtures and selects the current mobile shell automatically at the 768px breakpoint so desktop scenarios do not collapse their primary pane at tablet widths |
| `Dashboard.stories.tsx` | Dashboard patterns from the UI package | Uses `@ingradient/platform-pages` page patterns and current primitives; all original layout-comparison stories remain exported |
| `auth/Login.stories.tsx`, `auth/Signup.stories.tsx` | Original literal dimensions/weight | Keeps the complete original story exports while preserving the target's cleaned popup, spacing, and font-weight tokens |
| `catalog/build-detail-content.tsx` | Direct Lucide icons, annotation toolbar, and old detail sidebar composition | Uses exported Ingradient icons, `ToolbarShell`, `DetailPanelSidebar`, `UserPoolList`, and the current `ImageInspectorCanvas`; preserves the original edge-to-edge canvas, 64px framed toolbar, and single modal close control |
| `catalog/build-overlays.ts` | Upload phase `compressing` | Maps the same state to the current `processing` phase |
| `catalog/build-stats-content.tsx` | Dashboard/layout components in UI and old progress primitive | Uses platform-page dashboard components, chart patterns, `SegmentedProgressBar`, primitives, and numeric tokens |
| `catalog/build-view-props.tsx` | Obsolete menu field and fixture-only mobile selection | Drops the removed field and supplies current desktop/mobile view props from the responsive story mode |
| `catalog/mock-detail.ts` | `Comment` type from the former UI location | Imports the type from `@ingradient/platform-pages` |
| `catalog/use-catalog-extra-dialogs.ts` | Dialog state types from the former UI location | Imports current platform-page types |
| `catalog/use-catalog-scene.ts` | Filter types from the former UI location and `compressing` phase | Uses platform-page types and the current `processing` phase |
| `dashboard/build-widgets.tsx` | Dashboard widgets from the former UI pattern layer | Imports the extracted widgets from `@ingradient/platform-pages` |
| `settings/build-storage-slots.tsx` | Storage UI in the former component layer | Uses platform-page storage components/types and current chart patterns |
| `settings/use-settings-modal-scene.ts` | `RoleMatrix` in the former UI package and a shared member-search fixture field | Uses the extracted platform-page implementation and seeds the distinct invitation-search state used by its named story |

No substitute component had to be invented and no visual area had to be replaced with one-off hardcoded markup. Existing product copy and story fixture values remain literal where they are the content being demonstrated.

## Reference-Fidelity Repair

The file move and visual comparison exposed several component migration defects in the current page adapters:

- The original gallery used a numeric 140px minimum cell width and 12px gap.
- The current adapter passed a CSS-variable string through a numeric prop, which generated an invalid CSS value and expanded the first image to a full-width single column.
- `ClassManageImageGrid` now uses `popupSizeNumbers['2xs']`, fixed-width auto-fill cells, the original 4:3 ratio, and the original 320px sidebar widths while preserving the current `ImageGrid` and `ResizableColumnsLayout` components.
- The generic text-input dialog title `Class name` was restored to the original accessible title `Add Class`.
- Catalog detail uses one close button, restores the original canvas/toolbar frame, and expands its comment-list slot so all three seeded comments remain visible.
- The shared media dialog now stacks its image workspace over the sidebar at 768px and below, so Catalog detail keeps a full-width image and usable inspector on mobile.
- Settings restores its inherited one-column narrow layout, preventing its navigation rail from compressing mobile content to an unusable strip.
- Settings admin content no longer flex-shrinks the Members section; all five member rows remain visible before Invitations, while dense tables use a readable tokenized minimum width with horizontal scrolling on mobile.
- Storage overview and paired charts use auto-fit minimums, keeping metric cards and chart content readable instead of compressing values character by character.
- ClassManage rows use the shared `SelectableListItem` directly, preserving the source blue selected-class affordance and semantic list item output.
- Storage metrics and project-resolution metadata use block text elements so labels, values, titles, and metadata do not visually concatenate.
- Dashboard loading content now renders a valid `div` container instead of nesting a layout `div` inside a paragraph.

Focused regression tests cover the grid/dialog boundaries and the Catalog detail, Settings text layout, and Dashboard loading regressions.

## Current-System Differences Kept Intentionally

- Page composition remains in `@ingradient/platform-pages`; stories stay thin scenario orchestrators.
- Current primitives, components, patterns, semantic tokens, icon exports, and package-owned types take precedence over removed import locations.
- The current CreateProject page component supplies the supported Photometric Stereo project option in addition to the two fixture-backed cards visible in the older build. This is current product capability, not a missing migrated design, so it was not removed.
- DOM-level probe selectors follow current stable `data-*` contracts rather than removed row ARIA labels; user-visible expectations are unchanged.

## Verification Contract

The migration is complete only when all of the following remain true:

1. Old and target Storybook indexes expose the same 157 Platform `0.0.1` story IDs.
2. Unit tests pass for the adapted page components.
3. Storybook builds successfully.
4. Page probes render Catalog, ClassManage, CreateProject, Dashboard, and SettingsModal states without product console errors.
5. Visual captures at 375px, 768px, and 1280px show usable primary content for responsive pages. The source has no ClassManage mobile shell; its three-pane workspace stories are therefore reference-checked at tablet/laptop, while its status and collapsed variants remain the available narrow states.

The project-wide visual and browser evidence for the completed run is recorded below.

## Final Verification Evidence

The final comparison was repeated after all fidelity repairs and after waiting for every image element to finish loading.

| Check | Result |
|---|---|
| Source/target file accounting | 25/25 present; 10 byte-identical, 15 intentionally adapted; no renamed, deleted, or missing project file |
| Storybook index comparison | 157/157 exact IDs; no missing or extra Platform story |
| Focused unit regressions | 10 files, 21 tests passed |
| Storybook production build | Passed; 4,495 modules transformed |
| Page probes | 56/56 passed: Catalog 18, Settings 18, CreateProject 5, ClassManage 7, Dashboard 8 |
| Current visual captures | 471/471 captured at 375×800, 768×1024, and 1280×800 |
| Capture health | 0 render failures, 0 product console errors, 0 page errors, 0 broken images |
| Old/current laptop comparison | 157/157 pairs compared; SSIM median 0.921448, p25 0.875278, p75 0.948712 |
| Manual browser gates | Original 7/7 plus final 5/5 geometry checks passed: mobile detail, Members desktop/mobile, storage mobile, and selected-class styling |

The 20 narrow-width overflow observations are exactly the 20 ClassManage three-pane workspace states described in the accepted-debt note; Catalog and Settings have no remaining page-level horizontal overflow. The original source supplies no alternative ClassManage mobile workspace design to transfer.

Project-wide `tsc --noEmit` remains blocked by ten pre-existing generic `Table` assignment errors outside this migration's changed behavior: `packages/edge-pages/src/statics/SessionChartsView.tsx`, `packages/platform-pages/src/dashboard/EdgeAnalyticsSection.tsx`, and the dashboard labeling/person, dataset-distribution, and source-breakdown widgets. The broader Storybook interaction run likewise retains 13 unrelated component/Edge failures; all Platform page stories passed the add-on accessibility run. These unrelated failures were not changed or hidden by this migration.
