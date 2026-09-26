// 설정 다이얼로그 중 edge-pages 로 옮긴 탭 — 일반 · 촬영 · 조명 · 실험.
import { useState } from 'react'
import {
  CaptureTabView, ExperimentsTabView, GeneralTabView, LightingTabView, MonitorPickerView,
  PsLightPanelView, type LightingMode,
} from '@ingradient/edge-pages'
import {
  CAPTURE_FALLBACK_OPTIONS, CAPTURE_PATTERN_OPTIONS, CAPTURE_TAB_LABELS,
  EXPERIMENTS_TAB_LABELS, GENERAL_TAB_LABELS, LIGHTING_TAB_LABELS, MONITORS,
  MONITOR_PICKER_LABELS, PS_LIGHT_LABELS, SOUND_OPTIONS,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined

export function GeneralTabContent(): JSX.Element {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundId, setSoundId] = useState('twoToneAlarm')
  const [volume, setVolume] = useState(70)
  const [messageEnabled, setMessageEnabled] = useState(true)

  return (
    <GeneralTabView
      soundEnabled={soundEnabled}
      soundOptions={SOUND_OPTIONS}
      selectedSoundId={soundId}
      volumePercent={volume}
      volumeLocked={soundId === 'windows_default'}
      messageEnabled={messageEnabled}
      testResult={null}
      labels={GENERAL_TAB_LABELS}
      onToggleSound={setSoundEnabled}
      onSelectSound={setSoundId}
      onPreviewSound={noop}
      onChangeVolume={setVolume}
      onPreviewVolume={noop}
      onToggleMessage={setMessageEnabled}
      onTestMessage={noop}
    />
  )
}

/** 촬영 — 위상을 위상천이로 얻을지, 모델 한 장으로 얻을지. */
export function CaptureTabContent({ aiOn = true }: { aiOn?: boolean } = {}): JSX.Element {
  const [aiEnabled, setAiEnabled] = useState(aiOn)
  const [pattern, setPattern] = useState(CAPTURE_PATTERN_OPTIONS[0].value)
  const [fallback, setFallback] = useState(CAPTURE_FALLBACK_OPTIONS[0].value)

  return (
    <CaptureTabView
      aiEnabled={aiEnabled}
      aiPattern={pattern}
      patternOptions={CAPTURE_PATTERN_OPTIONS}
      aiFallback={fallback}
      fallbackOptions={CAPTURE_FALLBACK_OPTIONS}
      isCapturing={false}
      labels={CAPTURE_TAB_LABELS}
      onToggleAi={setAiEnabled}
      onChangePattern={setPattern}
      onChangeFallback={setFallback}
    />
  )
}

export function LightingTabContent({ mode = 'deflectometry' as LightingMode }): JSX.Element {
  const [monitorId, setMonitorId] = useState('DISPLAY2')
  const [channelOn, setChannelOn] = useState<Record<number, boolean>>({ 2: true })
  const [pwm, setPwm] = useState(820)
  const [idleEnabled, setIdleEnabled] = useState(false)

  return (
    <LightingTabView
      mode={mode}
      isCapturing={false}
      labels={LIGHTING_TAB_LABELS}
      monitorContent={(
        <MonitorPickerView
          monitors={MONITORS}
          selectedId={monitorId}
          isAutoSelected={monitorId === 'auto'}
          isSelectionKnown={monitorId === 'auto' || MONITORS.some((m) => m.id === monitorId)}
          loading={false}
          loadFailed={false}
          identifying={false}
          identifyError={null}
          labels={MONITOR_PICKER_LABELS}
          onSelect={setMonitorId}
          onSelectAuto={() => setMonitorId('auto')}
          onReload={noop}
          onIdentify={noop}
        />
      )}
      psContent={(
        <PsLightPanelView
          connected
          port="COM4"
          baud={9600}
          unreachable={false}
          statusError={null}
          sequenceRunning={false}
          channelCount={4}
          channelOn={channelOn}
          pwm={pwm}
          pwmMax={1023}
          idleEnabled={idleEnabled}
          busy={false}
          actionError={null}
          labels={PS_LIGHT_LABELS}
          onReopen={noop}
          onToggleChannel={(channel, on) => setChannelOn((prev) => ({ ...prev, [channel]: on }))}
          onAllOn={() => setChannelOn({ 1: true, 2: true, 3: true, 4: true })}
          onAllOff={() => setChannelOn({})}
          onChangePwm={setPwm}
          onToggleIdle={setIdleEnabled}
        />
      )}
    />
  )
}

export function ExperimentsTabContent(): JSX.Element {
  const [enabled, setEnabled] = useState(false)
  const [periods, setPeriods] = useState<number[]>([12, 24, 48])
  const [compositeEnabled, setCompositeEnabled] = useState(false)
  const [compositeSteps, setCompositeSteps] = useState(8)

  return (
    <ExperimentsTabView
      enabled={enabled}
      fringePeriods={periods}
      primaryIndex={1}
      compositeEnabled={compositeEnabled}
      compositeSteps={compositeSteps}
      limits={{ minPeriod: 4, maxPeriods: 6, maxCompositeSteps: 32 }}
      labels={EXPERIMENTS_TAB_LABELS}
      onToggleEnabled={setEnabled}
      onChangePeriod={(index, period) => setPeriods((prev) => prev.map((p, i) => (i === index ? period : p)))}
      onAddPeriod={() => setPeriods((prev) => [...prev, prev[prev.length - 1] ?? 12])}
      onRemovePeriod={(index) => setPeriods((prev) => prev.filter((_, i) => i !== index))}
      onToggleComposite={setCompositeEnabled}
      onChangeCompositeSteps={setCompositeSteps}
    />
  )
}

