# Platform 0.0.1 Story Migration

## Current result

The original migration first retained the complete Platform `0.0.1` page-story surface without blindly overwriting the current component architecture. Auth, Dataset Catalog, Class Management, Create Project, Settings Modal, and Dashboard documentation were subsequently consolidated into purpose-grouped, executable contracts instead of flat sets of overlapping page states.

- Source: `/Users/homebodify/Projects/ingradient-ui-old/stories/pages/platform/0.0.1`
- Target: `/Users/homebodify/Projects/ingradient-ui/stories/pages/platform/0.0.1`
- Source files reviewed: 25 project files plus `.DS_Store`
- Target files present: all 25 project files
- Catalog story organization: split into Workspace, System States, Interactions, Analytics, Image Inspector, Dataset Details, Workflows, and Responsive
- Class Management story organization: split into Workspace, System States, Interactions, Reference Image, Workflows, Image Inspector, and Model Mapping
- Create Project story organization: split into Workspace, System States, and Workflows
- Settings Modal story organization: split into General, Account, Project, Edge, Organization, Devices, and Storage
- Dashboard story organization: split into Workspace, System States, Interactions, Layouts, Layout Studies, and Integrations
- Auth story organization: Login and Signup each split into Workspace, System States, and Workflows
- Story coverage: all 157 source stories were audited; 19 redundant Catalog exports and 5 redundant/split Class Management exports were consolidated after their behavior moved into representative stories, while 2 previously undocumented Class Management states were added. Settings absorbed 5 duplicate/reproducible static exports into its canonical stories and 3 executable workflows while adding 1 explicit password workflow, for a net reduction of 4. Create Project retained 5 distinct contracts while replacing static Filled/Validation exports with executable workflows. Dashboard consolidated 19 flat exports to 16 grouped contracts by removing the exact default-layout duplicate and absorbing reproducible Customize/subset/all-hidden and date-open/applied states into named workflows; the two alternative layouts remain isolated studies. Auth retains 10 total contracts: duplicate Login Default/Empty became one canonical workspace while Signup gained an executable account-creation workflow.
- `.DS_Store`: intentionally not migrated
- Blind copy/overwrite: not used

## Delivery

- Feature commit: [`3b1b01e`](https://github.com/InGradient/ingradient-ui/commit/3b1b01e9bd01db993db9d18fdcdbf693cf32446f)
- Latest `main` was merged without rewriting history.
- Main integration commit: [`d1b32c2`](https://github.com/InGradient/ingradient-ui/commit/d1b32c2c46b02ef08f750fbc1a8e41803a7fb216)
- GitHub `main` was verified at `d1b32c2c46b02ef08f750fbc1a8e41803a7fb216` after push.

The comparison used source file content, the target Git `HEAD`, and the checked-out target worktree. This distinguished original story coverage from cleaned/consolidated target code and from API adapters already required by the current design-system packages.

## Coverage

| Story group | Legacy source | Current | Result |
|---|---:|---:|---|
| Dataset Catalog | 59 | 40 | Consolidated, behavior retained by grouped page and component contracts |
| Class Management | 27 | 24 | Consolidated into seven purpose groups with executable workflows |
| Create Project | 5 | 5 | Consolidated into three purpose groups with two executable workflows |
| Dashboard | 19 | 16 | Consolidated into six purpose groups with four executable workflows |
| Settings Modal | 37 | 33 | Consolidated into seven purpose groups with eight executable workflows |
| Auth / Login | 7 | 6 | Consolidated into three purpose groups with an executable sign-in workflow |
| Auth / Signup | 3 | 4 | Split into three purpose groups with an executable account-creation workflow |
| **Total** | **157** | **128** | **Intentional page-story consolidation** |

The original ID-level comparison established that no state was missed during migration. The current consolidation keeps empty, loading, error, permission, menu, workflow, mobile, stress, and layout behavior discoverable while removing duplicate fixtures and implementation-oriented names. Controls, Actions, Interactions, accessibility checks, static probes, and visual references now follow the surviving story IDs.

## File Decisions

The source and target were compared by content rather than filename. The exact adapted-file count is recorded again in the final verification evidence because fidelity repairs intentionally changed several target files after the initial comparison.

### Original code retained directly

- `catalog/mock-dashboard.ts`
- `class/use-class-manage-scene.ts`
- `settings/use-edge-tab-state.ts`

`README.md` also initially matched the source and was then updated to point to this report and to reflect the current probe counts.

### Current-API adapters retained

| File | Original dependency/shape | Current equivalent and decision |
|---|---|---|
| `Catalog*.stories.tsx` | One flat Catalog story file with overlapping implementation-state names | Uses eight purpose-based Dataset Catalog groups, shared Addon Panel instrumentation, and the current mobile shell at the 768px breakpoint |
| `ClassManage*.stories.tsx` | One flat ClassManage story file with duplicate fixtures and descriptive-only interactions | Uses seven purpose-based Class Management groups, deterministic controlled state, Action spies, named Interaction steps, and blocking accessibility checks |
| `CreateProject*.stories.tsx` | One implementation-named flat CreateProject file with static Filled/Validation exports and no-op callbacks | Uses Workspace, System States, and Workflows under the visible `Create Project` name; 7 Action spies and 2 named workflows preserve all 5 distinct contracts with blocking accessibility |
| `SettingsModal*.stories.tsx` | One flat SettingsModal story file with 37 implementation-state exports | Uses seven purpose-based Settings Modal groups and 33 stories; Default/General, password dialog/mismatch, project default/grouping, and members/search overlap are represented by canonical or executable workflow stories |
| `Dashboard*.stories.tsx` | One 347-line flat file with 19 static/overlapping exports, no Action spies, and side-by-side layout experiments | Uses six purpose groups, 10 Action spies, 4 named workflows, and blocking accessibility. Compact Masonry and Sectioned Grid are preserved as single-layout studies rather than duplicated side-by-side dashboards |
| `auth/{Login,Signup}*.stories.tsx` | Inline page composition, read-only controls, duplicate Login Default/Empty, and no Action contract | Uses package-owned `LoginView`/`SignupView`, six purpose groups, 12 Action callbacks, two named workflows, scoped Controls, handoff metadata, and blocking accessibility while retaining 10 total contracts |
| `auth/auth-story-{runtime,config,actions,plays}.*` | No shared Auth Addon Panel or controlled interaction contract | Supplies deterministic form state, explicit submit/navigation payloads, validation recovery, preference toggles, and account creation |
| `catalog/build-detail-content.tsx` | Direct Lucide icons, annotation toolbar, and old detail sidebar composition | Uses exported Ingradient icons, `ToolbarShell`, `DetailPanelSidebar`, `UserPoolList`, and the current `ImageInspectorCanvas`; preserves the original edge-to-edge canvas, 64px framed toolbar, and single modal close control |
| `catalog/build-overlays.ts` | Upload phase `compressing` | Maps the same state to the current `processing` phase |
| `catalog/build-stats-content.tsx` | Dashboard/layout components in UI and old progress primitive | Uses platform-page dashboard components, chart patterns, `SegmentedProgressBar`, primitives, and numeric tokens |
| `catalog/build-view-props.tsx` | Obsolete menu field and fixture-only mobile selection | Drops the removed field and supplies current desktop/mobile view props from the responsive story mode |
| `catalog/mock-detail.ts` | `Comment` type from the former UI location | Imports the type from `@ingradient/platform-pages` |
| `catalog/use-catalog-extra-dialogs.ts` | Dialog state types from the former UI location | Imports current platform-page types |
| `catalog/use-catalog-scene.ts` | Filter types from the former UI location and `compressing` phase | Uses platform-page types and the current `processing` phase |
| `dashboard/build-widgets.tsx` | Dashboard widgets from the former UI pattern layer | Imports the extracted widgets from `@ingradient/platform-pages` |
| `create-project/create-project-story-{runtime,actions,plays}.*` | Inline form state and no executable Addon Panel contract | Supplies controlled form state, scoped Controls, 7 Action callbacks, 2 named workflows, handoff metadata, and blocking accessibility |
| `dashboard/dashboard-story-{runtime,config,actions,plays}.*` | Inline Dashboard scene/comparison code, no-op callbacks, and non-deterministic descriptive states | Supplies controlled preferences/date/save state, scoped Controls, 10 Action callbacks, 4 named workflows, handoff metadata, and blocking accessibility |
| `dashboard/dashboard-layout-studies.tsx` | Two side-by-side comparisons that duplicated the canonical grid and its landmarks | Preserves Compact Masonry and Sectioned Grid independently under the user-approved non-production `Layout Studies` group |
| `settings/build-{view,admin,edge,storage}-*.tsx` | Static local state and no-op persistence callbacks | Preserves deterministic controlled state while reporting explicit General, Account, Project, Organization, Device, Storage, Edge, dialog, and navigation Action payloads |
| `settings/use-settings-modal-scene.ts` | `RoleMatrix` in the former UI package and incomplete scenario resets | Uses the extracted platform-page implementation and resets every scenario-owned organization, invitation, join-code, project, dialog, and device field deterministically |
| `settings/settings-modal-story-{runtime,actions,plays}.*` | No shared Settings Addon Panel or interaction contract | Supplies scoped Controls, 12 explicit Action callbacks, 8 named play workflows, handoff metadata, and blocking accessibility checks |

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
- Settings is exposed as a named modal dialog; General checkboxes, Admin action columns, invitation/join-code fields, issued tokens, project description, Edge device name, and Deflectometry preview now have explicit accessible names.
- Storage statistics tables expose distinct landmark names instead of repeated generic regions.
- The Deflectometry project badge uses the existing strong-accent/on-accent token pair, raising its rendered contrast from the measured 2.83:1 baseline to 5.46:1 without changing layout.
- ClassManage rows use the shared `SelectableListItem` directly, preserving the source blue selected-class affordance and semantic list item output.
- Class Management sequence badges derive their value from the actual sibling count instead of a hard-coded `4`.
- Class lightbox pattern tabs now update the displayed image URL together with the selected sibling metadata and annotations.
- Class details use level-two section headings, preserving a valid heading hierarchy when the class sidebar is collapsed without changing appearance.
- Storage metrics and project-resolution metadata use block text elements so labels, values, titles, and metadata do not visually concatenate.
- Dashboard loading content now renders a valid `div` container instead of nesting a layout `div` inside a paragraph.
- Dashboard drag attributes now belong to the existing `DragHandle` button instead of a button-role wrapper containing both drag and download controls.
- Dashboard Customize uses a labelled checkbox group rather than a menu role with non-menu children, and source tables include camera IPs in their landmark names.
- `DraggableAnalysisWidgetGrid` keeps its hook order stable when Customize transitions from visible widgets to the all-hidden state; a focused rerender regression protects this path.
- Dashboard no-analysis data now has distinct copy from the user-configured all-widgets-hidden state.
- Platform Auth page composition now belongs to `@ingradient/platform-pages`; operational stories are thin fixture/runtime adapters like the other Platform pages.
- Login and Signup fields have explicit accessible names and controlled callbacks. The user-approved underline distinguishes inline navigation links from surrounding copy without changing their color or layout.

Focused regression tests cover the grid/dialog boundaries and the Catalog detail, Settings text layout, and Dashboard loading regressions.

## Current-System Differences Kept Intentionally

- Page composition remains in `@ingradient/platform-pages`; stories stay thin scenario orchestrators.
- Current primitives, components, patterns, semantic tokens, icon exports, and package-owned types take precedence over removed import locations.
- The current CreateProject page component supplies the supported Photometric Stereo project option in addition to the two fixture-backed cards visible in the older build. This is current product capability, not a missing migrated design, so it was not removed.
- DOM-level probe selectors follow current stable `data-*` contracts rather than removed row ARIA labels; user-visible expectations are unchanged.

## Verification Contract

The current migration and consolidation are complete only when all of the following remain true:

1. The target Storybook index exposes 10 Auth, 40 Dataset Catalog, 24 Class Management, 5 Create Project, 33 Settings Modal, and 16 Dashboard stories under their purpose groups, with no retired flat page IDs.
2. Unit tests pass for the adapted page components.
3. Storybook builds successfully.
4. Page probes render Auth, Dataset Catalog, Class Management, Create Project, Dashboard, and Settings Modal states without product console errors.
5. Canonical Playwright snapshots run at 1440×1200. Responsive behavior at 375px, 768px, and 1280px is covered by page probes and recorded manual browser review. The source has no ClassManage mobile shell; its three-pane workspace stories are therefore reference-checked at tablet/laptop, while its status and collapsed variants remain the available narrow states.

The project-wide visual and browser evidence for the completed run is recorded below.

## Current consolidation verification evidence

| Check | Current result |
|---|---|
| Live and static Storybook indexes | Auth 10 / 6 groups, Dataset Catalog 40 / 8 groups, Class Management 24 / 7 groups, Create Project 5 / 3 groups, Settings Modal 33 / 7 groups, Dashboard 16 / 6 groups; 0 retired flat IDs for all six product areas |
| TypeScript and lint | `tsc --noEmit`, source ESLint, page-package Stylelint, all changed Auth/story/package focused ESLint, Auth Node probe syntax, and `git diff --check` passed. Source ESLint retained 4 existing warnings and no errors. |
| Unit tests | 57 files, 220 tests passed, including controlled Login/Signup callbacks, unique simultaneous Auth message IDs, deterministic Dashboard date presets, arrow-key widget reordering, visible→all-hidden hook order, and sibling-control regressions |
| Focused Storybook MCP | Auth 10/10, Create Project 5/5, and Dashboard 16/16 passed their named workflows plus blocking accessibility. Auth's former 10 serious inline-link violations were resolved by the user-approved underline; sign-in and account-creation workflows passed again after static-effect settling. |
| Historical full Storybook MCP delivery checkpoint | The clean 8GB server-side suite immediately before the final simultaneous-message ID hardening completed with 213 files / 493 tests passed in 287.93s. The addon again closed the MCP HTTP connection while serializing the complete result after success; the directly observed server summary is the source of truth. On the exact delivered Auth source, focused MCP 10/10, unit 57/220, package/static builds, and the 12-case production probe twice consecutively passed. |
| Current repository-wide Storybook rerun | 202/213 files and 482/493 tests passed. The 11 failures are accessibility checks in component, primitive, pattern, and Edge stories outside `stories/pages/platform/0.0.1`; the Platform page story files passed. Do not describe the current complete repository suite as green until those unrelated failures are resolved. |
| Current merged-head package build | UI, platform-pages, and edge-pages JavaScript/DTS builds passed after integrating `d1b32c2` |
| Current merged-head Storybook production build | Passed after integrating `d1b32c2`; 4,548 modules transformed |
| Static browser probes | 89/89 passed with no product console errors: Auth 12, Catalog 22, Class Management 16, Create Project 5, Settings Modal 18, Dashboard 16 |
| Responsive browser review | Auth Login/Signup and Create Project at 1280×900 and 375×812, plus Dashboard at 1280×900, 768×1024, and 375×812, each measured 0px document overflow. Auth form width/height matched the pre-extraction baseline and only the approved link underline changed. Dashboard exposed 8 sibling drag controls, 8 sibling download controls, 0 nested buttons, direct arrow-key reordering with polite feedback, and unique table landmark names. |
| Canonical visual targets | Auth Login `pages-platform-0-0-1-auth-login-workspace--overview`; Auth Signup `pages-platform-0-0-1-auth-signup-workspace--overview`; Dataset Catalog `pages-platform-0-0-1-dataset-catalog-workspace--overview`; Class Management `pages-platform-0-0-1-class-management-workspace--overview`; Settings Modal `pages-platform-0-0-1-settings-modal-general--preferences`; Create Project `pages-platform-0-0-1-create-project-workspace--overview`; Dashboard `pages-platform-0-0-1-dashboard-workspace--overview`. Auth's Linux baselines need an intentional underline update; no Darwin capture may replace them. |

The renamed Dataset Catalog, Class Management, and Create Project Linux baselines were preserved rather than silently regenerated. Auth Login/Signup need intentional Linux baseline updates for the approved underline, while Settings Modal and Dashboard still need their first approved Linux baselines on a Linux runner; do not substitute discarded Darwin captures.

Repository-wide `check:style-literals` and `check:doc-coverage` remain blocked by existing files outside the six Platform product areas: the former reports raw literals in component/pattern stories/tests and `number-field.tsx`; the latter reports 14 already-missing Storybook seed files. No Auth, Create Project, or Dashboard path appears in either failure list. `validate:consumer-smoke` rebuilds all three packages successfully but the consumer's stricter `noUnusedLocals` check stops on five existing React/useRef imports in shared source; none belongs to these migrated pages.

The repository visual target list also retains four stale target IDs (two missing generic stories and two renamed Edge stories) plus four missing or outdated Linux baselines across Platform/Edge. Fix those targets separately rather than weakening the seven canonical Platform contracts.

## Historical migration verification evidence

The table below records the pre-consolidation migration run. Current consolidation evidence is reported above by focused/full Storybook MCP tests, the 89-case six-product-area probe set, and the surviving canonical visual references.

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

At the time of the historical run, project-wide `tsc --noEmit` was blocked by ten generic `Table` assignment errors and the broader Storybook run retained 13 unrelated component/Edge failures. The delivered consolidation checkpoint later passed all 493 Storybook tests. The current repository rerun has 11 unrelated accessibility failures outside Platform `0.0.1`; Platform page stories and the delivery evidence above remain valid, but the current complete repository suite is not fully green.
