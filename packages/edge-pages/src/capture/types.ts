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
  autoAnalyze: string
  autoAnalyzeHint: string
  featuresTitle: string
  analysis: string
  cameraTuning: string
  livePreviewAvailable: string
  noCamera: string
  focusPeaking: string
  focusPeakingDesc: string
  exposure: string
  gain: string
  whiteBalance: string
  autoCalibrate: string
  auto: string
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
