import type { Meta, StoryObj } from '@storybook/react-vite'
import { defineHandoff } from '../../../support/handoff'
import { WorkspaceScene, type WorkspaceSceneArgs } from './workspace/workspace-scene'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'Workspace',
  referenceStory: 'Pages / Edge / 0.0.1 / Workspace / Capture',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/*',
  requiredScenarios: [
    'capture', 'images', 'statics', 'setup', 'labeling', 'labeling-with-failure',
    'capturing', 'images-modal-edit', 'images-modal-readonly',
    'settings-open', 'connection-open', 'log-filter-open', 'offline',
  ],
  interactions: [
    'Tab 전환 (capture/images/statics/setup)',
    'labeling 분기 진입 + sequence failure dialog',
    'Settings 다이얼로그 탭 전환 (connection/server/about/data/camera/logs/fieldtest)',
    'Activity(Log) 패널 필터 popover',
  ],
  platformIntegration: [
    '전체 화면 = EdgeAppShellView + MainLayoutView 합성 (App.tsx + MainLayout.tsx)',
    'tab/panel/modal content 는 edge-pages View 를 mock props 로 렌더',
    '실제 앱에서는 store/hook 결과가 동일 View 에 주입됨',
  ],
})

const meta = {
  title: 'Pages/Edge/0.0.1/Workspace',
  component: WorkspaceScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof WorkspaceScene>

export default meta

type Story = StoryObj<WorkspaceSceneArgs>

// ── 탭 ──────────────────────────────────────────────────────────────────────
export const Capture: Story = { args: { activeTab: 'capture' } }
export const Images: Story = { args: { activeTab: 'images' } }
export const Statics: Story = { args: { activeTab: 'statics' } }
export const Setup: Story = { args: { activeTab: 'setup' } }

// ── 캡처/라벨링 상태 ─────────────────────────────────────────────────────────
export const Capturing: Story = { args: { activeTab: 'capture', isCapturing: true } }
export const Labeling: Story = { args: { mode: 'labeling' } }
export const LabelingWithFailure: Story = { args: { mode: 'labeling', sequenceFailure: true } }

// ── Images 모달 ──────────────────────────────────────────────────────────────
export const ImagesModalEdit: Story = { args: { activeTab: 'images', imagesModalMode: 'edit' } }
export const ImagesModalReadOnly: Story = { args: { activeTab: 'images', imagesModalMode: 'readonly' } }

// ── 모달/패널 ────────────────────────────────────────────────────────────────
export const SettingsOpen: Story = { args: { activeTab: 'capture', settingsTab: 'server' } }
export const ConnectionOpen: Story = { args: { activeTab: 'capture', settingsTab: 'connection' } }
export const LogFilterOpen: Story = { args: { activeTab: 'capture', logFilterOpen: true } }

// ── 연결 상태 ────────────────────────────────────────────────────────────────
export const Offline: Story = { args: { activeTab: 'capture', connectionStatus: 'disconnected' } }
