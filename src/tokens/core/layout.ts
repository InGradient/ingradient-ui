/**
 * Generic layout scale tokens.
 *
 * ## F-07 split plan (Layer Chain Audit 2026-06-21)
 *
 * The tokens below `// Edge feature geometry` are product-specific dimensions
 * used almost exclusively by `@ingradient/edge-pages`. They remain in core
 * because the CSS variable generation pipeline (`token-css-variables.ts`)
 * derives `--ig-layout-*` custom properties from this single registry.
 *
 * Migration plan (deferred to a follow-up after Phase 4):
 * 1. Create `packages/edge-pages/src/tokens/layout.ts` with Edge-specific geometry.
 * 2. Add an edge-pages CSS variable generation step or a runtime theme extension.
 * 3. Move `captureBar`, `captureGrid`, `histogramWidth`, `histogramHeight`,
 *    `logTimeMin`, `logDetailLeft/Top/Width` to the edge-pages registry.
 * 4. Move `colorPlaneHeight`, `colorThumbSize` to `src/patterns/forms/` or
 *    keep in core if `color-editor-plane` remains a shared pattern.
 * 5. Evaluate whether `datasetCardMinHeight` / `datasetCardRecentMinHeight`
 *    belong in edge-pages or platform-pages (currently only edge uses them).
 * 6. Remove migrated tokens from this file and from `token-css-variables.ts`.
 *
 * Until the migration is complete, these tokens stay here to avoid breaking
 * the CSS variable pipeline. Do not add new product-specific tokens to this
 * file — add them to the owning package instead.
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

  // --- Edge feature geometry (F-07: migrate to edge-pages) ---
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
  // --- Pattern feature geometry (F-07: evaluate ownership) ---
  colorPlaneHeight: '120px',
  colorThumbSize: '18px',
} as const