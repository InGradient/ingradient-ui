// Setup 탭 — 우측 패널에 서는 셋업 패널. 촬영 조건을 여기서 정한다.
import { useState } from 'react'
import {
  FringeProfilePreviewView, SetupPanelView,
  type CameraParams, type SetupConfigState,
} from '@ingradient/edge-pages'
import {
  PATTERN_LABELS, PHASE_STEP_OPTIONS, PIXEL_FORMAT_OPTIONS, SEQUENCE_SUMMARY,
  SETUP_CAMERA_PARAMS, SETUP_CONFIG, SETUP_PANEL_LABELS,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined
const PREVIEW_WINDOW_PX = 256

/** 화면에 뜰 프린지의 밝기 단면. 계산은 촬영 백엔드와 같아야 해서 앱이 만들어 넣는다. */
function fringeValues(period: number): number[] {
  return Array.from({ length: PREVIEW_WINDOW_PX }, (_, i) => {
    const stripe = 0.5 * (1 + Math.sin((2 * Math.PI * i) / period))
    return Math.min(255, Math.max(0, Math.round(16 + stripe ** (1 / 2.2) * 239)))
  })
}

export function SetupContent(): JSX.Element {
  const [setupConfig, setSetupConfig] = useState<SetupConfigState>(SETUP_CONFIG)
  const [cameraParams, setCameraParams] = useState<CameraParams>(SETUP_CAMERA_PARAMS)
  const [previewPattern, setPreviewPattern] = useState<string | null>(null)
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({})

  return (
    <SetupPanelView
      isConnected
      isSetupBusy={false}
      isSetupSaved={false}
      canSave
      canEditSetup
      progressText=""
      setupStatusMessage={null}
      deflectometryEnabled
      deflectometryConfig={{} as never}
      availableMonitors={[]}
      isMeasuringSettleDelay={false}
      setupConfig={setupConfig}
      cameraParams={cameraParams}
      previewPatternLabel={previewPattern as never}
      previewPatternLabels={PATTERN_LABELS}
      sequenceSummary={SEQUENCE_SUMMARY}
      pixelFormatOptions={PIXEL_FORMAT_OPTIONS}
      phaseStepOptions={PHASE_STEP_OPTIONS}
      fringePreview={(
        <FringeProfilePreviewView
          values={fringeValues(setupConfig.fringePeriod)}
          windowPx={PREVIEW_WINDOW_PX}
          labels={{
            caption: `${PREVIEW_WINDOW_PX}px window · period ${setupConfig.fringePeriod}`,
            zoom: 'Click to enlarge',
            zoomTitle: `Fringe preview — period ${setupConfig.fringePeriod}`,
            close: 'Close',
          }}
        />
      )}
      autoAnalyze
      enabledFeatures={enabledFeatures}
      labels={SETUP_PANEL_LABELS}
      onSave={noop}
      onReset={noop}
      onSetSetupConfig={setSetupConfig}
      onUpdateCameraParams={setCameraParams}
      onWhiteBalanceCalibrate={noop}
      onPreviewPattern={(p) => setPreviewPattern(p)}
      onMeasureSettleDelay={noop}
      onAutoAnalyzeChange={noop}
      onEnabledFeaturesChange={setEnabledFeatures}
    />
  )
}
