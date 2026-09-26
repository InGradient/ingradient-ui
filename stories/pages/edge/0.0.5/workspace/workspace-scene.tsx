// 촬영 화면 전체 합성 — 실제 앱의
// EdgeAppShellView > MainLayoutView(topBar / Logs / WorkspaceView / RightPanel) 구조 그대로.
import { useState } from 'react'
import {
  MainLayoutView, WorkspaceView, type ConnectionStatus, type WorkspaceTab,
} from '@ingradient/edge-pages'
import {
  DATASET_NAME, PROJECT_NAME, WORKSPACE_LABELS, WORKSPACE_TABS,
} from '../../../../fixtures/edge/0.0.5'
import { EdgeAppFrame, buildTopBar } from '../shared/build-shell'
import { SettingsModal } from '../settings/build-settings-modal'
import { CaptureContent } from './build-capture-content'
import { ImagesContent } from './build-images-content'
import { LogPanel, RightPanel } from './build-panels'
import { StaticsContent } from './build-statics-content'
import { SetupContent } from './build-setup-content'

const noop = (): undefined => undefined

export interface WorkspaceSceneArgs {
  activeTab?: WorkspaceTab
  isCapturing?: boolean
  sequenceFailure?: boolean
  logFilterOpen?: boolean
  connectionStatus?: ConnectionStatus
  /** 설정 다이얼로그를 띄운 상태. */
  settingsOpen?: boolean
  settingsTab?: 'general' | 'connection' | 'camera' | 'capture' | 'lighting' | 'server'
    | 'data' | 'logs' | 'experiments' | 'fieldtest' | 'about'
}

export function WorkspaceScene(args: WorkspaceSceneArgs): JSX.Element {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(args.activeTab ?? 'capture')
  const [settingsOpen, setSettingsOpen] = useState(args.settingsOpen ?? false)

  const center = (
    <WorkspaceView
      mode="main"
      isCapturing={args.isCapturing ?? false}
      capturingStatusText="Capturing... 12/33"
      sequenceFailure={args.sequenceFailure
        ? { message: 'Could not start the capture sequence. Nothing was captured.', errorCode: 'SEQ-0421' }
        : null}
      labels={WORKSPACE_LABELS}
      onSequenceFailureCancel={noop}
      onSequenceFailureRetry={noop}
      selectedDatasetId="ds-260902"
      activeTab={activeTab}
      tabItems={WORKSPACE_TABS}
      onTabChange={setActiveTab}
      isSetupMode={activeTab === 'setup'}
      setupPanelTarget={null}
      setupPanelContent={null}
      captureContent={activeTab === 'capture' || activeTab === 'setup'
        ? <CaptureContent isCapturing={args.isCapturing} isSetupMode={activeTab === 'setup'} />
        : null}
      imagesContent={activeTab === 'images' ? <ImagesContent /> : null}
      staticsContent={activeTab === 'statics' ? <StaticsContent /> : null}
      isSavingLabel={false}
    />
  )

  const content = (
    <MainLayoutView
      topBar={buildTopBar({
        project: PROJECT_NAME,
        dataset: DATASET_NAME,
        connectionStatus: args.connectionStatus,
        settingsDialog: settingsOpen
          ? <SettingsModal initialTab={args.settingsTab ?? 'connection'} onClose={() => setSettingsOpen(false)} />
          : null,
      })}
      leftPanel={<LogPanel filterOpen={args.logFilterOpen} />}
      centerContent={center}
      rightPanel={activeTab === 'setup' ? <SetupContent /> : <RightPanel workspaceTab={activeTab} />}
      isCapturing={args.isCapturing ?? false}
    />
  )

  return <EdgeAppFrame content={content} showFooter />
}
