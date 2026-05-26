import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  WorkspaceView,
  type WorkspaceLabels,
  type WorkspaceMode,
  type WorkspaceTab,
  type SequenceFailureInfo,
} from '@ingradient/edge-pages'
import { SAMPLE_TAB_ITEMS } from '../../../fixtures/edge/0.0.1/workspace-tabs'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'Workspace',
  referenceStory: 'Pages / Edge / 0.0.1 / Workspace / MainCapture',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/workspace-tabs.ts',
  requiredScenarios: ['main-capture', 'main-images', 'main-setup', 'labeling', 'labeling-with-failure', 'main-capturing'],
  interactions: [
    'Tab 전환 (capture/images/statics/setup)',
    'labeling 분기 진입 (pendingCapture 존재)',
    'sequence failure dialog cancel / retry',
    'capturing 시 fixed pill 표시',
  ],
  platformIntegration: [
    'captureContent/imagesContent/staticsContent slot — Phase 6~8 의 sub-view 가 채움',
    'setupPanelContent — ReactDOM.createPortal(target) 으로 마운트',
    'labelingContent — BBoxCanvas 또는 CaptureReviewWithFullscreen',
    '17 useEffect / 12 useCallback 은 container 잔류',
  ],
})

const LABELS: WorkspaceLabels = {
  saving: 'Saving label…',
  sequenceFailed: 'Sequence failed',
  errorCode: 'Error code:',
  cancel: 'Cancel',
  retry: 'Retry',
}

const SAMPLE_FAILURE: SequenceFailureInfo = {
  message: 'Pattern projection out of range. Re-align the projector and retry.',
  errorCode: 'SEQ-0421',
}

function Placeholder({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      flex: 1, minHeight: 280,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: color, color: 'var(--ig-color-text-primary)',
      fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
    }}>
      {label}
    </div>
  )
}

type SceneArgs = Parameters<typeof WorkspaceScene>[0]

function WorkspaceScene(args: {
  mode?: WorkspaceMode
  activeTabDefault?: WorkspaceTab
  selectedDatasetId?: string | null
  isCapturing?: boolean
  capturingStatusText?: string
  sequenceFailure?: SequenceFailureInfo | null
  isSavingLabel?: boolean
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(args.activeTabDefault ?? 'capture')
  const isSetupMode = activeTab === 'setup'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <WorkspaceView
        mode={args.mode ?? 'main'}
        isCapturing={args.isCapturing ?? false}
        capturingStatusText={args.capturingStatusText ?? 'Capturing…'}
        sequenceFailure={args.sequenceFailure ?? null}
        labels={LABELS}
        onSequenceFailureCancel={() => undefined}
        onSequenceFailureRetry={() => undefined}
        selectedDatasetId={args.selectedDatasetId !== undefined ? args.selectedDatasetId : 'ds-1'}
        activeTab={activeTab}
        tabItems={SAMPLE_TAB_ITEMS}
        onTabChange={setActiveTab}
        isSetupMode={isSetupMode}
        setupPanelTarget={null}
        setupPanelContent={null}
        captureContent={<Placeholder label="Capture content placeholder" color="rgba(77, 136, 255, 0.08)" />}
        imagesContent={<Placeholder label="Images grid placeholder" color="rgba(110, 200, 122, 0.08)" />}
        staticsContent={<Placeholder label="Statics charts placeholder" color="rgba(180, 120, 230, 0.08)" />}
        isSavingLabel={args.isSavingLabel ?? false}
        labelingContent={<Placeholder label="BBox canvas placeholder" color="rgba(0, 0, 0, 0.4)" />}
      />
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Workspace',
  component: WorkspaceScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof WorkspaceScene>

export default meta

type Story = StoryObj<SceneArgs>

export const MainCapture: Story = { args: { mode: 'main', activeTabDefault: 'capture' } }

export const MainImages: Story = { args: { mode: 'main', activeTabDefault: 'images' } }

export const MainSetup: Story = { args: { mode: 'main', activeTabDefault: 'setup' } }

export const Labeling: Story = { args: { mode: 'labeling' } }

export const LabelingWithFailure: Story = {
  args: { mode: 'labeling', sequenceFailure: SAMPLE_FAILURE },
}

export const MainCapturing: Story = {
  args: { mode: 'main', isCapturing: true, capturingStatusText: 'Capturing 3/14' },
}
