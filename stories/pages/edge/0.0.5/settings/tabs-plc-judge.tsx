// PLC Communication · Judge model 탭 — 0.0.6 스토리만 켠다(WorkspaceSceneArgs.settingsPlcJudge).
// 실제 PLC·판독 에이전트 대신 시나리오별 가짜 상태를 둔다. 바꾼 값은 Workspace 세션 동안 남는다.
import { useState } from 'react'
import {
  JudgeTabView, PlcTabView,
  type JudgeClassLinkRow, type PlcOutputKey, type PlcSettingsValue, type PlcTestValue,
} from '@ingradient/edge-pages'
import {
  DATASET_NAME, DEFAULT_PLC_SETTINGS, JUDGE_LINK_ROWS, JUDGE_MODEL_VERSION, JUDGE_PROJECT_CLASSES,
  JUDGE_SAVED_MESSAGE, JUDGE_TAB_LABELS, PLC_CONNECT_MESSAGES, PLC_TAB_LABELS, PROJECT_NAME,
  buildPlcHandoverText, findDuplicatePlcAddresses, type JudgeScenario, type PlcScenario,
} from '../../../../fixtures/edge/0.0.5'
import type { MockAction } from './tabs-moved'

const ALL_OFF: Record<PlcOutputKey, boolean> = { captureDone: false, ok: false, ng: false, heartbeat: false, error: false }
const FACTORY_HOST = '192.168.0.10'
/** 이 PC 주소 — 앱은 백엔드에서 받는다. 주소가 있을 때만 담당자 글에 붙는다. */
const PC_ADDRESS = '192.168.0.21'

function initialPlc(scenario: PlcScenario): { settings: PlcSettingsValue; test: PlcTestValue } {
  const configured = scenario !== 'no-address' && scenario !== 'no-dataset'
  const settings: PlcSettingsValue = {
    ...DEFAULT_PLC_SETTINGS,
    host: configured ? FACTORY_HOST : '',
    // 두 신호가 같은 주소를 쓰는 실수 — 정상(OK)을 촬영 끝과 같은 1번에 둔다.
    outputs: scenario === 'duplicate' ? { ...DEFAULT_PLC_SETTINGS.outputs, ok: 1 } : DEFAULT_PLC_SETTINGS.outputs,
  }
  const connected = scenario === 'connected' || scenario === 'auto-running'
  return {
    settings,
    test: {
      link: !configured ? { kind: 'noAddress' }
        : connected ? { kind: 'connected', host: FACTORY_HOST, port: settings.port }
          : { kind: 'disconnected', reason: 'timed out' },
      ready: scenario === 'auto-running',
      outputs: { ...ALL_OFF, heartbeat: connected },
      busy: false,
      message: null,
    },
  }
}

/** PLC·판독 탭의 세션 상태. 시나리오가 바뀌면 Workspace 세션이 새로 시작된다. */
export function usePlcJudgeDraft(plcScenario: PlcScenario = 'no-address', judgeScenario: JudgeScenario = 'not_installed') {
  const plc = initialPlc(plcScenario)
  return {
    plcScenario,
    judgeScenario,
    plcSettings: useState(plc.settings),
    plcTest: useState(plc.test),
    judgeRows: useState<JudgeClassLinkRow[]>(JUDGE_LINK_ROWS),
    judgeSaved: useState<JudgeClassLinkRow[]>(JUDGE_LINK_ROWS.map((r) => ({ ...r, suggested: false, classId: r.suggested ? '' : r.classId }))),
    judgeMessage: useState<string | null>(null),
  }
}
export type PlcJudgeDraft = ReturnType<typeof usePlcJudgeDraft>

export function PlcTabContent({ draft, onMockAction }: { draft: PlcJudgeDraft; onMockAction: MockAction }): JSX.Element {
  const [settings, setSettings] = draft.plcSettings
  const [test, setTest] = draft.plcTest
  const locked = draft.plcScenario === 'auto-running'

  const connect = () => {
    onMockAction('plc-test-connect', { host: settings.host, port: settings.port })
    const ok = settings.host === FACTORY_HOST && draft.plcScenario !== 'disconnected'
    setTest({
      ...test,
      link: ok ? { kind: 'connected', host: settings.host, port: settings.port } : { kind: 'disconnected', reason: 'timed out' },
      outputs: { ...test.outputs, heartbeat: ok },
      message: ok ? PLC_CONNECT_MESSAGES.ok : PLC_CONNECT_MESSAGES.failed('timed out'),
    })
  }

  return (
    <PlcTabView
      dataset={draft.plcScenario === 'no-dataset' ? null : { project: PROJECT_NAME, dataset: DATASET_NAME }}
      settings={settings}
      locked={locked}
      duplicateAddresses={findDuplicatePlcAddresses(settings)}
      handoverText={buildPlcHandoverText(settings, test.link.kind === 'connected' ? PC_ADDRESS : null)}
      test={test}
      labels={PLC_TAB_LABELS}
      onChange={(patch) => {
        const next = { ...settings, ...patch }
        setSettings(next)
        // 주소를 넣으면 시험할 수 있다(아직 연결 전), 지우면 다시 "주소를 넣으세요".
        if (patch.host !== undefined) {
          setTest({ ...test, link: next.host ? { kind: 'disconnected', reason: 'not checked yet' } : { kind: 'noAddress' }, message: null })
        }
        onMockAction('plc-change', patch)
      }}
      onChangeOutput={(key, address) => {
        setSettings({ ...settings, outputs: { ...settings.outputs, [key]: address } })
        onMockAction('plc-change-output', { key, address })
      }}
      onTestConnect={connect}
      onToggleOutput={(key, on) => {
        setTest({ ...test, outputs: { ...test.outputs, [key]: on } })
        onMockAction('plc-test-output', { key, on })
      }}
    />
  )
}

export function JudgeTabContent({ draft, onMockAction }: { draft: PlcJudgeDraft; onMockAction: MockAction }): JSX.Element {
  const [rows, setRows] = draft.judgeRows
  const [saved, setSaved] = draft.judgeSaved
  const [message, setMessage] = draft.judgeMessage
  const scenario = draft.judgeScenario
  const state = scenario === 'ready-no-project' ? 'ready' : scenario
  const dirty = rows.some((r, i) => r.suggested || r.classId !== saved[i]?.classId)

  return (
    <JudgeTabView
      state={state}
      version={state === 'ready' || state === 'loading' ? JUDGE_MODEL_VERSION : null}
      detail={state === 'failed' ? 'model file is damaged (checksum mismatch)' : null}
      hasProject={scenario !== 'ready-no-project'}
      projectClasses={JUDGE_PROJECT_CLASSES}
      classesLoading={false}
      rows={rows}
      unlinkedNames={rows.filter((r) => !r.classId).map((r) => r.modelName)}
      dirty={dirty}
      message={message}
      labels={JUDGE_TAB_LABELS}
      onChangeLink={(modelKey, classId) => {
        setRows(rows.map((r) => (r.modelKey === modelKey ? { ...r, classId, suggested: false } : r)))
        setMessage(null)
        onMockAction('judge-link', { modelKey, classId })
      }}
      onSave={() => {
        const confirmed = rows.map((r) => ({ ...r, suggested: false }))
        setRows(confirmed)
        setSaved(confirmed)
        setMessage(JUDGE_SAVED_MESSAGE)
        onMockAction('judge-save', confirmed.map((r) => ({ model_key: r.modelKey, class_id: r.classId })))
      }}
    />
  )
}
