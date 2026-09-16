// Setup 패널 전체 — 분석 항목 · 카메라 조정 · 고급(이미지·하드웨어) · Deflectometry · 패턴 미리보기.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { SetupPanelView } from './SetupPanelView'
import { FringeProfilePreviewView } from './FringeProfilePreviewView'
import type { CameraParams, SetupConfigState } from './types'

const LABELS = {
  title: 'Setup', save: '저장', reset: '초기화', saved: '저장됨',
  featuresTitle: '분석 항목', analysis: '분석',
  cameraTuning: '카메라 조정',
  livePreviewAvailable: '라이브 프리뷰로 확인할 수 있다',
  noCamera: '카메라가 연결되지 않았다',
  focusPeaking: '초점 강조', focusPeakingDesc: '초점이 맞은 가장자리를 색으로 덧칠해 보여준다',
  exposure: '노출', exposureDesc: '길수록 밝지만 움직임에 번진다',
  gain: '게인', gainDesc: '올리면 밝아지지만 노이즈도 같이 올라간다',
  whiteBalance: '화이트 밸런스', whiteBalanceDesc: '흰 종이를 놓고 한 번 맞춘다',
  autoCalibrate: '자동 보정', auto: '자동',
  advanced: '고급', advancedImage: '이미지', advancedHardware: '하드웨어',
  hardwareComingSoon: '아직 지원하지 않는다 — 카메라 한계가 아니라 준비 중이다',
  frameRate: '프레임 레이트', frameRateDesc: '초당 장수 상한', frameRateEnable: '제한 사용',
  gammaCamera: '카메라 감마', gammaCameraDesc: '카메라가 내보내는 밝기 곡선',
  blackLevel: '블랙 레벨', blackLevelDesc: '가장 어두운 값의 기준',
  sharpness: '샤프니스', sharpnessDesc: '가장자리 강조 — 분석에는 끄는 쪽이 낫다',
  pixelFormat: '픽셀 포맷', pixelFormatDesc: 'Mono12 는 저게인·장노출에서만 이득이 있다',
  roi: 'ROI', roiDesc: '센서 일부만 읽어 빠르게 — 준비 중',
  hardwareTrigger: '하드웨어 트리거', hardwareTriggerDesc: '외부 신호로 촬영 — 준비 중',
  deflectometry: 'Deflectometry',
  fringePeriod: '프린지 주기', phaseSteps: '위상 스텝',
  phaseStepsProjectDefault: '프로젝트 기본값',
  topoInvert: '높낮이 반전', topoInvertHint: '오목/볼록이 반대로 보이면 켠다',
  gamma: '감마', settleDelay: '안정화 대기(ms)', measure: '측정', measuring: '측정 중',
  patternPreview: '패턴 미리보기',
}

const CAMERA_PARAMS: CameraParams = {
  exposure: 25_000, exposureAuto: false, gain: 0,
  frameRateEnabled: false, frameRate: 30, gamma: 1, blackLevel: 0, sharpness: 0,
  pixelFormat: 'Mono12',
  roiEnabled: false, roiX: 0, roiY: 0, roiWidth: 0, roiHeight: 0,
  triggerEnabled: false, triggerSource: 'Line1',
}

const SETUP_CONFIG: SetupConfigState = {
  fringePeriod: 24, gamma: 2.2, minBrightness: 16, maxBrightness: 255,
  settleDelayMs: 120, monitorTarget: 'auto', phaseSteps: 8, topoInvert: false,
}

function fringeValues(period: number): number[] {
  return Array.from({ length: 256 }, (_, i) => {
    const stripe = 0.5 * (1 + Math.sin((2 * Math.PI * ((i / 255) * 256)) / period))
    return Math.min(255, Math.max(0, Math.round(16 + Math.pow(stripe, 1 / 2.2) * 239)))
  })
}

function SetupPanelHarness({ deflectometryEnabled }: { deflectometryEnabled: boolean }): JSX.Element {
  const [cameraParams, setCameraParams] = useState(CAMERA_PARAMS)
  const [setupConfig, setSetupConfig] = useState(SETUP_CONFIG)
  const [pattern, setPattern] = useState<string | null>(null)
  const [features, setFeatures] = useState<Record<string, boolean>>({})

  return (
    <div style={{ height: '100vh', maxWidth: 420, borderRight: '1px solid var(--ig-color-border-subtle)' }}>
      <SetupPanelView
        isConnected
        isSetupBusy={false}
        isSetupSaved={false}
        canSave
        canEditSetup
        progressText=""
        setupStatusMessage={null}
        deflectometryEnabled={deflectometryEnabled}
        deflectometryConfig={{} as never}
        availableMonitors={[]}
        isMeasuringSettleDelay={false}
        setupConfig={setupConfig}
        cameraParams={cameraParams}
        previewPatternLabel={pattern as never}
        previewPatternLabels={['x_0', 'x_1', 'y_0', 'y_1', 'solid', 'black']}
        sequenceSummary="8-step · X + Y · solid · total 34 patterns"
        pixelFormatOptions={[
          { value: 'auto', label: '자동' },
          { value: 'Mono8', label: 'Mono8' },
          { value: 'Mono12', label: 'Mono12' },
          { value: 'BayerRG8', label: 'Bayer RG8' },
        ]}
        phaseStepOptions={[2, 4, 8, 16]}
        fringePreview={
          <FringeProfilePreviewView
            values={fringeValues(setupConfig.fringePeriod)}
            windowPx={256}
            labels={{
              caption: `256px 구간 · 주기 ${setupConfig.fringePeriod}`,
              zoom: '크게 보기',
              zoomTitle: `프린지 미리보기 — 주기 ${setupConfig.fringePeriod}`,
              close: '닫기',
            }}
          />
        }
        autoAnalyze
        enabledFeatures={features}
        labels={LABELS}
        onSave={() => undefined}
        onReset={() => undefined}
        onSetSetupConfig={setSetupConfig}
        onUpdateCameraParams={setCameraParams}
        onWhiteBalanceCalibrate={() => undefined}
        onPreviewPattern={(p) => setPattern(p)}
        onMeasureSettleDelay={() => undefined}
        onAutoAnalyzeChange={() => undefined}
        onEnabledFeaturesChange={setFeatures}
      />
    </div>
  )
}

const meta: Meta<typeof SetupPanelHarness> = {
  title: 'Edge Pages/Capture/SetupPanel',
  component: SetupPanelHarness,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof SetupPanelHarness>

/** Deflectometry 프로젝트 — 프린지·패턴 미리보기까지 붙는다. */
export const Deflectometry: Story = { args: { deflectometryEnabled: true } }

/** 그 외 프로젝트 — 카메라 조정과 고급만. */
export const CameraOnly: Story = { args: { deflectometryEnabled: false } }
