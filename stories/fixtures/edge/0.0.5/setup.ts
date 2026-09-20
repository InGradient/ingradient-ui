// Setup 탭 fixture — 카메라 조정 · 고급 · Deflectometry.
import type { CameraParams, SetupConfigState, SetupPanelLabels } from '@ingradient/edge-pages'

export const SETUP_PANEL_LABELS: SetupPanelLabels = {
  title: 'Setup',
  save: 'Save',
  reset: 'Reset',
  saved: 'Saved',
  featuresTitle: 'Features',
  analysis: 'Analysis',
  cameraTuning: 'Camera Tuning',
  livePreviewAvailable: 'Live preview is available.',
  noCamera: 'No active camera. Test Shot and sequence are disabled.',
  focusPeaking: 'Focus Peaking',
  focusPeakingDesc: 'Highlights in-focus edges to aid manual focus adjustment.',
  exposure: 'Exposure (s)',
  exposureDesc: 'Controls how long the sensor gathers light per frame. Enable Auto to let the camera adjust automatically.',
  gain: 'Gain (dB)',
  gainDesc: 'Amplifies the sensor signal. Higher values increase brightness but add noise.',
  whiteBalance: 'White Balance',
  whiteBalanceDesc: 'Adjusts color channels so that neutral colors appear neutral under the current lighting.',
  autoCalibrate: 'Auto Calibrate',
  auto: 'Auto',
  advanced: 'Advanced',
  advancedImage: 'Image',
  advancedHardware: 'Hardware',
  hardwareComingSoon: 'These features require external hardware integration.',
  frameRate: 'Frame Rate (fps)',
  frameRateDesc: "Limits the capture frame rate. Disable to use the camera's maximum rate.",
  frameRateEnable: 'Enable',
  gammaCamera: 'Gamma',
  gammaCameraDesc: 'Adjusts the luminance curve of the sensor output. 1.0 is linear (default).',
  blackLevel: 'Black Level',
  blackLevelDesc: 'Sets the baseline brightness offset of the sensor. Increase to lift shadows in dark scenes.',
  sharpness: 'Sharpness',
  sharpnessDesc: 'Enhances edge contrast. High values may introduce artifacts.',
  pixelFormat: 'Pixel Format',
  pixelFormatDesc: 'Controls the raw data format output from the sensor. Mono 8-bit is recommended for grayscale inspection.',
  roi: 'Region of Interest (ROI)',
  roiDesc: 'Reads only a portion of the sensor to increase processing speed. Requires external hardware integration.',
  hardwareTrigger: 'Hardware Trigger',
  hardwareTriggerDesc: 'Starts capture from an external signal. Use with conveyors, PLCs, or other external devices.',
  deflectometry: 'Deflectometry',
  fringePeriod: 'Fringe Period',
  phaseSteps: 'Phase Steps',
  phaseStepsProjectDefault: 'Project default',
  topoInvert: 'Topography Invert',
  topoInvertHint: 'Flip high/low color direction',
  gamma: 'Gamma',
  settleDelay: 'Settle Delay (ms)',
  measure: 'Measure',
  measuring: 'Measuring...',
  patternPreview: 'Pattern Preview',
}

export const PIXEL_FORMAT_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'Mono8', label: 'Mono 8-bit' },
  { value: 'Mono12', label: 'Mono 12-bit (precision)' },
  { value: 'BayerRG8', label: 'Bayer RG 8-bit' },
]

export const PHASE_STEP_OPTIONS = [2, 4, 8, 16]

/** 노출 100ms · gain 0 · Mono12 — 12비트 이득은 저게인 조건에서만 나온다. */
export const SETUP_CAMERA_PARAMS: CameraParams = {
  exposure: 100_000,
  exposureAuto: false,
  gain: 0,
  frameRateEnabled: false,
  frameRate: 30,
  gamma: 1,
  blackLevel: 0,
  sharpness: 0,
  pixelFormat: 'Mono12',
  roiEnabled: false, roiX: 0, roiY: 0, roiWidth: 0, roiHeight: 0,
  triggerEnabled: false, triggerSource: 'Line1',
}

export const SETUP_CONFIG: SetupConfigState = {
  fringePeriod: 24,
  gamma: 2.2,
  minBrightness: 16,
  maxBrightness: 255,
  settleDelayMs: 120,
  monitorTarget: 'auto',
  phaseSteps: 16,
  topoInvert: false,
}

export const SEQUENCE_SUMMARY = '16-step · X + Y · solid · total 33 patterns'
