/**
 * Edge feature geometry — owned by `@ingradient/edge-pages` (Layer Chain Audit F-07).
 *
 * These dimensions describe specific Edge screens (capture bar, live-preview grid,
 * histogram overlay, dataset cards, log detail popover). They are not part of the
 * generic `@ingradient/ui` layout scale, so they live with the package that uses them.
 *
 * Every value is on the 4px grid (geometry.test.ts). On 2026-11-01 the log time column
 * (45→44px) and the log detail position (left 254→256px, top 58→56px) were rounded to it, so
 * those three no longer match the deprecated core `layoutScale` entries; the matching
 * `--ig-layout-*` CSS variables remain in core until their scheduled removal.
 * Internal to the package: not re-exported from `src/index.ts`.
 */
export const edgeGeometry = {
  captureBar: '100px',
  captureGrid: '100px',
  histogramWidth: '224px',
  histogramHeight: '84px',
  datasetCardMinHeight: '112px',
  datasetCardRecentMinHeight: '108px',
  logTimeMin: '44px',
  logDetailLeft: '256px',
  logDetailTop: '56px',
  logDetailWidth: '272px',
} as const
