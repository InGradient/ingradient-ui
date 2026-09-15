// 카메라 설치 6단계 진단 화면의 라벨 + view props.
//
// 단계 판정(무엇이 실패이고 다음에 뭘 해야 하는지)은 백엔드 응답과 기기 상태를 읽어야 하므로
// 전부 consumer 가 한다. 이 View 들은 판정 결과를 받아 보여주고, 누른 것을 돌려줄 뿐이다.

import type { ReactNode } from 'react'
import type { StatusKind } from '@ingradient/ui'

export interface SetupCheck {
  id: string
  status: StatusKind
  summary: string
  /** 원본 오류 문자열 등 기술 정보. 접힌 상태로 제공한다. */
  detail?: string
}

export interface SetupStage {
  id: string
  /** 화면에 보이는 단계 번호. */
  order: number
  title: string
  status: StatusKind
  summary: string
  /** 마지막으로 검사한 시각(표시용 문자열). 없으면 안 보인다. */
  updatedAtLabel?: string
  checks: SetupCheck[]
}

export interface SetupStageAction {
  label: string
  enabled: boolean
  onRun: () => void
}

export interface SetupStageCardLabels {
  statusLabel: (status: StatusKind) => string
  technicalDetails: string
}

export interface SetupStageCardViewProps {
  stage: SetupStage
  expanded: boolean
  onToggle: () => void
  /** 이 단계에서 실행할 수 있는 동작. 없으면 버튼이 안 나온다. */
  action?: SetupStageAction
  /** 실패·경고 단계의 문제 해결 패널. */
  remediation?: ReactNode
  labels: SetupStageCardLabels
}

// ── 요약 카드 ──

/** 안내형 실행이 지금 무엇을 제안하는지. */
export type GuidedAction = 'start' | 'continue' | 'resume' | 'running' | 'view_problem' | 'completed'

export interface SetupSummaryLabels {
  title: string
  /** 전체 상태 배지 문구. */
  overall: string
  /** "3 / 6 완료" 처럼 완성된 문장. */
  progress: string
  /** 다음에 할 단계 안내. 전부 끝났으면 allDone 이 대신 쓰인다. */
  nextStage: string | null
  allDone: string
  guided: Record<GuidedAction, string>
  cancel: string
  restart: string
}

export interface SetupSummaryViewProps {
  steps: { label: string; status: 'pending' | 'running' | 'done' | 'error' }[]
  overallStatus: StatusKind
  /** 지금 상태를 한 줄로 설명한다. */
  description: string
  guidedAction: GuidedAction
  labels: SetupSummaryLabels
  onStart: () => void
  onCancel: () => void
  onViewProblem: () => void
  /** 연결된 상태에서만 준다 — 해제 후 재연결. */
  onRestart?: () => void
  restartDisabled?: boolean
}

// ── 문제 해결 ──

export interface RemediationActionItem {
  id: string
  label: string
  /** 실행 전에 한 번 더 확인받는다 — 되돌리기 어려운 동작. */
  requiresConfirmation?: boolean
  /** 사람이 직접 해야 하는 안내(버튼이 아니라 설명). */
  isGuidance?: boolean
  hint?: string
}

export interface RemediationOutcomeItem {
  ok: boolean
  detail?: string
  /** 값이 실제로 바뀌었으면 전후를 같이 보여준다. */
  changedLabel?: string
}

export interface RemediationPanelLabels {
  running: string
  confirm: string
  cancel: string
  resultOk: string
  resultFail: string
  autoVerifyHint: string
}

export interface RemediationPanelViewProps {
  actions: RemediationActionItem[]
  /** 지금 실행 중인 action. */
  activeActionId: string | null
  outcomes: Record<string, RemediationOutcomeItem>
  canRun: boolean
  labels: RemediationPanelLabels
  onRun: (actionId: string) => void
}
