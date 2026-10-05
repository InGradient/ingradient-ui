# Final merge visual integrity review

- recommendation: REJECT
- blockers:
  - violatedCriterion: C5 — No blocking visual defect in supplied states
    evidencePointer: `/tmp/ingradient-merge-20260908/catalog-mobile.png`; `/home/homebodify/Projects/ingradient-platform/node_modules/@ingradient/platform-pages/src/catalog/CatalogView.styles.ts:5`; `/home/homebodify/Projects/ingradient-platform/frontend/app/ProtectedAppShell.styles.ts:32`
    observation: The mobile bottom toolbar is rendered below the clipped viewport because the Catalog page consumes `100vh` inside a mobile main region that already adds 52px top padding; View, Filter, Sort, Export, and Upload are therefore not visually reachable in the supplied 375x812 state.
- platformSha: `540e2f34962cded9ddbb9dacea19d5e770df5de4`
- uiSha: `c210de1` (provided merge input)

## Original intent

Resolve the small final merge delta so Catalog upload remains connected and the current UI package receives correctly discriminated desktop/mobile props, while preserving the upstream design and avoiding any faked or screenshot-backed UI.

## Desired outcome

The merged Catalog renders as a functional design-system UI at desktop and mobile sizes, upload is backed by the real file input/change handler, image detail remains usable, and package consumption builds without local source aliases.

## User outcome review

REJECT for the user-visible mobile outcome. The scoped delta itself correctly restores a hidden native `input[type=file]` wired to `useGalleryContent`'s existing ref and change handler. It builds a typed `CatalogDesktopViewProps` value and creates the mobile discriminated branch with `isMobile: true`, the mobile state, and the shared pane props. The mobile-only view-mode coercion prevents the unsupported stats mode from reaching the mobile view. Removing the Vite source aliases leaves normal package resolution in place.

The desktop capture shows the real Catalog shell, dataset pane, toolbar, image grid, class pane, and member card. The mobile capture shows the responsive header, dataset selector, and two-column image grid, but the package's bottom toolbar is below the captured viewport. The image-detail capture shows a fully composited modal with zoom/close controls, metadata, class state, comments, and editor controls. No capture suggests a screenshot substituted for component UI.

The blocker is not caused by the three-file merge-resolution delta. It is the integration of two preexisting height rules: `CatalogView.styles.ts` sets the Catalog `Page` to `height: 100vh`, while `ProtectedAppShell.styles.ts` adds `padding-top: 52px` to mobile `Main` and clips overflow. `CatalogMobileView.tsx` does render the `MobileBottomToolbar`, so its DOM presence does not establish visual reachability. The current browser regression only asserts the Open menu and image buttons for mobile and does not exercise the footer actions.

## Criterion review

- C1 — Catalog upload connection: PASS. `frontend/pages/CatalogPage.tsx` renders the native hidden file input and connects `fileInputRef` and `handleFileChange`; `/tmp/platform-merge-regression-final.log` reports `Upload quality dialog` and `Two images uploaded` PASS.
- C2 — Desktop/mobile prop compatibility: PASS. `frontend/modules/catalog/state/use-catalog-page-scene.tsx` explicitly constructs `CatalogDesktopViewProps` and a discriminated mobile `CatalogViewProps`; build log exits successfully and the fresh desktop/mobile captures render their intended layouts.
- C3 — Current UI package consumption: PASS. `frontend/vite.config.ts` removes the workspace-source aliases; `/tmp/platform-merge-build-final.log` records a successful TypeScript and Vite production build.
- C4 — Preserve upstream design/no fake UI: PASS. The delta adds no visual implementation, image-backed shell, hardcoded screen geometry, or duplicated design tokens. Captures show live component states and the regression log records interaction across selection, search, sort, upload, detail, zoom, comments, dialogs, and mobile usability.
- C5 — No blocking visual defect in supplied states: FAIL. The mobile toolbar is below the clipped viewport, making View, Filter, Sort, Export, and Upload unavailable in the supplied mobile state.

## Direct remove-ai-slops and programming pass

No excessive, tautological, deletion-only, removal-verification, or implementation-mirroring tests were added by the scoped delta. No unnecessary parser, normalizer, helper, extraction, defensive layer, escape hatch, broad cast, logger, or duplicated abstraction was introduced. The hidden input is necessary production wiring for the existing upload trigger. The discriminated union construction improves type precision without production scope drift. `git diff --check` passes.

The evidence directory did not contain a separate code-review report, so there is no independent report to confirm for explicit remove-ai-slops/programming coverage. This direct gate pass supplies that coverage. The requested criteria do not require a separate code-review artifact, so this is a note rather than a blocker.

## Checked artifacts

- `/home/homebodify/Projects/ingradient-platform/frontend/modules/catalog/state/use-catalog-page-scene.tsx`
- `/home/homebodify/Projects/ingradient-platform/frontend/pages/CatalogPage.tsx`
- `/home/homebodify/Projects/ingradient-platform/frontend/vite.config.ts`
- `git diff origin/main --` for the three scoped files
- `/tmp/ingradient-merge-20260908/catalog-desktop.png` — PNG 2560x1600, fresh after source
- `/tmp/ingradient-merge-20260908/catalog-mobile.png` — PNG 750x1624, fresh after source
- `/tmp/ingradient-merge-20260908/image-detail.png` — PNG 2560x1600, fresh after source
- `/tmp/ingradient-merge-20260908/metadata.json`
- `/tmp/platform-merge-regression-final.log` — 23 PASS, `UI_INTEGRATION_PASS`, exit 0 evidence
- `/tmp/platform-merge-build-final.log` — TypeScript/Vite production build PASS

## Exact evidence gaps

- No external visual baseline or reference image was supplied, so this review verifies functional integrity, responsive fit, compositing, and absence of blocking defects rather than pixel fidelity to a baseline.
- No separate code-review report or manual-QA matrix file exists in the supplied evidence directory; the regression log itself enumerates the 23 manual browser scenarios and this report performs the required direct skill-perspective review.
- The UI SHA was supplied as abbreviated `c210de1`; this gate did not independently resolve it in the separate UI repository because the assigned scope was the Platform merge delta and supplied captures.

These evidence gaps are notes. The recommendation is instead blocked by the directly observed and source-explained C5 failure above.
