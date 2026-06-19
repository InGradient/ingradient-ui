// Workspace 전체 화면 합성. 실제 앱의
// EdgeAppShellView > MainLayoutView(topBar/leftPanel/center=WorkspaceView/rightPanel)
// 구조를 재현하고, Settings/Connection 모달과 탭/패널을 시나리오별로 채운다.
import { useState } from 'react'
import {
  MainLayoutView,
  WorkspaceView,
  type WorkspaceTab,
  type WorkspaceMode,
  type WorkspaceLabels,
  type ConnectionStatus,
  type SettingsTab,
} from '@ingradient/edge-pages'
import { SAMPLE_TAB_ITEMS } from '../../../../fixtures/edge/0.0.1/workspace-tabs'
import {
  EdgeAppFrame,
  buildTopBar,
} from '../shared/build-shell-slots'
import { SAMPLE_PROJECT_NAME, SAMPLE_DATASET_NAME } from '../shared/labels'
import { CaptureContent } from './build-capture-content'
import { SetupContent } from './build-setup-content'
import { ImagesContent, type ImagesModalMode } from './build-images-content'
import { StaticsContent } from './build-statics-content'
import { BBoxCanvasScene } from './build-bbox-canvas'
import { RightPanel, LogPanel } from './build-panels'
import { SettingsModalContent } from './build-settings-modal'
import { ConnectionTabContent } from './build-connection-content'

const WORKSPACE_LABELS: WorkspaceLabels = {
  saving: 'Saving…', sequenceFailed: 'Sequence failed', errorCode: 'Error:',
  cancel: 'Cancel', retry: 'Retry',
}

export interface WorkspaceSceneArgs {
  activeTab?: WorkspaceTab
  mode?: WorkspaceMode
  isCapturing?: boolean
  sequenceFailure?: boolean
  imagesModalMode?: ImagesModalMode
  settingsTab?: SettingsTab | null
  logFilterOpen?: boolean
  connectionStatus?: ConnectionStatus
}

export function WorkspaceScene(args: WorkspaceSceneArgs): JSX.Element {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(args.activeTab ?? 'capture')
  const mode = args.mode ?? 'main'
  const isLabeling = mode === 'labeling'

  const settingsDialog = args.settingsTab
    ? <SettingsModalContent activeTab={args.settingsTab} connectionContent={<ConnectionTabContent />} />
    : null

  const center = (
    <WorkspaceView
      mode={mode}
      isCapturing={args.isCapturing ?? false}
      capturingStatusText="Capturing 3 / 6"
      sequenceFailure={args.sequenceFailure ? { message: 'Pattern y_phase_2 failed to project.', errorCode: 'SEQ-0421' } : null}
      labels={WORKSPACE_LABELS}
      onSequenceFailureCancel={() => undefined}
      onSequenceFailureRetry={() => undefined}
      selectedDatasetId="ds-1"
      activeTab={activeTab}
      tabItems={SAMPLE_TAB_ITEMS}
      onTabChange={setActiveTab}
      isSetupMode={activeTab === 'setup'}
      setupPanelTarget={null}
      setupPanelContent={null}
      captureContent={
        activeTab === 'capture' || activeTab === 'setup'
          ? <CaptureContent isCapturing={args.isCapturing} isSetupMode={activeTab === 'setup'} />
          : null
      }
      imagesContent={activeTab === 'images' ? <ImagesContent modalMode={args.imagesModalMode} /> : null}
      staticsContent={activeTab === 'statics' ? <StaticsContent /> : null}
      isSavingLabel={false}
      labelingContent={isLabeling ? <BBoxCanvasScene /> : null}
    />
  )

  const content = (
    <MainLayoutView
      topBar={buildTopBar({
        project: SAMPLE_PROJECT_NAME,
        dataset: SAMPLE_DATASET_NAME,
        connectionStatus: args.connectionStatus,
        settingsDialog,
      })}
      leftPanel={<LogPanel filterOpen={args.logFilterOpen} />}
      centerContent={center}
      rightPanel={activeTab === 'setup' ? <SetupContent /> : <RightPanel />}
      isCapturing={args.isCapturing ?? false}
    />
  )

  return (
    <EdgeAppFrame
      content={content}
      showFooter
    />
  )
}
