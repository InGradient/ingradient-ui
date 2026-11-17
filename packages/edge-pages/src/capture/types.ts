import type { ReactNode } from 'react'

// ── Core domain types (subset from edge capture.types) ────────────────────────

export const PATTERN_LABELS = ['x_orig', 'x_shift', 'y_orig', 'y_shift', 'solid'] as const
export const FOCUS_PEAKING_PATTERN = 'focus_peaking' as const

export type PatternLabel = (typeof PATTERN_LABELS)[number]
export type PreviewPatternLabel = PatternLabel | typeof FOCUS_PEAKING_PATTERN

export type SetupState =
  | 'idle' | 'preview_pattern' | 'running_sequence' | 'saving' | 'uploading' | 'done' | 'error'

export interface DeflectometryMetrics {
  has_camera: boolean
  fps: number | null
  exposure: number | null
  gain: number | null
  brightness: number | null
  contrast: number | null
  focus_score: number | null
  overexposed_pct: number | null
  underexposed_pct: number | null
  focus_overlay_data_url?: string | null
  focus_peaking_overlay_data_url?: string | null
  histogram_data_url?: string | null
  message?: string
}

export interface DeflectometryMonitor {
  id: string
  label: string
  mode?: string
}

export interface CameraParams {
  exposure: number
  exposureAuto: boolean
  /** Solid frame exposure as % of the fringe exposure (100 = same). Real app 2026-11. */
  solidExposurePct?: number
  gain: number
  frameRateEnabled: boolean
  frameRate: number
  gamma: number
  blackLevel: number
  sharpness: number
  pixelFormat: string
  roiEnabled: boolean
  roiX: number
  roiY: number
  roiWidth: number
  roiHeight: number
  triggerEnabled: boolean
  triggerSource: string
}

export interface SetupConfigState {
  fringePeriod: number
  gamma: number
  minBrightness: number
  maxBrightness: number
  settleDelayMs: number
  monitorTarget: string
  /** null = 프로젝트 기본값을 따른다. */
  phaseSteps: number | null
  /** 높낮이 방향은 기기 배치에 따라 뒤집힌다 — 현장에서 보정한다. */
  topoInvert: boolean
}

export interface DeflectometryConfigState {
  schema_version: string
  phase_shift_count: number
  capture_directions: 'x_only' | 'y_only' | 'both'
  include_solid: boolean
  include_black: boolean
  fringe_period_default: number
  exposure_per_pattern: 'same' | 'auto_hdr'
  sequence_retry_policy: number
  min_fringe_contrast: number
  max_saturation_pct: number
}

// ── Capture View ──────────────────────────────────────────────────────────────

export interface CaptureLabels {
  ready: string
  controls: string
  grid: string
  capture: string
  liveStream: string
  noPattern: string
  // states
  cameraReconnecting: string
  reconnectStream: string
  waitingFrames: string
  loadingStream: string
  connecting: string
  noCamera: string
  exitFullscreen: string
  enterFullscreen: string
  savingPreviousCapture: string
  // metrics
  brightness: string
  contrast: string
  focus: string
  overPct: string
  underPct: string
  // capturing text helper outputs (already translated)
  captureStepText: string
}

export interface CaptureViewProps {
  isConnected: boolean
  isConnecting: boolean
  isCapturing: boolean
  isSetupMode: boolean
  isSetupBusy: boolean
  isSavingSequence: boolean

  liveFrameSrc: string | null
  previewSrc: string | null
  frozenFrameSrc: string | null
  hasReceivedSnapshot: boolean
  snapshotError: string | null

  progressText: string
  captureStep: number | null
  captureTotalSteps: number | null

  setupMetrics: DeflectometryMetrics | null
  /** Wide fringe-contrast card under the setup metric cards (real app 2026-11). */
  fringeContrast?: FringeContrastCardViewProps
  previewPatternLabel: PreviewPatternLabel | null
  setupPatternLabel: PreviewPatternLabel | null
  captureDisabledReason: string | null
  captureStatusHint: string | null

  showGrid: boolean
  showControls: boolean

  labels: CaptureLabels

  onCapture: () => void
  onReconnect?: () => void
  onToggleGrid: () => void
  onToggleControls: () => void
}

// ── Capture Review Fullscreen ─────────────────────────────────────────────────

export interface CaptureReviewFullscreenLabels {
  exitFullscreen: string
  enterFullscreen: string
  skip: string
  save: string
}

export interface CaptureReviewFullscreenProps {
  src: string
  showSkip: boolean
  labels: CaptureReviewFullscreenLabels
  onSkip: () => void
  onSave: () => void
}

// ── Setup Panel ───────────────────────────────────────────────────────────────

export interface SetupPanelLabels {
  title: string
  save: string
  reset: string
  saved: string
  featuresTitle: string
  analysis: string

  cameraTuning: string
  /** Field shown when `showSolidExposure`; both labels are required then. */
  solidExposurePct?: string
  solidExposurePctDesc?: string
  livePreviewAvailable: string
  noCamera: string
  focusPeaking: string
  focusPeakingDesc: string
  exposure: string
  exposureDesc: string
  gain: string
  gainDesc: string
  whiteBalance: string
  whiteBalanceDesc: string
  autoCalibrate: string
  auto: string

  /** 고급 — 평소엔 접혀 있다. */
  advanced: string
  advancedImage: string
  advancedHardware: string
  /** 하드웨어 절은 아직 동작하지 않는다는 안내. */
  hardwareComingSoon: string
  frameRate: string
  frameRateDesc: string
  frameRateEnable: string
  gammaCamera: string
  gammaCameraDesc: string
  blackLevel: string
  blackLevelDesc: string
  sharpness: string
  sharpnessDesc: string
  pixelFormat: string
  pixelFormatDesc: string
  roi: string
  roiDesc: string
  hardwareTrigger: string
  hardwareTriggerDesc: string

  deflectometry: string
  fringePeriod: string
  phaseSteps: string
  /** 프로젝트 기본값을 쓰겠다는 선택지 문구. */
  phaseStepsProjectDefault: string
  topoInvert: string
  topoInvertHint: string
  gamma: string
  settleDelay: string
  measure: string
  measuring: string
  patternPreview: string
}

export interface SetupPanelViewProps {
  isConnected: boolean
  isSetupBusy: boolean
  isSetupSaved: boolean
  canSave: boolean
  canEditSetup: boolean
  progressText: string
  setupStatusMessage: string | null

  deflectometryEnabled: boolean
  deflectometryConfig: DeflectometryConfigState
  availableMonitors: DeflectometryMonitor[]
  isMeasuringSettleDelay: boolean

  setupConfig: SetupConfigState
  cameraParams: CameraParams

  previewPatternLabel: PreviewPatternLabel | null

  autoAnalyze: boolean
  enabledFeatures: Record<string, boolean>

  /** 화면에 세울 패턴 버튼 목록. 무엇을 찍을지는 프로젝트 설정·실험이 정하므로 앱이 계산한다. */
  previewPatternLabels: string[]
  /** "8-step · X + Y · total 34 patterns" 처럼 앱이 만든 한 줄 요약. */
  sequenceSummary: string
  pixelFormatOptions: { value: string; label: string }[]
  phaseStepOptions: number[]

  /** 프린지 미리보기 — 표본 계산이 촬영 백엔드와 같아야 해서 앱이 만들어 넣는다. */
  fringePreview?: React.ReactNode
  /** Features/Analysis toggles; the real app removed them (2026-11). Default true keeps 0.0.5. */
  showFeatureToggles?: boolean
  /** Shown under the header while edits are not saved yet. */
  unsavedHint?: string | null
  /** Slot under the Camera Tuning heading, e.g. CaptureOptimizeView. */
  captureOptimize?: React.ReactNode
  /** Solid exposure (%) field below Exposure. */
  showSolidExposure?: boolean
  /** 픽셀포맷 '선택값' 아래 '현재 카메라 값' 힌트 — 스토어를 읽어야 해서 앱이 만든다. */
  pixelFormatHint?: React.ReactNode

  labels: SetupPanelLabels

  onSave: () => void
  onReset: () => void
  onSetSetupConfig: React.Dispatch<React.SetStateAction<SetupConfigState>>
  onUpdateCameraParams: React.Dispatch<React.SetStateAction<CameraParams>>
  onWhiteBalanceCalibrate: () => void
  onPreviewPattern: (pattern: PreviewPatternLabel | null) => void
  onMeasureSettleDelay: () => void
  onAutoAnalyzeChange: (value: boolean) => void
  onEnabledFeaturesChange: (value: Record<string, boolean>) => void
}

// ── Sequence Pattern Panel ────────────────────────────────────────────────────

export interface PatternImage {
  imageId: string
  patternLabel: string | null
  sequenceStep: number | null
  width: number | null
  height: number | null
}

export type SequenceViewMode = 'originals' | 'derived'

export interface SequencePatternPanelLabels {
  originals: string
  derived: string
  noOriginals: string
  noDerived: string
  patternHint: Record<string, string>
}

export interface SequencePatternPanelViewProps {
  images: PatternImage[]
  activeImageId: string | null
  viewMode: SequenceViewMode
  enabledFeatures: Record<string, boolean>
  labels: SequencePatternPanelLabels
  tuningControls?: ReactNode
  onSelectImage: (imageId: string) => void
  onSetViewMode: (mode: SequenceViewMode) => void
}

// ── Deflectometry Tuning Controls ─────────────────────────────────────────────

import type { ColormapName, DerivedKind } from './colormap-helpers'

export interface DeflectometryTuningControlsLabels {
  title: string
  reset: string
  analyze: string
  analyzing: string
  saveDefault: string
  saveDefaultSaving: string
  modulationThreshold: string
  modulationOverlay: string
  colormapSection: string
  confidence: string
  computing: string
  validRatio: string
  warnLowConfidence: string
}

export interface TuningQualityMetrics {
  validRatio: number | null
  confidenceStatus: 'good' | 'fair' | 'poor' | null
  warnings: string[]
}

export interface DeflectometryTuningControlsViewProps {
  disabled: boolean
  expanded: boolean
  activeDerivedKind: DerivedKind | null

  modulationThreshold: number
  modulationOverlayEnabled: boolean
  colormaps: Record<DerivedKind, ColormapName>

  isRecomputing: boolean
  isAutoTuning: boolean
  isSavingDefault: boolean
  metrics: TuningQualityMetrics | null

  labels: DeflectometryTuningControlsLabels

  onToggleExpanded: () => void
  onModulationThresholdChange: (value: number) => void
  onModulationOverlayChange: (value: boolean) => void
  onColormapChange: (kind: DerivedKind, name: ColormapName) => void
  onRecompute: () => void
  onSaveDefault: () => void
  onReset: () => void
}

// ── Fringe contrast card (real app: FringeContrastCard) ─────────────────────

export interface FringeContrastCardLabels {
  title: string
  /** Shown when the tuning stripes are not on screen. */
  hint: string
  none: string
  best: (value: string) => string
  resetBest: string
  target: (pct: number, target: number) => string
  noTarget: string
}

export interface FringeContrastCardViewProps {
  /** Contrast inside the part (amplitude ÷ brightness) and the training target, if the stripe has one. */
  contrast: { value: number; target: number | null } | null
  /** Best value seen while adjusting; caller tracks and resets it. */
  best: number | null
  /** The tuning stripes are on screen; otherwise the card only shows the hint. */
  isStripe: boolean
  labels: FringeContrastCardLabels
  onResetBest: () => void
}

// ── Capture optimize (real app: CaptureOptimizeSection) ─────────────────────

export interface OptimizeTimes { capture_s: number; save_s: number; judge_s: number; total_s: number }
export interface OptimizeRow {
  exposure_ms: number
  avg: number
  brightness_max: number
  snr: number
  contrast: number | null
  sat_pct: number | null
  brightness_A: number | null
  fails: string[]
  ok: boolean
  manual: OptimizeTimes
  auto: OptimizeTimes
}
export interface OptimizeResult {
  rows: OptimizeRow[]
  best: OptimizeRow | null
  warnings: string[]
  manual_frames: number
  auto_frames: number
  thresholds: { snr_min: number }
  current: { exposure_ms: number | null; avg: number; brightness_max: number }
}
export type CaptureOptimizePhase = 'idle' | 'confirm' | 'running' | 'result' | 'error'

export interface CaptureOptimizeLabels {
  title: string
  desc: string
  needSave: string
  needCamera: string
  confirmBody: string
  doNotTouch: string
  start: string
  stop: string
  cancel: string
  close: string
  runningTitle: string
  resultTitle: string
  notOk: string
  current: string
  next: string
  exposure: string
  avg: string
  brightnessMax: string
  timeTitle: string
  tCapture: string
  tSave: string
  tJudge: string
  tTotal: string
  manual: (n: number) => string
  auto: (n: number) => string
  snr: string
  sat: string
  brightnessA: string
  verdict: string
  pass: string
  fail: Record<string, string>
  warn: Record<string, string>
  note: (snrMin: number) => string
  apply: string
  applyHint: string
  errorTitle: string
}

export interface CaptureOptimizeViewProps {
  phase: CaptureOptimizePhase
  isConnected: boolean
  isSetupBusy: boolean
  /** Unsaved setup edits: the search runs on saved settings, so it is blocked until Save. */
  setupDirty: boolean
  /** Running: 0–100 and the current stage sentence (e.g. "Testing exposure 80 ms (pattern max 200) · 12/45"). */
  progress?: { percent: number; stage: string }
  result?: OptimizeResult | null
  /** Error phase: the reason sentence and an optional raw detail. */
  error?: { message: string; detail?: string }
  labels: CaptureOptimizeLabels
  onOpen: () => void
  onCancel: () => void
  onStart: () => void
  onStop: () => void
  onApply: () => void
}
