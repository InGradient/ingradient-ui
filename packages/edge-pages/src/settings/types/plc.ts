// Settings > PLC Communication 탭 라벨 + view props.
//
// 공장 설비(PLC)와 Modbus TCP 로 주고받는 주소·시간. 값은 설치하는 날 현장의 PLC 담당자에게 받는다.
// 설정은 데이터셋마다 따로 둔다 — 데이터셋을 열지 않았으면 칸 대신 안내만 보인다.
// 자동 검사 중에는 잠근다 — 도는 중에 주소가 바뀌면 엉뚱한 자리를 쓴다.
//
// 계산(담당자에게 보낼 글, 겹치는 주소, 연결 상태)은 앱이 하고, 화면은 결과만 받는다.

/** 보내는 신호 — 이 순서대로 화면에 나온다. */
export const PLC_OUTPUT_KEYS = ['captureDone', 'ok', 'ng', 'heartbeat', 'error'] as const
export type PlcOutputKey = (typeof PLC_OUTPUT_KEYS)[number]

/** "준비 완료"를 읽는 종류. */
export const PLC_READY_KINDS = ['coil', 'discrete_input'] as const
export type PlcReadyKind = (typeof PLC_READY_KINDS)[number]

export interface PlcRange { min: number; max: number; step: number }

/** 칸마다 받을 수 있는 범위 — 앱(plc-settings.ts)과 같은 값. */
export const PLC_RANGES: Record<'port' | 'unitId' | 'address' | 'responseTimeoutS' | 'heartbeatS', PlcRange> = {
  port: { min: 1, max: 65535, step: 1 },
  unitId: { min: 0, max: 255, step: 1 },
  address: { min: 0, max: 65535, step: 1 },
  responseTimeoutS: { min: 0.5, max: 30, step: 0.5 },
  heartbeatS: { min: 0.2, max: 10, step: 0.1 },
}

export interface PlcSettingsValue {
  host: string
  port: number
  unitId: number
  readyKind: PlcReadyKind
  readyAddress: number
  outputs: Record<PlcOutputKey, number>
  /** 준비 완료부터 촬영 끝까지 이 시간을 넘으면 "오류"를 켠다. */
  responseTimeoutS: number
  /** "살아 있음"을 바꾸는 주기. */
  heartbeatS: number
}

/** 연결 시험 줄의 상태. */
export type PlcLinkState =
  | { kind: 'agentDown' }
  | { kind: 'noAddress' }
  | { kind: 'connected'; host: string; port: number }
  | { kind: 'disconnected'; reason: string }

export interface PlcTestValue {
  link: PlcLinkState
  /** PLC 가 켠 "준비 완료". */
  ready: boolean
  outputs: Record<PlcOutputKey, boolean>
  /** "연결 확인"을 누르고 답을 기다리는 중. */
  busy: boolean
  /** 마지막 시험 결과 한 줄(성공·실패). 없으면 안 보인다. */
  message: string | null
}

export interface PlcTabLabels {
  title: string
  intro: string
  needDataset: string
  scope: (project: string, dataset: string) => string
  handoverTitle: string
  handoverCopy: string
  handoverCopied: string
  handoverHint: string
  lockedWhileAuto: string
  connectionSection: string
  host: string
  port: string
  portHint: string
  unitId: string
  unitIdHint: string
  inputSection: string
  readyHint: string
  kind: Record<PlcReadyKind, string>
  outputSection: string
  outputHint: string
  signal: Record<'ready' | PlcOutputKey, string>
  signalDesc: Record<PlcOutputKey, string>
  duplicateWarning: (addresses: string) => string
  timingSection: string
  responseTimeout: string
  responseTimeoutHint: string
  heartbeat: string
  heartbeatHint: string
  testSection: string
  testConnect: string
  testAgentDown: string
  testNoAddress: string
  testConnected: (host: string, port: number) => string
  testDisconnected: (reason: string) => string
  testReadyDesc: string
  testOn: string
  testOff: string
  testTurnOn: string
  testTurnOff: string
}

export interface PlcTabViewProps {
  /** 열린 데이터셋. 없으면 칸 대신 안내만 보인다. */
  dataset: { project: string; dataset: string } | null
  settings: PlcSettingsValue
  /** 자동 검사 중 — 칸과 시험 단추를 잠근다. */
  locked: boolean
  /** 두 신호 이상이 같은 주소를 쓰면 그 주소들. */
  duplicateAddresses: number[]
  /** PLC 담당자에게 보낼 글. 앱이 지금 설정으로 만든다. */
  handoverText: string
  test: PlcTestValue
  labels: PlcTabLabels
  onChange: (patch: Partial<Omit<PlcSettingsValue, 'outputs'>>) => void
  onChangeOutput: (key: PlcOutputKey, address: number) => void
  onTestConnect: () => void
  onToggleOutput: (key: PlcOutputKey, on: boolean) => void
}
