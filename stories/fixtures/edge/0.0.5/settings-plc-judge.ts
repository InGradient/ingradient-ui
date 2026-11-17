// PLC Communication · Judge model 탭 — 실제 Edge 앱(ingradient-edge, 2026-11-03 main)의 영어 문구와
// 기본값. 0.0.5 화면에는 없고 0.0.6 스토리만 켠다(settingsPlcJudge).
import type {
  JudgeClassLinkRow, JudgeModelState, JudgeTabLabels, PlcOutputKey, PlcSettingsValue, PlcTabLabels,
} from '@ingradient/edge-pages'

export const PLC_JUDGE_TAB_LABELS = { tabPlc: 'PLC Communication', tabJudge: 'Judge model' }

export const PLC_TAB_LABELS: PlcTabLabels = {
  title: 'PLC Communication',
  intro: "Exchanges signals with the factory PLC over Ethernet using Modbus TCP. Get the addresses from the factory's PLC engineer on installation day. Changes are saved immediately.",
  needDataset: 'PLC settings are saved per dataset. Open a dataset to set them. The app does not connect to the PLC outside a dataset.',
  scope: (project, dataset) => `These settings are saved to ${project} / ${dataset}. The app connects to the PLC only while this dataset is open, and auto-inspection images go here.`,
  handoverTitle: 'For the PLC engineer',
  handoverCopy: 'Copy',
  handoverCopied: 'Copied',
  handoverHint: 'Send these values to the factory PLC engineer before installation. They follow the numbers below.',
  lockedWhileAuto: 'Cannot be changed during auto inspection. Stop it at the top first.',
  connectionSection: 'Connection',
  host: 'PLC address',
  port: 'Port',
  portHint: 'Usually 502',
  unitId: 'Unit ID',
  unitIdHint: 'Usually 1',
  inputSection: 'Signal from PLC',
  readyHint: 'Capture starts when the PLC turns this on. Confirm the read type with the PLC engineer.',
  kind: { coil: 'Coil', discrete_input: 'Discrete input' },
  outputSection: 'Signals to PLC',
  outputHint: 'All written as coils. OK/NG will be sent once automatic judgement is available.',
  signal: { ready: 'Ready', captureDone: 'Capture done', ok: 'OK', ng: 'NG', heartbeat: 'Heartbeat', error: 'Error' },
  signalDesc: {
    captureDone: 'Images taken, the part may leave',
    ok: 'Not sent yet',
    ng: 'Not sent yet',
    heartbeat: 'Toggles at a fixed interval',
    error: 'Capture failed or timed out',
  },
  duplicateWarning: (addresses) => `Two signals share the same address: ${addresses}`,
  timingSection: 'Timing',
  responseTimeout: 'Response timeout (s)',
  responseTimeoutHint: 'Error is raised if capture does not finish within this time after Ready',
  heartbeat: 'Heartbeat interval (s)',
  heartbeatHint: 'How often the heartbeat signal toggles',
  testSection: 'Connection test',
  testConnect: 'Check connection',
  testAgentDown: 'Cannot reach the app backend',
  testNoAddress: 'Enter the PLC address to connect',
  testConnected: (host, port) => `Connected (${host}:${port})`,
  testDisconnected: (reason) => `Disconnected — ${reason}`,
  testReadyDesc: 'Follows what the PLC turns on and off',
  testOn: 'On',
  testOff: 'Off',
  testTurnOn: 'Turn on',
  testTurnOff: 'Turn off',
}

/** Modbus TCP 표준 포트 502, 장치 번호 1. 주소는 0(받는 것)·1~5(보내는 것). 앱 기본값과 같다. */
export const DEFAULT_PLC_SETTINGS: PlcSettingsValue = {
  host: '',
  port: 502,
  unitId: 1,
  readyKind: 'coil',
  readyAddress: 0,
  outputs: { captureDone: 1, ok: 2, ng: 3, heartbeat: 4, error: 5 },
  responseTimeoutS: 2.5,
  heartbeatS: 1,
}

export const PLC_CONNECT_MESSAGES = {
  ok: 'Connected to the PLC.',
  failed: (reason: string) => `Could not connect: ${reason}`,
}

/** 담당자에게 보낼 글 — 앱의 plc-handover.ts 와 같은 줄과 순서(촬영 끝·오류·살아 있음 먼저). */
export function buildPlcHandoverText(s: PlcSettingsValue, pcAddress: string | null = null): string {
  const L = PLC_TAB_LABELS
  const order: PlcOutputKey[] = ['captureDone', 'error', 'heartbeat', 'ok', 'ng']
  const note = (key: PlcOutputKey) =>
    key === 'heartbeat' ? ` (toggles every ${s.heartbeatS} s)` : key === 'ok' || key === 'ng' ? ' (not sent yet)' : ''
  return [
    '[Inspection station ↔ PLC signals]',
    `Modbus TCP / port ${s.port} / unit ID ${s.unitId} / inspection PC connects`,
    ...(pcAddress ? [`Inspection PC address: ${pcAddress}`] : []),
    `${L.signal.ready}: PLC → inspection PC, ${L.kind[s.readyKind]} ${s.readyAddress}`,
    ...order.map((key) => `${L.signal[key]}: inspection PC → PLC, ${L.kind.coil} ${s.outputs[key]}${note(key)}`),
    `Capture time limit: ${s.responseTimeoutS} s`,
  ].join('\n')
}

/** 두 신호 이상이 같은 주소를 쓰면 그 주소들(앱의 findDuplicateAddresses 와 같은 규칙). */
export function findDuplicatePlcAddresses(s: PlcSettingsValue): number[] {
  const all = [s.readyAddress, ...Object.values(s.outputs)]
  return [...new Set(all.filter((a, i) => all.indexOf(a) !== i))].sort((a, b) => a - b)
}

export const JUDGE_TAB_LABELS: JudgeTabLabels = {
  title: 'Judge model',
  model: 'Model',
  state: {
    checking: 'Checking…',
    unreachable: 'Cannot reach the agent',
    not_installed: 'Not installed — captures save originals without judging',
    starting: 'Starting',
    loading: 'Preparing — the first start takes a few minutes',
    ready: 'Ready',
    failed: 'Failed',
  },
  noProject: 'Choose a project first — class links are per project.',
  classes: 'Class links',
  classesHint: 'Choose which labeling class of this project each model class means. One to one.',
  noProjectClasses: 'This project has no labeling classes.',
  unlinked: 'Not linked',
  suggested: 'Picked by matching name — save to confirm.',
  unlinkedWarn: (names) => `Model classes not linked: ${names}`,
  save: 'Save',
}

export const JUDGE_SAVED_MESSAGE = 'Saved.'

/** 프로젝트의 라벨링 클래스(오른쪽 패널의 OK·NG)와 모델 클래스 세 개. */
export const JUDGE_PROJECT_CLASSES = [
  { id: 'cls-ok', name: 'OK' },
  { id: 'cls-ng', name: 'NG' },
]

/** ok 는 저장됨, ng 는 이름이 같아 제안됨, scratch 는 맞는 클래스가 없어 연결 안 됨. */
export const JUDGE_LINK_ROWS: JudgeClassLinkRow[] = [
  { modelKey: 'ok', modelName: 'ok', classId: 'cls-ok', suggested: false },
  { modelKey: 'ng', modelName: 'ng', classId: 'cls-ng', suggested: true },
  { modelKey: 'scratch', modelName: 'scratch', classId: '', suggested: false },
]

export const JUDGE_MODEL_VERSION = 'v2026.10.31'

export type JudgeScenario = Exclude<JudgeModelState, 'ready'> | 'ready' | 'ready-no-project'
export type PlcScenario = 'no-address' | 'connected' | 'disconnected' | 'no-dataset' | 'auto-running' | 'duplicate'
