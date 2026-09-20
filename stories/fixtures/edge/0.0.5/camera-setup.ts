// 설정 > 연결 탭 위쪽의 카메라 설치 6단계 진단 fixture.
// 단계 요약문이 한국어인 것은 백엔드가 만든 문장을 그대로 보여주기 때문이다 — 화면 문구가 아니다.
import type { StatusKind } from '@ingradient/ui'
import type {
  RemediationPanelLabels, SetupStage, SetupStageCardLabels, SetupSummaryLabels,
} from '@ingradient/edge-pages'

export const STATUS_LABEL: Record<StatusKind, string> = {
  pending: 'Pending',
  running: 'Checking',
  success: 'OK',
  warning: 'Warning',
  failed: 'Failed',
  skipped: 'Not applicable',
  unknown: 'Unknown',
}

export const STAGE_CARD_LABELS: SetupStageCardLabels = {
  statusLabel: (status) => STATUS_LABEL[status],
  technicalDetails: 'Technical details',
}

export const SUMMARY_LABELS: SetupSummaryLabels = {
  title: 'Camera Setup & Connection',
  overall: 'Connected',
  progress: '6 / 6 done',
  nextStage: null,
  allDone: 'All steps are complete.',
  guided: {
    start: 'Start setup',
    continue: 'Continue setup',
    resume: 'Continue setup',
    running: 'Setting up',
    view_problem: 'View problem step',
    completed: 'Setup complete',
  },
  cancel: 'Cancel',
  restart: 'Restart connection',
}

export const SUMMARY_DESCRIPTION = '카메라 프레임이 정상적으로 들어오고 있습니다. Settings를 닫고 캡처 화면을 사용할 수 있습니다.'

export const SUMMARY_STEPS = [
  { label: 'App & Driver Readiness', status: 'done' as const },
  { label: 'Camera Discovery', status: 'done' as const },
  { label: 'Network Connection', status: 'done' as const },
  { label: 'Open Camera Device', status: 'done' as const },
  { label: 'Frame Reception', status: 'done' as const },
  { label: 'Live Preview', status: 'done' as const },
]

export const CONNECTED_STAGES: SetupStage[] = [
  {
    id: 'environment', order: 1, title: 'App & Driver Readiness', status: 'success',
    summary: '백엔드가 준비되었습니다.',
    checks: [
      { id: 'backend', status: 'success', summary: '백엔드 응답 확인' },
      { id: 'sdk', status: 'success', summary: 'CREVIS cvsCam DLL 로드됨' },
      {
        id: 'ebus_rx_pool', status: 'success', summary: 'eBUS 수신 풀 2048',
        detail: 'RXPacketPoolSize=2048 (기본 256)',
      },
    ],
  },
  {
    id: 'discovery', order: 2, title: 'Camera Discovery', status: 'success',
    summary: '연결된 카메라를 사용 중입니다.',
    checks: [
      { id: 'gvcp', status: 'success', summary: 'Crevis MG-A121M-9 · 169.254.102.157' },
    ],
  },
  {
    id: 'network', order: 3, title: 'Network Connection', status: 'success',
    summary: '카메라와 통신 중 — 네트워크 동작이 확인되었습니다.',
    checks: [
      { id: 'subnet', status: 'success', summary: 'NIC 과 같은 대역' },
      { id: 'jumbo', status: 'success', summary: 'Jumbo Frame 9014' },
    ],
  },
  {
    id: 'device_open', order: 4, title: 'Open Camera Device', status: 'success',
    summary: '카메라 장치가 열렸고 스트림이 시작되었습니다.',
    updatedAtLabel: '9:22:32 AM',
    checks: [
      { id: 'open', status: 'success', summary: '장치 열기 성공' },
      { id: 'gevscpd', status: 'success', summary: 'GevSCPD 10202 (calibrated)' },
    ],
  },
  {
    id: 'frame_reception', order: 5, title: 'Frame Reception', status: 'success',
    summary: '카메라 프레임이 들어오고 있습니다.',
    updatedAtLabel: '9:22:32 AM',
    checks: [
      { id: 'frames', status: 'success', summary: '3.1 fps 수신 중' },
    ],
  },
  {
    id: 'live_preview', order: 6, title: 'Live Preview', status: 'success',
    summary: '라이브 프리뷰가 준비되었습니다.',
    checks: [
      { id: 'preview', status: 'success', summary: '프리뷰 프레임 표시 중' },
    ],
  },
]

export const REMEDIATION_LABELS: RemediationPanelLabels = {
  running: 'Running',
  confirm: 'Confirm (click again)',
  cancel: 'Cancel',
  resultOk: 'Applied',
  resultFail: 'Failed',
  autoVerifyHint: 'This step is re-checked automatically after applying.',
}
