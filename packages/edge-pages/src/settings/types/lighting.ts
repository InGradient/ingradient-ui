// Settings > Lighting 탭 라벨 + view props.
//
// 프로젝트 타입마다 "조명" 이 다르다. Deflectometry 는 모니터가 곧 조명이라 패턴을 띄울
// 화면을 고르는 것이 조명 설정이고, Photometric Stereo 는 조명 컨트롤러 제어다.
// 어느 쪽인지는 프로젝트 설정을 읽어야 알 수 있으므로 consumer 가 판단해 mode 로 넘긴다.

import type { ReactNode } from 'react'

export type LightingMode =
  /** 프로젝트 설정을 읽는 중. */
  | 'loading'
  /** 선택된 프로젝트가 없다 — 마지막 프로젝트로 조용히 폴백하지 않고 그 사실을 보여준다. */
  | 'no-project'
  | 'deflectometry'
  | 'photometric-stereo'
  /** 조명 설정이 없는 프로젝트 타입. */
  | 'unsupported'

export interface LightingTabLabels {
  title: string
  noProject: string
  noSettings: string
  /** 촬영 중에는 값을 바꿀 수 없다는 안내. 시퀀스가 이미 이전 값으로 시작됐다. */
  capturingHint: string
}

export interface LightingTabViewProps {
  mode: LightingMode
  /** 촬영 중이면 하위 컨트롤이 잠기고 안내가 붙는다. */
  isCapturing: boolean
  labels: LightingTabLabels
  monitorContent?: ReactNode
  psContent?: ReactNode
}

// ── 모니터 선택 (Deflectometry) ──

export interface LightingMonitor {
  id: string
  label: string
  width?: number
  height?: number
  isPrimary?: boolean
}

export interface MonitorPickerLabels {
  section: string
  desc: string
  auto: string
  primaryBadge: string
  /** 저장된 모니터가 지금 목록에 없을 때. */
  disconnected: string
  disconnectedHint: string
  revertAuto: string
  singleMonitorHint: string
  identify: string
  identifying: string
  identifyHint: string
  unreachable: string
  retry: string
}

export interface MonitorPickerViewProps {
  monitors: LightingMonitor[]
  /** 저장된 선택값. 자동이면 isAutoSelected 가 true 다. */
  selectedId: string
  isAutoSelected: boolean
  /** 저장된 값이 지금 목록에 있나. 없으면 자동으로 고쳐 쓰지 않고 알린다. */
  isSelectionKnown: boolean
  loading: boolean
  /** 조회 실패. 합성 목록으로 가리면 잘못된 화면을 고르게 되므로 실패를 노출한다. */
  loadFailed: boolean
  identifying: boolean
  identifyError: string | null
  disabled?: boolean
  labels: MonitorPickerLabels
  onSelect: (id: string) => void
  onSelectAuto: () => void
  onReload: () => void
  onIdentify: () => void
}

// ── 조명 컨트롤러 (Photometric Stereo) ──

export interface PsLightPanelLabels {
  statusSection: string
  portOpen: string
  connected: string
  openFailed: string
  unreachable: string
  reopen: string
  detectHint: string
  channelSection: string
  channelDesc: string
  /** `(n)` — 채널 번호. */
  channel: (n: number) => string
  allOn: string
  allOff: string
  pwmSection: string
  /** 최대값이 들어간 완성된 문장. */
  pwmDesc: string
  idleSection: string
  idleLights: string
  idleDesc: string
  sequenceBusy: string
}

export interface PsLightPanelViewProps {
  connected: boolean
  port: string | null
  baud: number | null
  /** 백엔드에 닿지 못한 것과 포트를 못 연 것은 원인이 다르다. */
  unreachable: boolean
  statusError: string | null
  /** 촬영 시퀀스가 돌고 있으면 같은 시리얼을 쓰므로 건드리지 않는다. */
  sequenceRunning: boolean
  channelCount: number
  /** 서버는 채널 상태를 보관하지 않는다 — 이 화면에서 누른 것만 표시용. */
  channelOn: Record<number, boolean>
  pwm: number
  pwmMax: number
  idleEnabled: boolean
  /** 명령을 보내는 중. */
  busy: boolean
  actionError: string | null
  disabled?: boolean
  labels: PsLightPanelLabels
  onReopen: () => void
  onToggleChannel: (channel: number, on: boolean) => void
  onAllOn: () => void
  onAllOff: () => void
  onChangePwm: (pwm: number) => void
  onToggleIdle: (enabled: boolean) => void
}
