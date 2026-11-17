// 촬영 화면 전체 합성 — 실제 앱의
// EdgeAppShellView > MainLayoutView(topBar / Logs / WorkspaceView / RightPanel) 구조 그대로.
import { useState } from 'react'
import {
  MainLayoutView, WorkspaceView, type ConnectionStatus, type WorkspaceTab, type LightingMode, type PreviewPatternLabel, type CaptureOptimizePhase,
} from '@ingradient/edge-pages'
import {
  DATASET_NAME, PROJECT_NAME, SAMPLE_IMAGE_ITEMS, WORKSPACE_LABELS, WORKSPACE_TABS,
} from '../../../../fixtures/edge/0.0.5'
import { EdgeAppFrame, buildTopBar } from '../shared/build-shell'
import { SettingsModal } from '../settings/build-settings-modal'
import { useSettingsDraft, type MockAction } from '../settings/tabs-moved'
import { usePlcJudgeDraft } from '../settings/tabs-plc-judge'
import type { JudgeScenario, PlcScenario } from '../../../../fixtures/edge/0.0.5'
import type { PlcStatusTone } from '@ingradient/edge-pages'
import { CaptureContent } from './build-capture-content'
import { ImagesContent, useImagesDraft } from './build-images-content'
import { LogPanel, RightPanel } from './build-panels'
import { StaticsContent } from './build-statics-content'
import { SetupContent } from './build-setup-content'
import { StoryStatus } from '../../../../support/story-probe'

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
  /** Open the image inspector on the first image: view-only, or with the bbox editing toolbar. */
  imagesInspector?: 'view' | 'edit'
  connectionStatus?: ConnectionStatus
  lightingMode?: LightingMode
  /** 설정 다이얼로그를 띄운 상태. */
  settingsOpen?: boolean
  settingsTab?: 'general' | 'connection' | 'camera' | 'capture' | 'lighting' | 'plc' | 'judge' | 'server'
    | 'data' | 'logs' | 'experiments' | 'fieldtest' | 'about'
  /** 0.0.6: PLC Communication · Judge model 탭을 세우고, 상단바 PLC 아이콘이 그 탭을 연다. */
  settingsPlcJudge?: boolean
  /** Statics shows the real app's Live status section (0.0.6). */
  staticsLive?: boolean
  /** Setup as in the real app on 2026-11-16: no feature toggles, unsaved hint, capture optimize, Solid exposure, fringe contrast card (0.0.6). */
  setupLatest?: boolean
  /** Opens the capture-optimize flow in a fixed phase (with setupLatest). */
  setupOptimizePhase?: CaptureOptimizePhase
  plcScenario?: PlcScenario
  judgeScenario?: JudgeScenario
}

/** 상단바 PLC 아이콘 색 — PLC 탭 시나리오와 맞춘다. */
const PLC_TONE: Record<PlcScenario, PlcStatusTone> = {
  'no-address': 'unconfigured', 'no-dataset': 'unconfigured',
  connected: 'connected', 'auto-running': 'connected',
  disconnected: 'disconnected', duplicate: 'disconnected',
}

export function WorkspaceScene(args: WorkspaceSceneArgs): JSX.Element {
  return <WorkspaceSession key={JSON.stringify({ ...args, onMockAction: undefined })} {...args} />
}

function WorkspaceSession(args: WorkspaceSceneArgs): JSX.Element {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(args.activeTab ?? 'capture')
  const [settingsOpen, setSettingsOpen] = useState(args.settingsOpen ?? false)
  const [settingsTab, setSettingsTab] = useState(args.settingsTab ?? 'connection')
  const plcJudge = usePlcJudgeDraft(args.plcScenario, args.judgeScenario)
  const [sequenceFailure, setSequenceFailure] = useState(args.sequenceFailure ?? false)
  const [mockStatus, setMockStatus] = useState('')
  const [previewPatternLabel, setPreviewPatternLabel] = useState<PreviewPatternLabel | null>(null)
  const draft = useSettingsDraft()
  const imagesDraft = useImagesDraft(args.imagesInspector ? SAMPLE_IMAGE_ITEMS[0]?.id ?? null : null)
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
        ? <CaptureContent previewPatternLabel={previewPatternLabel} isConnected={isConnected} isCapturing={args.isCapturing} isSetupMode={activeTab === 'setup'} fringeContrast={args.setupLatest} />
        : null}
      imagesContent={activeTab === 'images' ? <ImagesContent draft={imagesDraft} editable={args.imagesInspector === 'edit'} /> : null}
      staticsContent={activeTab === 'statics' ? <StaticsContent live={args.staticsLive} /> : null}
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
        onOpenSettings: () => { if (!args.isCapturing) { onMockAction('settings-open'); setSettingsTab(args.settingsTab ?? 'connection'); setSettingsOpen(true) } },
        ...(args.settingsPlcJudge ? {
          plc: PLC_TONE[args.plcScenario ?? 'no-address'],
          onOpenPlcSettings: () => { if (!args.isCapturing) { setSettingsTab('plc'); setSettingsOpen(true) } },
        } : {}),
        settingsDialog: settingsOpen
          ? <SettingsModal lightingMode={args.lightingMode} draft={draft} onMockAction={onMockAction} mockMessageResult={args.mockMessageResult} initialTab={settingsTab} plcJudge={args.settingsPlcJudge ? plcJudge : undefined} onClose={() => { onMockAction('settings-close'); setSettingsOpen(false) }} />
          : null,
      })}
      leftPanel={<LogPanel filterOpen={args.logFilterOpen} />}
      centerContent={<>{center}{mockStatus && <StoryStatus>{mockStatus}</StoryStatus>}</>}
      rightPanel={<>
        <div hidden={activeTab !== 'setup'} style={{ height: '100%' }}>
          <SetupContent previewPatternLabel={previewPatternLabel} onPreviewPattern={setPreviewPatternLabel} latest={args.setupLatest} optimizePhase={args.setupOptimizePhase} onMockAction={onMockAction} />
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
