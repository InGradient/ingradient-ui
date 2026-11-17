// Deterministic UI simulation; these values do not validate physical equipment.
import { useState } from 'react'
import {
  CaptureOptimizeView, FringeProfilePreviewView, SetupPanelView,
  type CameraParams, type CaptureOptimizePhase, type SetupConfigState, type PreviewPatternLabel,
} from '@ingradient/edge-pages'
import {
  PATTERN_LABELS, PHASE_STEP_OPTIONS, PIXEL_FORMAT_OPTIONS,
  SETUP_CAMERA_PARAMS, SETUP_CONFIG, SETUP_PANEL_LABELS,
  CAPTURE_OPTIMIZE_ERROR, CAPTURE_OPTIMIZE_LABELS, CAPTURE_OPTIMIZE_PROGRESS, CAPTURE_OPTIMIZE_RESULT,
  SETUP_PANEL_LABELS_LATEST, SETUP_UNSAVED_HINT,
} from '../../../../fixtures/edge/0.0.5'
import type { MockAction } from '../settings/tabs-moved'

const PREVIEW_WINDOW_PX = 256 // Number of 8-bit intensity samples, not layout geometry.

export function fringeValues(config: SetupConfigState): number[] {
  const { fringePeriod, gamma, minBrightness, maxBrightness } = config
  return Array.from({ length: PREVIEW_WINDOW_PX }, (_, i) => {
    const stripe = 0.5 * (1 + Math.sin((2 * Math.PI * i) / Math.max(1, fringePeriod)))
    return Math.min(255, Math.max(0, Math.round(minBrightness + stripe ** (1 / Math.max(0.1, gamma)) * (maxBrightness - minBrightness))))
  })
}

export function sequenceSummary(config: SetupConfigState): string {
  // Fixture assumption: two directions and one solid frame; project default is 16 phases.
  const steps = config.phaseSteps ?? 16
  return `${steps}-step · X + Y · solid · total ${steps * 2 + 1} patterns (simulation)`
}

export function SetupContent({ previewPatternLabel, onPreviewPattern, latest = false, optimizePhase = 'idle', onMockAction }: {
  previewPatternLabel?: PreviewPatternLabel | null
  onPreviewPattern?: (pattern: PreviewPatternLabel | null) => void
  /** Real app 2026-11-16 Setup (0.0.6). */
  latest?: boolean
  optimizePhase?: CaptureOptimizePhase
  onMockAction?: MockAction
} = {}): JSX.Element {
  const [phase, setPhase] = useState<CaptureOptimizePhase>(optimizePhase)
  const [dirty, setDirty] = useState(false)
  const [setupConfig, setSetupConfig] = useState<SetupConfigState>(SETUP_CONFIG)
  const [cameraParams, setCameraParams] = useState<CameraParams>(SETUP_CAMERA_PARAMS)
  const [localPattern, setLocalPattern] = useState<PreviewPatternLabel | null>(null)
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({})
  const [autoAnalyze, setAutoAnalyze] = useState(true)
  const [saved, setSaved] = useState(false)
  const [status, setStatus] = useState<string | null>('Simulation — no device commands or persistence')
  const selectPattern = (pattern: PreviewPatternLabel | null) => { setLocalPattern(pattern); onPreviewPattern?.(pattern) }

  return (
    <SetupPanelView
      isConnected
      isSetupBusy={false}
      isSetupSaved={saved}
      canSave
      canEditSetup
      progressText=""
      setupStatusMessage={status}
      deflectometryEnabled
      deflectometryConfig={{ schema_version: 'simulation', phase_shift_count: 16, capture_directions: 'both', include_solid: true, include_black: false, fringe_period_default: 24, exposure_per_pattern: 'same', sequence_retry_policy: 0, min_fringe_contrast: 0, max_saturation_pct: 100 }}
      availableMonitors={[]}
      isMeasuringSettleDelay={false}
      setupConfig={setupConfig}
      cameraParams={cameraParams}
      previewPatternLabel={previewPatternLabel === undefined ? localPattern : previewPatternLabel}
      previewPatternLabels={PATTERN_LABELS}
      sequenceSummary={sequenceSummary(setupConfig)}
      pixelFormatOptions={PIXEL_FORMAT_OPTIONS}
      phaseStepOptions={PHASE_STEP_OPTIONS}
      fringePreview={(
        <FringeProfilePreviewView
          values={fringeValues(setupConfig)}
          windowPx={PREVIEW_WINDOW_PX}
          labels={{
            caption: `Simulation · ${PREVIEW_WINDOW_PX}px window · period ${setupConfig.fringePeriod} · gamma ${setupConfig.gamma}`,
            zoom: 'Click to enlarge',
            zoomTitle: `Fringe preview — period ${setupConfig.fringePeriod} · gamma ${setupConfig.gamma}`,
            close: 'Close',
          }}
        />
      )}
      autoAnalyze={autoAnalyze}
      enabledFeatures={enabledFeatures}
      labels={latest ? SETUP_PANEL_LABELS_LATEST : SETUP_PANEL_LABELS}
      showFeatureToggles={!latest}
      showSolidExposure={latest}
      unsavedHint={latest && dirty ? SETUP_UNSAVED_HINT : null}
      captureOptimize={latest ? (
        <CaptureOptimizeView
          phase={phase} isConnected isSetupBusy={false} setupDirty={dirty}
          progress={CAPTURE_OPTIMIZE_PROGRESS} result={CAPTURE_OPTIMIZE_RESULT} error={CAPTURE_OPTIMIZE_ERROR}
          labels={CAPTURE_OPTIMIZE_LABELS}
          onOpen={() => { setPhase('confirm'); onMockAction?.('optimize-open') }}
          onCancel={() => { setPhase('idle'); onMockAction?.('optimize-cancel') }}
          onStart={() => { setPhase('running'); onMockAction?.('optimize-start') }}
          onStop={() => { setPhase('idle'); setStatus('Simulation: capture-settings search stopped'); onMockAction?.('optimize-stop') }}
          onApply={() => {
            const best = CAPTURE_OPTIMIZE_RESULT.best
            if (best) setCameraParams((p) => ({ ...p, exposure: best.exposure_ms * 1000 }))
            setPhase('idle'); setSaved(true); setDirty(false)
            setStatus('Simulation: recommended settings applied and saved in this story only'); onMockAction?.('optimize-apply')
          }}
        />
      ) : undefined}
      onSave={() => { setSaved(true); setDirty(false); setStatus('Simulation: setup saved in this story only') }}
      onReset={() => { setSetupConfig(SETUP_CONFIG); setCameraParams(SETUP_CAMERA_PARAMS); setEnabledFeatures({}); setAutoAnalyze(true); selectPattern(null); setSaved(false); setDirty(false); setStatus('Simulation: defaults restored') }}
      onSetSetupConfig={(update) => { setSetupConfig(update); setSaved(false); setDirty(true) }}
      onUpdateCameraParams={(update) => { setCameraParams(update); setSaved(false); setDirty(true) }}
      onWhiteBalanceCalibrate={() => { setStatus('Simulation: white balance calibration completed; no camera command sent'); setSaved(false) }}
      onPreviewPattern={selectPattern}
      onMeasureSettleDelay={() => { setSetupConfig((current) => ({ ...current, settleDelayMs: 80 })); setStatus('Simulation: settle delay set to fixture estimate 80 ms; not physically measured'); setSaved(false) }}
      onAutoAnalyzeChange={(value) => { setAutoAnalyze(value); setSaved(false) }}
      onEnabledFeaturesChange={(value) => { setEnabledFeatures(value); setSaved(false) }}
    />
  )
}
