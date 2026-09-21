// 화면 3·4 — 촬영 화면과 그 위에 뜨는 System Settings 다이얼로그.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
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
    'capture', 'images', 'statics', 'setup', 'capturing', 'sequence-failed', 'log-filter-open', 'offline',
    'settings',
  ],
  interactions: [
    '탭 전환 (Capture / Images / Statics / Setup)',
    '우측 Pattern Preview 의 패턴 버튼 → mock 선택값만 변경 (실제 모니터 출력 없음)',
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
  args: { onMockAction: fn() },
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff, a11y: { test: 'error' } },
} satisfies Meta<typeof WorkspaceScene>

export default meta
type Story = StoryObj<WorkspaceSceneArgs>

// 화면에 고정(position: fixed)돼 뜨는 것들은 Docs 한 페이지에 여러 스토리를 세로로 쌓으면
// 문서 전체를 덮어 버린다. 그래서 Docs 에서는 빼고 사이드바에서만 연다.
const DIALOG_ONLY = { tags: ['!autodocs'] }

/** 촬영 대기 — 좌측 로그, 가운데 라이브 프리뷰, 우측 패턴/클래스. */
export const Capture: Story = { args: { activeTab: 'capture' } }

/** [임시] Images 탭 — 촬영 이미지 그리드. 지금 보이는 사진은 mock 이다. */
export const Images: Story = {
  args: { activeTab: 'images' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('checkbox', { name: 'Select all' })).toBeInTheDocument()
    await expect(canvas.getByText('Select all', { exact: true })).toBeVisible()
  },
}

export const ImagesSessionWorkflow: Story = {
  args: { activeTab: 'images' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Keep image selection when returning to the workspace pane', async () => {
      await userEvent.click(canvas.getByText('Select all', { exact: true }))
      await expect(canvas.getByRole('checkbox', { name: 'Select all' })).toBeChecked()
      await userEvent.click(canvas.getByRole('tab', { name: 'Capture' }))
      await userEvent.click(canvas.getByRole('tab', { name: 'Images' }))
      await expect(canvas.getByRole('checkbox', { name: 'Select all' })).toBeChecked()
    })
  },
}

/** [임시] Statics 탭 — 촬영·라벨링 집계. 숫자는 전부 mock 이다. */
export const Statics: Story = { args: { activeTab: 'statics' } }

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

/**
 * System Settings — 촬영 화면 위에 뜬다. 탭 10개가 앱과 같은 순서로 서고,
 * 눌러 가며 앱에서와 같은 흐름으로 본다. `settingsTab` 으로 처음 열 탭을 바꿀 수 있다.
 */
export const Settings: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'connection' },
}

/** Session-only draft; replay/reset starts from fixture defaults. */
export const SettingsDraftWorkflow: Story = {
  ...DIALOG_ONLY,
  args: { settingsTab: 'general' },
  play: async ({ canvasElement, args, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const gear = page.getByRole('button', { name: 'Settings' })
    await step('Gear opens General and volume edits persist across tabs', async () => {
      await userEvent.click(gear)
      const slider = page.getByRole('slider')
      slider.focus()
      await userEvent.keyboard('{ArrowLeft}')
      const editedValue = slider.getAttribute('aria-valuenow') ?? (slider as HTMLInputElement).value
      await userEvent.click(page.getByRole('tab', { name: 'Connection' }))
      await userEvent.click(page.getByRole('tab', { name: 'General' }))
      const restored = page.getByRole('slider')
      await expect(restored.getAttribute('aria-valuenow') ?? (restored as HTMLInputElement).value).toBe(editedValue)
      await userEvent.keyboard('{Escape}')
      await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
      await expect(gear).toHaveFocus()
      await userEvent.click(gear)
      const reopened = page.getByRole('slider')
      await expect(reopened.getAttribute('aria-valuenow') ?? (reopened as HTMLInputElement).value).toBe(editedValue)
    })
    await step('Preview and message test are observable mock actions', async () => {
      await userEvent.click(page.getAllByRole('button', { name: /Preview/ })[0])
      await expect(args.onMockAction).toHaveBeenCalledWith('sound-preview', expect.any(Object))
      await userEvent.click(page.getByRole('button', { name: 'Send test notification' }))
      await expect(page.getByText(/Mock message test: success/)).toBeVisible()
      await expect(args.onMockAction).toHaveBeenCalledWith('message-test', { outcome: 'ok' })
    })
    await step('Close button closes and gear reopens the session draft', async () => {
      await userEvent.click(within(page.getByRole('dialog')).getByRole('button', { name: 'Close dialog' }))
      await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
      await userEvent.click(gear)
      await expect(page.getByText(/Mock message test: success/)).toBeVisible()
    })
  },
}

export const LightingDraftWorkflow: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'lighting' },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const auto = () => page.getByRole('button', { name: 'Auto (prefer secondary)' })
    await userEvent.click(auto())
    await expect(auto()).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(page.getByRole('tab', { name: 'Connection' }))
    await userEvent.click(page.getByRole('tab', { name: 'Lighting' }))
    await expect(auto()).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Escape}')
    await userEvent.click(page.getByRole('button', { name: 'Settings' }))
    await expect(auto()).toHaveAttribute('aria-pressed', 'true')
  },
}

export const ExperimentsDraftWorkflow: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'experiments' },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByText('Multi-period experiment', { exact: true }))
    await expect(page.getByText(/Mock: 36 frames/)).toBeVisible()
    await userEvent.click(page.getAllByRole('button', { name: 'Remove period' })[0])
    await userEvent.click(page.getAllByRole('button', { name: 'Remove period' })[0])
    await expect(page.getByText('analysis', { exact: true })).toBeVisible()
    await expect(page.getByText(/Mock: 12 frames/)).toBeVisible()
    await userEvent.click(page.getByRole('tab', { name: 'Connection' }))
    await userEvent.click(page.getByRole('tab', { name: 'Experiments' }))
    await expect(page.getByText('analysis', { exact: true })).toBeVisible()
    await expect(page.getByText(/Mock: 12 frames/)).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await userEvent.click(page.getByRole('button', { name: 'Settings' }))
    await expect(page.getByText('analysis', { exact: true })).toBeVisible()
    await expect(page.getByText(/Mock: 12 frames/)).toBeVisible()
  },
}

export const MockMessageFailed: Story = {
  ...DIALOG_ONLY,
  args: { settingsOpen: true, settingsTab: 'general', mockMessageResult: 'failed' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Send test notification' }))
    await expect(page.getByText(/Mock message test: failed/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('message-test', { outcome: 'failed' })
  },
}

export const SequenceCancelWorkflow: Story = {
  ...SequenceFailed,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(args.onMockAction).toHaveBeenCalledWith('sequence-cancel')
  },
}

export const SequenceEscapeWorkflow: Story = {
  ...SequenceFailed,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await expect(page.getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(args.onMockAction).toHaveBeenCalledWith('sequence-cancel')
  },
}

export const SequenceRetryWorkflow: Story = {
  ...SequenceFailed,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: /Retry/i }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(page.getByText('Mock retry complete; no images were captured.')).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('sequence-retry')
  },
}

export const CapturingKeyboardLock: Story = {
  ...Capturing,
  play: async ({ canvasElement, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const capture = page.getByRole('tab', { name: 'Capture', hidden: true })
    await step('Busy navigation is inert to both pointer and keyboard', async () => {
      await expect(capture.closest('[inert]')).not.toBeNull()
      for (let i = 0; i < 16; i += 1) {
        await userEvent.tab()
        await expect(canvasElement.ownerDocument.activeElement?.closest('[inert]')).toBeNull()
      }
      await userEvent.keyboard('{ArrowRight}{Enter}')
      await expect(capture).toHaveAttribute('aria-selected', 'true')
      await expect(page.getByRole('button', { name: 'Settings', hidden: true }).closest('[inert]')).not.toBeNull()
    })
  },
}
