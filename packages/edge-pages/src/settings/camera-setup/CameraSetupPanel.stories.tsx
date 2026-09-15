// 카메라 설치 6단계 진단 — 요약 카드 + 단계 카드 목록 + 문제 해결 패널.
// 실제 앱에서는 설정 > 연결 탭 안에 들어간다. 단계 판정은 앱이 하고, 여기서는 결과만 그린다.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '@ingradient/ui'
import type { StatusKind } from '@ingradient/ui'

import { RemediationPanelView } from './RemediationPanelView'
import { SetupStageCardView } from './SetupStageCardView'
import { SetupSummaryView } from './SetupSummaryView'
import type { GuidedAction, SetupStage } from '../types'

const STATUS_LABEL: Record<StatusKind, string> = {
  success: '정상', warning: '주의', failed: '실패', running: '검사 중',
  skipped: '건너뜀', unknown: '알 수 없음', pending: '대기',
}

const STAGES: SetupStage[] = [
  {
    id: 'nic', order: 1, title: '네트워크 어댑터', status: 'success',
    summary: 'Realtek USB 2.5GbE · 169.254.171.176', updatedAtLabel: '19:04:12',
    checks: [
      { id: 'nic_present', status: 'success', summary: '어댑터를 찾았다' },
      { id: 'jumbo', status: 'success', summary: 'Jumbo Frame 9014' },
      { id: 'ebus_rx_pool', status: 'success', summary: 'eBUS 수신 풀 2048' },
    ],
  },
  {
    id: 'discovery', order: 2, title: '카메라 검색', status: 'success',
    summary: 'MG-A121M-9 · 169.254.171.177', updatedAtLabel: '19:04:14',
    checks: [{ id: 'gvcp', status: 'success', summary: 'GVCP 응답 1대' }],
  },
  {
    id: 'reachable', order: 3, title: '카메라 연결 확인', status: 'failed',
    summary: '카메라에 닿지 못했다', updatedAtLabel: '19:04:20',
    checks: [
      { id: 'ping', status: 'failed', summary: '응답 없음', detail: 'timeout after 3000ms' },
      { id: 'subnet', status: 'warning', summary: 'NIC 과 카메라가 다른 대역이다' },
    ],
  },
  {
    id: 'open', order: 4, title: '장치 열기', status: 'pending', summary: '이전 단계 완료 후 진행',
    checks: [{ id: 'open_device', status: 'pending', summary: '대기 중' }],
  },
  {
    id: 'stream', order: 5, title: '스트림 시작', status: 'pending', summary: '이전 단계 완료 후 진행',
    checks: [{ id: 'acq_start', status: 'pending', summary: '대기 중' }],
  },
  {
    id: 'live_preview', order: 6, title: '프리뷰 확인', status: 'pending', summary: '이전 단계 완료 후 진행',
    checks: [{ id: 'frames', status: 'pending', summary: '대기 중' }],
  },
]

const SUMMARY_LABELS = {
  title: '카메라 설치 및 연결',
  overall: '문제 발견',
  progress: '2 / 6 완료',
  nextStage: '다음 단계: 카메라 연결 확인',
  allDone: '모든 단계가 완료되었습니다',
  guided: {
    start: '연결 설정 시작', continue: '연결 설정 계속', resume: '이어서 진행',
    running: '연결 설정 중', view_problem: '문제 단계 보기', completed: '연결 설정 완료',
  },
  cancel: '취소',
  restart: '재연결',
}

const REMEDIATION_LABELS = {
  running: '실행 중',
  confirm: '정말 실행 (한 번 더 클릭)',
  cancel: '취소',
  resultOk: '적용됨',
  resultFail: '실패',
  autoVerifyHint: '적용 후 이 단계를 자동으로 다시 검사합니다.',
}

function CameraSetupPanel({ guidedAction }: { guidedAction: GuidedAction }): JSX.Element {
  const [openId, setOpenId] = useState<string | null>('reachable')

  return (
    <Stack gap="var(--ig-space-4)" style={{ padding: 'var(--ig-space-6)' }}>
      <SetupSummaryView
        steps={STAGES.map((stage) => ({
          label: stage.title,
          status: stage.status === 'success' ? 'done'
            : stage.status === 'failed' ? 'error'
              : stage.status === 'running' ? 'running' : 'pending',
        }))}
        overallStatus="failed"
        description="카메라는 찾았지만 통신이 되지 않는다. NIC 과 카메라가 다른 대역이라 IP 를 맞춰야 한다."
        guidedAction={guidedAction}
        labels={SUMMARY_LABELS}
        onStart={() => undefined}
        onCancel={() => undefined}
        onViewProblem={() => setOpenId('reachable')}
      />

      <Stack gap="var(--ig-space-2)">
        {STAGES.map((stage) => (
          <SetupStageCardView
            key={stage.id}
            stage={stage}
            expanded={openId === stage.id}
            onToggle={() => setOpenId((prev) => (prev === stage.id ? null : stage.id))}
            labels={{ statusLabel: (status) => STATUS_LABEL[status], technicalDetails: '기술 정보' }}
            action={stage.id === 'reachable'
              ? { label: '다시 검사', enabled: true, onRun: () => undefined }
              : undefined}
            remediation={stage.id === 'reachable' ? (
              <RemediationPanelView
                actions={[
                  { id: 'force_ip', label: '카메라 IP 를 NIC 대역으로 맞추기', requiresConfirmation: true },
                  { id: 'set_nic_ip', label: 'NIC IP 를 카메라 대역으로 맞추기' },
                  {
                    id: 'check_cable', label: '랜선 연결 확인', isGuidance: true,
                    hint: '카메라와 PC 양쪽 커넥터가 완전히 꽂혔는지 확인한다.',
                  },
                ]}
                activeActionId={null}
                outcomes={{
                  set_nic_ip: { ok: false, detail: '관리자 권한이 필요하다' },
                }}
                canRun
                labels={REMEDIATION_LABELS}
                onRun={() => undefined}
              />
            ) : undefined}
          />
        ))}
      </Stack>
    </Stack>
  )
}

const meta: Meta<typeof CameraSetupPanel> = {
  title: 'Edge Pages/Settings/CameraSetupPanel',
  component: CameraSetupPanel,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CameraSetupPanel>

/** 3단계에서 막힌 상태 — 실패 카드가 펼쳐지고 해결책이 붙는다. */
export const ProblemFound: Story = { args: { guidedAction: 'view_problem' } }

/** 아직 시작 전. */
export const BeforeStart: Story = { args: { guidedAction: 'start' } }

/** 안내형 실행이 도는 중 — 취소만 가능하다. */
export const Running: Story = { args: { guidedAction: 'running' } }
