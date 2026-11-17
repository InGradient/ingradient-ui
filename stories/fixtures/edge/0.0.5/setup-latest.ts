// Setup as in the real app on 2026-11-16 (ingradient-edge main 850387bb) — 0.0.6 stories only
// (WorkspaceSceneArgs.setupLatest). Labels from locales/en.json; numbers are synthetic and fixed.
import type {
  CaptureOptimizeLabels, FringeContrastCardLabels, OptimizeResult, OptimizeRow, SetupPanelLabels,
} from '@ingradient/edge-pages'
import { SETUP_PANEL_LABELS } from './setup'

export const SETUP_PANEL_LABELS_LATEST: SetupPanelLabels = {
  ...SETUP_PANEL_LABELS,
  solidExposurePct: 'Solid exposure',
  solidExposurePctDesc: 'Captures only the solid frame at this percentage of the fringe exposure. 100 means the same exposure. Lower it when a longer fringe exposure saturates the solid frame (recommended 60%).',
}

export const SETUP_UNSAVED_HINT = 'Unsaved changes — press [Save] to use them for capture. Capturing now uses the saved settings.'

export const FRINGE_CONTRAST_LABELS: FringeContrastCardLabels = {
  title: 'Fringe contrast',
  hint: 'Show the smooth stripes to see fringe contrast on the part.',
  none: 'No fringes visible — check the part and brightness.',
  best: (v) => `Best ${v}`,
  resetBest: 'Reset best',
  target: (pct, target) => `${pct}% of target ${target}`,
  noTarget: 'Target shown only for smooth stripes 12/24/48',
}

/** Stripe patterns that show the contrast card's numbers in the stories. */
export const FRINGE_CONTRAST_SAMPLE = { value: 0.214, target: 0.3, best: 0.231 }

export const CAPTURE_OPTIMIZE_LABELS: CaptureOptimizeLabels = {
  title: 'Find the best capture settings',
  desc: 'Shoots at several exposures and recommends the fastest setting that is good enough for judging (about 1 min).',
  needSave: 'Unsaved changes — press [Save] first.',
  needCamera: 'Connect a camera to use this.',
  confirmBody: 'Place a part on the jig, then start. About 45 photos are taken at 50–200 ms exposure and scored by the judge model (about 1 min).',
  doNotTouch: 'Do not touch the part, jig, camera or monitor until it finishes.',
  start: 'Start',
  stop: 'Stop',
  cancel: 'Cancel',
  close: 'Close',
  runningTitle: 'Finding capture settings',
  resultTitle: 'Recommended capture settings',
  notOk: 'No setting meets the threshold — this is the best of them. Check the notes below first.',
  current: 'Now',
  next: 'New',
  exposure: 'Exposure',
  avg: 'Averaging',
  brightnessMax: 'Pattern max',
  timeTitle: 'Estimated time',
  tCapture: 'Capture',
  tSave: 'Save',
  tJudge: 'Judge',
  tTotal: 'Total',
  manual: (n) => `Manual capture (${n} photos)`,
  auto: (n) => `Auto inspection (${n} photos)`,
  snr: 'S/N',
  sat: 'Saturated',
  brightnessA: 'Brightness',
  verdict: 'Result',
  pass: 'Pass',
  fail: { snr_low: 'Weak signal', saturated: 'Saturated', too_dark: 'Too dark', too_bright: 'Too bright' },
  warn: {
    contrast_low: 'Fringe contrast is low — check focus, monitor brightness, camera angle and distance.',
    focus_blur: 'Focus is blurred — adjust the lens focus.',
  },
  note: (snr) => `Threshold: S/N ≥ ${snr}, saturation and brightness range. Times were measured on this PC.`,
  apply: 'Apply',
  applyHint: '[Apply] changes exposure, averaging and pattern max and saves them for the next capture.',
  errorTitle: 'Could not find settings',
}

export const CAPTURE_OPTIMIZE_PROGRESS = { percent: 42, stage: 'Testing exposure 80 ms (pattern max 200) · 19/45' }
export const CAPTURE_OPTIMIZE_ERROR = { message: 'The part moved. Fix it in place and try again.' }

const times = (capture: number, save: number, judge: number) =>
  ({ capture_s: capture, save_s: save, judge_s: judge, total_s: Math.round((capture + save + judge) * 10) / 10 })

function row(exposure_ms: number, avg: number, brightness_max: number, snr: number, sat: number | null, a: number, fails: string[]): OptimizeRow {
  const capture = Math.round((exposure_ms * avg * 33) / 100) / 10
  return {
    exposure_ms, avg, brightness_max, snr, contrast: 0.21, sat_pct: sat, brightness_A: a, fails, ok: fails.length === 0,
    manual: times(capture, 1.4, 0.9), auto: times(Math.round(capture * 4.5) / 10, 0.6, 0.9),
  }
}

const ROWS: OptimizeRow[] = [
  row(50, 2, 255, 21.4, 0, 96, ['snr_low', 'too_dark']),
  row(80, 1, 230, 27.8, 0.02, 128, []),
  row(80, 2, 200, 31.2, 0, 118, []),
  row(120, 1, 200, 33.0, 0.4, 152, []),
  row(150, 1, 255, 34.1, 2.6, 201, ['saturated']),
  row(200, 1, 180, 35.2, 4.1, 226, ['saturated', 'too_bright']),
]

export const CAPTURE_OPTIMIZE_RESULT: OptimizeResult = {
  rows: ROWS,
  best: ROWS[1],
  warnings: ['contrast_low'],
  manual_frames: 33,
  auto_frames: 9,
  thresholds: { snr_min: 25 },
  current: { exposure_ms: 100, avg: 1, brightness_max: 255 },
}
