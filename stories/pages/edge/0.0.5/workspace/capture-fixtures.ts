import type { BBox, BBoxCanvasLabels, LogPanelEntry } from '@ingradient/edge-pages'

// SVG intensities and geometry are synthetic image data, not UI styling tokens.
export const SYNTHETIC_CAPTURE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><defs><pattern id="fringe" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="16" height="32" fill="rgb(210,210,210)"/><rect x="16" width="16" height="32" fill="rgb(60,60,60)"/></pattern></defs><rect width="640" height="480" fill="url(#fringe)"/><circle cx="320" cy="240" r="80" fill="rgb(140,140,140)"/></svg>')}`
export const SIMULATION_LOGS: LogPanelEntry[] = [
  { type: 'success', msg: '[12:00:00] Capture saved. Synthetic sample', detail: 'Source: synthetic fixture\nResult: simulated success', imagePath: 'simulation://capture', createdAt: '2026-09-20T12:00:00' },
  { type: 'info', msg: '[12:01:00] Broadcasting simulated discovery', createdAt: '2026-09-20T12:01:00' },
  { type: 'info', msg: '[12:02:00] Connection established (simulation)', createdAt: '2026-09-19T12:02:00' },
  { type: 'info', msg: '[12:03:00] [DEBUG] Simulated diagnostic trace', createdAt: '2026-08-01T12:03:00' },
]
export const LABELING_BOXES: BBox[] = [{ x: 0.25, y: 0.25, w: 0.3, h: 0.3, classId: 'c1' }]
export const LABELING_LABELS: BBoxCanvasLabels = {
  save: 'Save labels', skip: 'Skip labeling', retry: 'Retry labeling', reset: 'Reset boxes',
  enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen', bboxCount: (count) => `${count} boxes`,
  blockMsgRequireLabel: 'Draw at least one box', blockMsgRequireMinBbox: (count) => `Draw ${count} boxes`,
  hint: 'Simulation: drag to draw or select a box; wheel to zoom. No equipment or persistence.',
  showAnnotations: 'Show annotations', hideAnnotations: 'Hide annotations', cursorMode: 'Select boxes', bboxMode: 'Draw boxes',
}
