// Setup 탭 content — 카메라/deflectometry 셋업 패널.
import { useState } from 'react'
import {
  SetupPanelView,
  type SetupPanelLabels,
  type SetupConfigState,
  type CameraParams,
  type DeflectometryConfigState,
  type DeflectometryMonitor,
} from '@ingradient/edge-pages'

const SETUP_LABELS: SetupPanelLabels = {
  title: 'Camera setup', save: 'Save', reset: 'Reset', saved: 'Saved',
  autoAnalyze: 'Auto analyze', autoAnalyzeHint: 'Run analysis after each capture',
  featuresTitle: 'Features', analysis: 'Analysis', cameraTuning: 'Camera tuning',
  livePreviewAvailable: 'Live preview available', noCamera: 'No camera connected',
  focusPeaking: 'Focus peaking', focusPeakingDesc: 'Highlight in-focus edges',
  exposure: 'Exposure', gain: 'Gain', whiteBalance: 'White balance',
  autoCalibrate: 'Auto calibrate', auto: 'Auto',
}

const DEFLECTOMETRY_CONFIG: DeflectometryConfigState = {
  schema_version: '1.0', phase_shift_count: 4, capture_directions: 'both',
  include_solid: true, include_black: false, fringe_period_default: 24,
  exposure_per_pattern: 'same', sequence_retry_policy: 1,
  min_fringe_contrast: 0.2, max_saturation_pct: 1.5,
}

const MONITORS: DeflectometryMonitor[] = [
  { id: 'mon-1', label: 'Display 1 (primary)', mode: '1920x1080@60' },
  { id: 'mon-2', label: 'Display 2', mode: '2560x1440@60' },
]

const INITIAL_SETUP_CONFIG: SetupConfigState = {
  fringePeriod: 24, gamma: 2.2, minBrightness: 12, maxBrightness: 235,
  settleDelayMs: 80, monitorTarget: 'mon-1',
}

const INITIAL_CAMERA_PARAMS: CameraParams = {
  exposure: 50000, exposureAuto: false, gain: 300, frameRateEnabled: true,
  frameRate: 30, gamma: 1, blackLevel: 4, sharpness: 2, pixelFormat: 'Mono8',
  roiEnabled: false, roiX: 0, roiY: 0, roiWidth: 1920, roiHeight: 1080,
  triggerEnabled: false, triggerSource: 'Software',
}

export function SetupContent(): JSX.Element {
  const [setupConfig, setSetupConfig] = useState<SetupConfigState>(INITIAL_SETUP_CONFIG)
  const [cameraParams, setCameraParams] = useState<CameraParams>(INITIAL_CAMERA_PARAMS)
  const [autoAnalyze, setAutoAnalyze] = useState(true)
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({
    focus_peaking: true, analysis: true,
  })
  return (
    <SetupPanelView
      isConnected
      isSetupBusy={false}
      isSetupSaved={false}
      canSave
      canEditSetup
      progressText="Ready"
      setupStatusMessage={null}
      deflectometryEnabled
      deflectometryConfig={DEFLECTOMETRY_CONFIG}
      availableMonitors={MONITORS}
      isMeasuringSettleDelay={false}
      setupConfig={setupConfig}
      cameraParams={cameraParams}
      previewPatternLabel={null}
      autoAnalyze={autoAnalyze}
      enabledFeatures={enabledFeatures}
      labels={SETUP_LABELS}
      onSave={() => undefined}
      onReset={() => undefined}
      onSetSetupConfig={setSetupConfig}
      onUpdateCameraParams={setCameraParams}
      onWhiteBalanceCalibrate={() => undefined}
      onPreviewPattern={() => undefined}
      onMeasureSettleDelay={() => undefined}
      onAutoAnalyzeChange={setAutoAnalyze}
      onEnabledFeaturesChange={setEnabledFeatures}
    />
  )
}
