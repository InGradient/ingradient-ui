// 촬영 화면 전체 합성 — 실제 앱의
// EdgeAppShellView > MainLayoutView(topBar / Logs / WorkspaceView / RightPanel) 구조 그대로.
import { useState } from 'react'
import {
  MainLayoutView, WorkspaceView, type ConnectionStatus, type WorkspaceTab, type LightingMode, type PreviewPatternLabel,
} from '@ingradient/edge-pages'
import {
  DATASET_NAME, PROJECT_NAME, WORKSPACE_LABELS, WORKSPACE_TABS,
} from '../../../../fixtures/edge/0.0.5'
import { EdgeAppFrame, buildTopBar } from '../shared/build-shell'
import { SettingsModal } from '../settings/build-settings-modal'
import { useSettingsDraft, type MockAction } from '../settings/tabs-moved'
import { CaptureContent } from './build-capture-content'
import { ImagesContent, useImagesDraft } from './build-images-content'
import { LogPanel, RightPanel } from './build-panels'
import { StaticsContent } from './build-statics-content'
import { SetupContent } from './build-setup-content'

const noop = (): undefined => undefined

export interface WorkspaceSceneArgs {
  /** Change this key to begin a fresh synthetic Workspace session. */
  scenarioResetKey?: number
  onMockAction?: MockAction
  mockMessageResult?: 'ok' | 'failed'
  activeTab?: WorkspaceTab
  isCapturing?: boolean
  sequenceFailure?: boolean
  logFilterOpen?: boolean
  connectionStatus?: ConnectionStatus
  lightingMode?: LightingMode
  /** 설정 다이얼로그를 띄운 상태. */
  settingsOpen?: boolean
  settingsTab?: 'general' | 'connection' | 'camera' | 'lighting' | 'server'
    | 'data' | 'logs' | 'experiments' | 'fieldtest' | 'about'
}

export function WorkspaceScene(args: WorkspaceSceneArgs): JSX.Element {
  return <WorkspaceSession key={JSON.stringify({ ...args, onMockAction: undefined })} {...args} />
}

function WorkspaceSession(args: WorkspaceSceneArgs): JSX.Element {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(args.activeTab ?? 'capture')
  const [settingsOpen, setSettingsOpen] = useState(args.settingsOpen ?? false)
  const [sequenceFailure, setSequenceFailure] = useState(args.sequenceFailure ?? false)
  const [mockStatus, setMockStatus] = useState('')
  const [previewPatternLabel, setPreviewPatternLabel] = useState<PreviewPatternLabel | null>(null)
  const draft = useSettingsDraft()
  const imagesDraft = useImagesDraft()
  const onMockAction = args.onMockAction ?? noop
  const isConnected = (args.connectionStatus ?? 'connected') === 'connected'
  const closeFailure = (action: 'cancel' | 'retry') => {
    onMockAction(`sequence-${action}`)
    setSequenceFailure(false)
    setMockStatus(action === 'retry' ? 'Mock retry complete; no images were captured.' : 'Mock sequence dismissed.')
  }

  const center = (
    <WorkspaceView
      mode="main"
      isCapturing={args.isCapturing ?? false}
      capturingStatusText="Capturing... 12/33"
      sequenceFailure={sequenceFailure
        ? { message: 'Could not start the capture sequence. Nothing was captured.', errorCode: 'SEQ-0421' }
        : null}
      labels={WORKSPACE_LABELS}
      onSequenceFailureCancel={() => closeFailure('cancel')}
      onSequenceFailureRetry={() => closeFailure('retry')}
      selectedDatasetId="ds-260902"
      activeTab={activeTab}
      tabItems={WORKSPACE_TABS}
      onTabChange={(tab) => { if (!args.isCapturing) setActiveTab(tab) }}
      isSetupMode={activeTab === 'setup'}
      setupPanelTarget={null}
      setupPanelContent={null}
      captureContent={activeTab === 'capture' || activeTab === 'setup'
        ? <CaptureContent previewPatternLabel={previewPatternLabel} isConnected={isConnected} isCapturing={args.isCapturing} isSetupMode={activeTab === 'setup'} />
        : null}
      imagesContent={activeTab === 'images' ? <ImagesContent draft={imagesDraft} /> : null}
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
        onMockAction,
        onOpenSettings: () => { if (!args.isCapturing) { onMockAction('settings-open'); setSettingsOpen(true) } },
        settingsDialog: settingsOpen
          ? <SettingsModal lightingMode={args.lightingMode} draft={draft} onMockAction={onMockAction} mockMessageResult={args.mockMessageResult} initialTab={args.settingsTab ?? 'connection'} onClose={() => { onMockAction('settings-close'); setSettingsOpen(false) }} />
          : null,
      })}
      leftPanel={<LogPanel filterOpen={args.logFilterOpen} />}
      centerContent={<>{center}{mockStatus && <p role="status">{mockStatus}</p>}</>}
      rightPanel={<>
        <div hidden={activeTab !== 'setup'} style={{ height: '100%' }}>
          <SetupContent previewPatternLabel={previewPatternLabel} onPreviewPattern={setPreviewPatternLabel} />
        </div>
        <div hidden={activeTab === 'setup'} style={{ height: '100%' }}>
          <RightPanel workspaceTab={activeTab} previewPatternLabel={previewPatternLabel} onPreviewPattern={setPreviewPatternLabel} />
        </div>
      </>}
      isCapturing={args.isCapturing ?? false}
    />
  )

  return <EdgeAppFrame content={content} showFooter isConnected={isConnected} isCapturing={args.isCapturing} onMockAction={onMockAction} />
}
