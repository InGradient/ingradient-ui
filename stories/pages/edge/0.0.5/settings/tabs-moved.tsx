// 설정 다이얼로그 중 edge-pages 로 옮긴 탭 — 일반 · 조명 · 실험.
import { useState } from 'react'
import { useConnectionDraft, useDeviceDraft, useMaintenanceDraft, useLogsDraft } from './settings-drafts'
import {
  ExperimentsTabView, GeneralTabView, LightingTabView, MonitorPickerView, PsLightPanelView,
  type LightingMode,
} from '@ingradient/edge-pages'
import {
  EXPERIMENTS_TAB_LABELS, GENERAL_TAB_LABELS, LIGHTING_TAB_LABELS, MONITORS,
  MONITOR_PICKER_LABELS, PS_LIGHT_LABELS, SOUND_OPTIONS,
} from '../../../../fixtures/edge/0.0.5'

/** Draft lifetime is the Workspace session, never the currently mounted tab. */
export function useSettingsDraft() {
  return {
    connection: useConnectionDraft(),
    device: useDeviceDraft(),
    maintenance: useMaintenanceDraft(),
    logs: useLogsDraft(),
    soundEnabled: useState(true),
    soundId: useState('twoToneAlarm'),
    volume: useState(70),
    messageEnabled: useState(true),
    monitorId: useState('DISPLAY2'),
    channelOn: useState<Record<number, boolean>>({ 2: true }),
    pwm: useState(820),
    idleEnabled: useState(false),
    enabled: useState(false),
    periods: useState<number[]>([12, 24, 48]),
    primaryIndex: useState(1),
    compositeEnabled: useState(false),
    compositeSteps: useState(8),
    mockResult: useState(''),
    lightingResult: useState(''),
  }
}
export type SettingsDraft = ReturnType<typeof useSettingsDraft>
export type MockAction = (action: string, detail?: unknown) => void

/** Synthetic fixture only: two directions, six phase steps, optional composite per period. */
export function mockExperimentFrames(periodCount: number, compositeEnabled: boolean, compositeSteps: number): number {
  return periodCount * (2 * 6 + (compositeEnabled ? compositeSteps : 0))
}

export function GeneralTabContent({ draft, onMockAction, mockMessageResult = 'ok' }: {
  draft: SettingsDraft
  onMockAction: MockAction
  mockMessageResult?: 'ok' | 'failed'
}): JSX.Element {
  const [soundEnabled, setSoundEnabled] = draft.soundEnabled
  const [soundId, setSoundId] = draft.soundId
  const [volume, setVolume] = draft.volume
  const [messageEnabled, setMessageEnabled] = draft.messageEnabled
  const [mockResult, setMockResult] = draft.mockResult
  const preview = (action: string, detail: unknown) => {
    onMockAction(action, detail)
    setMockResult('Mock preview requested; no audio or OS notification was sent.')
  }

  return (
    <>
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
      onPreviewSound={(id) => preview('sound-preview', { soundId: id })}
      onChangeVolume={setVolume}
      onPreviewVolume={() => preview('volume-preview', { soundId, volume })}
      onToggleMessage={setMessageEnabled}
      onTestMessage={() => {
        onMockAction('message-test', { outcome: mockMessageResult })
        setMockResult(`Mock message test: ${mockMessageResult === 'ok' ? 'success' : 'failed'}; no OS notification was sent.`)
      }}
    />
    {mockResult && <p role="status">{mockResult}</p>}
    </>
  )
}

export function LightingTabContent({ draft, mode = 'deflectometry', onMockAction }: { draft: SettingsDraft; mode?: LightingMode; onMockAction: MockAction }): JSX.Element {
  const [result, setResult] = draft.lightingResult
  const action = (name: string) => { setResult(`Mock lighting ${name}; no monitor or controller was contacted.`); onMockAction(`lighting-${name}`) }
  const [monitorId, setMonitorId] = draft.monitorId
  const [channelOn, setChannelOn] = draft.channelOn
  const [pwm, setPwm] = draft.pwm
  const [idleEnabled, setIdleEnabled] = draft.idleEnabled

  return (
    <><LightingTabView
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
          onSelect={(id) => { setMonitorId(id); action(`monitor-selected-${id}`) }}
          onSelectAuto={() => { setMonitorId('auto'); action('monitor-auto') }}
          onReload={() => action('monitor-list-refreshed')}
          onIdentify={() => action('identify-preview')}
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
          onReopen={() => action('serial-port-reopened')}
          onToggleChannel={(channel, on) => { setChannelOn((prev) => ({ ...prev, [channel]: on })); action(`channel-${channel}-${on ? 'on' : 'off'}`) }}
          onAllOn={() => { setChannelOn({ 1: true, 2: true, 3: true, 4: true }); action('all-on') }}
          onAllOff={() => { setChannelOn({}); action('all-off') }}
          onChangePwm={(value) => { setPwm(value); action('pwm-changed') }}
          onToggleIdle={(value) => { setIdleEnabled(value); action('idle-changed') }}
        />
      )}
    />{result && <p role="status">{result}</p>}</>
  )
}

export function ExperimentsTabContent({ draft }: { draft: SettingsDraft }): JSX.Element {
  const [enabled, setEnabled] = draft.enabled
  const [periods, setPeriods] = draft.periods
  const [primaryIndex, setPrimaryIndex] = draft.primaryIndex
  const [compositeEnabled, setCompositeEnabled] = draft.compositeEnabled
  const [compositeSteps, setCompositeSteps] = draft.compositeSteps
  const total = mockExperimentFrames(enabled ? new Set(periods).size : 1, enabled && compositeEnabled, compositeSteps)

  return (
    <ExperimentsTabView
      enabled={enabled}
      fringePeriods={periods}
      primaryIndex={periods.indexOf(periods[primaryIndex])}
      compositeEnabled={compositeEnabled}
      compositeSteps={compositeSteps}
      limits={{ minPeriod: 4, maxPeriods: 6, maxCompositeSteps: 32 }}
      labels={{ ...EXPERIMENTS_TAB_LABELS, total: `Mock: ${total} frames per capture (2 directions × 6 phase steps per period; optional composite).` }}
      onToggleEnabled={setEnabled}
      onChangePeriod={(index, period) => setPeriods((prev) => prev.map((p, i) => (i === index ? period : p)))}
      onAddPeriod={() => setPeriods((prev) => [...prev, prev[prev.length - 1] ?? 12])}
      onRemovePeriod={(index) => {
        if (periods.length <= 1) return
        setPeriods((prev) => prev.filter((_, i) => i !== index))
        setPrimaryIndex((prev) => Math.max(0, Math.min(prev - (index < prev ? 1 : 0), periods.length - 2)))
      }}
      onToggleComposite={setCompositeEnabled}
      onChangeCompositeSteps={setCompositeSteps}
    />
  )
}

