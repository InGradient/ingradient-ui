/**
 * Edge feature geometry — owned by `@ingradient/edge-pages` (Layer Chain Audit F-07).
 *
 * These dimensions describe specific Edge screens (capture bar, live-preview grid,
 * histogram overlay, dataset cards, log detail popover). They are not part of the
 * generic `@ingradient/ui` layout scale, so they live with the package that uses them.
 *
 * Values are identical to the deprecated core `layoutScale` entries they replace;
 * the matching `--ig-layout-*` CSS variables remain in core until their scheduled removal.
 * Internal to the package: not re-exported from `src/index.ts`.
 */
export const edgeGeometry = {
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
} as const
