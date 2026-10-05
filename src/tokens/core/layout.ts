/**
 * Generic layout scale tokens.
 *
 * ## F-07 status (Layer Chain Audit 2026-06-21)
 *
 * Phase 1 (done, 2026-10-05): every consumer reads its geometry from the owner —
 * `@ingradient/edge-pages` `src/geometry.ts` (`edgeGeometry`) and the
 * `color-editor-plane` pattern (`colorEditorGeometry`). Nothing in this repository
 * reads the entries marked deprecated below or their `--ig-layout-*` variables.
 *
 * Phase 2 (next breaking release): delete the deprecated entries here and their
 * `--ig-layout-*` lines in `token-css-variables.ts`; note the removal from the
 * published `lib/tokens.css` in the release notes. Values are kept identical meanwhile.
 *
 * Do not add product-specific tokens to this file — add them to the owning package.
 */

export const layoutScale = {
  // 일반 layout dimensions
  pageMaxWidth: '1280px',
  topbarHeight: '80px',
  sidebarHeader: '72px',
  sidebarCollapse: '100px',
  panelMinHeight: '300px',
  loadingPanelHeight: '180px',
  // Shadow offsets (modal/dialog floating shadow 정의)
  shadowYOffset: '40px',
  shadowBlur: '80px',
  // Form-specific (label column width in vertical form layout)
  formLabelCol: '140px',
  formLabelColWide: '160px',

  // --- @deprecated F-07: Edge feature geometry now lives in @ingradient/edge-pages `edgeGeometry`. Removal: next breaking release. ---
  captureBar: '100px',
  captureGrid: '100px',
  histogramWidth: '224px',
  histogramHeight: '84px',
  datasetCardMinHeight: '112px',
  datasetCardRecentMinHeight: '108px',
  logTimeMin: '45px',
  logDetailLeft: '254px',
  logDetailTop: '58px',
  logDetailWidth: '272px',
  // --- @deprecated F-07: owned by the color-editor-plane pattern (`colorEditorGeometry`). Removal: next breaking release. ---
  colorPlaneHeight: '120px',
  colorThumbSize: '18px',
} as const