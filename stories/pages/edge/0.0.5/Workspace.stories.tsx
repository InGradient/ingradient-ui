// 화면 3·4 — 촬영 화면과 그 위에 뜨는 System Settings 다이얼로그.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { defineHandoff } from '../../../support/handoff'
import { WorkspaceScene, type WorkspaceSceneArgs } from './workspace/workspace-scene'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.5',
  page: 'Workspace',
  referenceStory: 'Pages / Edge / 0.0.5 / Workspace / Capture',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.5/*',
  requiredScenarios: [
    'capture', 'setup', 'capturing', 'sequence-failed', 'log-filter-open', 'offline',
    'settings-connection', 'settings-general', 'settings-lighting', 'settings-experiments',
  ],
  interactions: [
    '탭 전환 (Capture / Images / Statics / Setup)',
    '우측 Pattern Preview 의 패턴 버튼 → 해당 패턴을 모니터에 띄운다',
    '로그 항목 hover → 시퀀스 소요 시간 상세',
    '상단 톱니 → System Settings (탭 10개)',
  ],
  platformIntegration: [
    '전체 화면 = EdgeAppShellView + MainLayoutView 합성 (App.tsx + MainLayout.tsx)',
    'liveFrameSrc 는 백엔드 MJPEG 스트림 — 스토리에서는 비워 두고 그리드만 보인다',
    '패턴 목록은 buildPatternLabels(deflectometry 설정) 결과',
  ],
})

const meta = {
  title: 'Pages/Edge/0.0.5/Workspace',
  component: WorkspaceScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof WorkspaceScene>

export default meta
type Story = StoryObj<WorkspaceSceneArgs>

// 화면에 고정(position: fixed)돼 뜨는 것들은 Docs 한 페이지에 여러 스토리를 세로로 쌓으면
// 문서 전체를 덮어 버린다. 그래서 Docs 에서는 빼고 사이드바에서만 연다.
const DIALOG_ONLY = { tags: ['!autodocs'] }

/** 촬영 대기 — 좌측 로그, 가운데 라이브 프리뷰, 우측 패턴/클래스. */
export const Capture: Story = { args: { activeTab: 'capture' } }

/** Setup 탭 — 우측이 셋업 패널로 바뀐다. */
export const Setup: Story = { args: { activeTab: 'setup' } }

/** 촬영 중 — 화면이 잠기고 진행 상태가 보인다. */
export const Capturing: Story = { args: { activeTab: 'capture', isCapturing: true } }

/** 시퀀스가 시작되지 못한 경우. 다이얼로그라 Docs 에서는 빼고 사이드바에서만 연다. */
export const SequenceFailed: Story = {
  ...DIALOG_ONLY,
  args: { activeTab: 'capture', sequenceFailure: true },
}

/** 로그 필터 popover 를 연 상태. */
export const LogFilterOpen: Story = { args: { activeTab: 'capture', logFilterOpen: true } }

/** 카메라가 끊긴 상태. */
export const Offline: Story = { args: { activeTab: 'capture', connectionStatus: 'disconnected' } }

// ── System Settings ─────────────────────────────────────────────────────────

/** 설정 > 연결 — 6단계 진단이 모두 통과한 모습. */
export const SettingsConnection: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'connection' },
}

/** 설정 > 일반 — 촬영 완료 알림. */
export const SettingsGeneral: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'general' },
}

/** 설정 > 조명 — Deflectometry 는 모니터가 곧 조명이다. */
export const SettingsLighting: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'lighting' },
}

/** 설정 > 실험 — 여러 주기로 한 번에 촬영. */
export const SettingsExperiments: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'experiments' },
}
