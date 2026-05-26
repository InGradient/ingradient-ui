import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  EdgeAppShellView, MainLayoutView,
  TitleBarView, TopBarView, BottomBarView,
  LoginView, LicenseView,
  DatasetSelectView,
  WorkspaceView,
  RightPanelView,
  LogPanelView,
  BBoxCanvasView,
  ImagesView,
  type WorkspaceTab,
  type WorkspaceMode,
  type ConnectionStatus,
  type ImageItem,
  type BBox,
} from '@ingradient/edge-pages'
import { SAMPLE_GROUPS, SAMPLE_RECENT } from '../../../fixtures/edge/0.0.1/dataset-groups'
import { NORMAL_STATS } from '../../../fixtures/edge/0.0.1/system-stats'
import { SAMPLE_TAB_ITEMS } from '../../../fixtures/edge/0.0.1/workspace-tabs'
import {
  SAMPLE_IMAGE_DATA_URL, SAMPLE_CLASSES_FULL, SAMPLE_BBOXES, SAMPLE_IMAGE_ITEMS,
} from '../../../fixtures/edge/0.0.1/sample-images'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'AppShell',
  referenceStory: 'Pages / Edge / 0.0.1 / AppShell / WorkspaceCapture',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/*',
  requiredScenarios: ['offline-loading', 'offline-login', 'online-login', 'dataset-select', 'workspace-capture', 'workspace-labeling-active', 'workspace-images-tab', 'workspace-images-modal-labeling', 'workspace-images-modal-readonly', 'system-monitor'],
  interactions: ['전체 electron 화면 layout 확인 (TitleBar + content + BottomBar)'],
  platformIntegration: ['ingradient-edge 의 App.tsx + MainLayout.tsx 를 본 view 로 마이그레이션'],
})

// ── Shared labels ─────────────────────────────────────────────────────────────

const TITLE_BAR_LABELS = {
  appName: 'Ingradient Edge',
  minimize: '최소화', maximize: '최대화', restore: '복원', close: '닫기',
}

const TOP_BAR_LABELS = {
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Camera setup — permission required',
}

const BOTTOM_BAR_LABELS = {
  deletingSimple: 'Deleting…',
  syncing: (n: number) => `Syncing ${n}…`,
  syncDone: 'Synced', syncFailed: (n: number) => `${n} failed`,
  openMonitor: 'Open monitor',
  connected: 'Connected', disconnected: 'Disconnected',
  diskUsage: (p: string) => `Disk: ${p}`,
  cpuUsage: (p: string) => `CPU: ${p}`,
  memoryUsage: (p: string) => `Memory: ${p}`,
}

const LOGIN_LABELS = {
  title: 'INGRADIENT Edge', online: 'Online', offline: 'Offline',
  onlineSupport: 'Online support', loadPackage: 'Load package', loading: 'Loading…',
  emailLabel: 'Email', emailPlaceholder: 'operator@line-a.local',
  passwordLabel: 'Password', passwordPlaceholder: 'Enter password',
  savePassword: 'Save password', keepSignedIn: 'Keep signed in',
  submit: 'Sign in', submitting: 'Signing in…', register: 'Register',
  greeting: (name: string) => `Hi, ${name}`, continueSession: 'Continue',
  changeAccount: 'Switch account', settingsTitle: 'Settings',
}

const LICENSE_LABELS = {
  title: 'INGRADIENT Edge', subtitle: 'Activate this device.',
  bindHint: 'Package is server-bound.', hint: 'Enter activation key.',
  fingerprintLabel: 'Device fingerprint', copy: 'Copy', copied: 'Copied!',
  keyLabel: 'License key', activate: 'Activate', activating: 'Activating…',
  bindButton: 'Bind device', binding: 'Binding…', settingsTitle: 'Settings',
}

const DATASET_LABELS = {
  title: 'Datasets', online: 'Online', offline: 'Offline', refresh: 'Refresh',
  settingsTitle: 'Settings', settingsDisabledTitle: 'No permission',
  recentLabel: 'Recent', recentBadge: 'Latest', addDataset: 'Add dataset',
  noClasses: 'No classes', more: 'More', export: 'Export', loading: 'Loading…',
  emptyOffline: 'No datasets offline.', emptyOnline: 'No datasets.',
  createOnPlatform: 'Create on Platform.', sessionExpiredTitle: 'Session expired',
  sessionExpiredDesc: 'Sign in again.', sessionExpiredConfirm: 'Sign in', cancel: 'Cancel',
  images: (n: number) => `${n} images`, roleLabel: (r: string) => r,
}

const WORKSPACE_LABELS = {
  saving: 'Saving…', sequenceFailed: 'Sequence failed', errorCode: 'Error:',
  cancel: 'Cancel', retry: 'Retry',
}

const RIGHT_PANEL_LABELS = {
  classLabel: 'CLASSES', noClasses: 'No classes', noClassMatches: 'No matches',
  searchClasses: 'Search…', patternPreview: 'PATTERN PREVIEW',
  samRoi: 'ROI', samRoiActive: 'ROI — drawing',
  samRoiViewer: 'ROI viewer', samRoiViewerActive: 'ROI viewer — on',
  samRoiHint: 'Segment with SAM', samRoiViewerHint: 'Show saved ROI',
}

const LOG_PANEL_LABELS = {
  title: 'Activity',
  filterButton: 'Filter',
  filterByDate: 'Filter by date',
  filterLogType: 'Log type',
  filterProgress: 'Show progress',
  filterConnections: 'Show connections',
  filterDebug: 'Show debug',
  dateAll: 'All', dateToday: 'Today',
  dateLast7: 'Last 7 days', dateLast30: 'Last 30 days', dateCustom: 'Custom',
  dateFrom: 'From', dateTo: 'To',
  noActivity: 'No activity yet.',
  hoverHint: 'Hover a log entry to see details.',
  openSavedImage: 'Open saved image',
}

const SAMPLE_LOG_ENTRIES = [
  { msg: '[12:30:21] Camera connected', type: 'success' as const, createdAt: new Date(2026, 4, 20, 12, 30, 21).toISOString() },
  { msg: '[12:30:45] Low frame rate detected', type: 'info' as const, createdAt: new Date(2026, 4, 20, 12, 30, 45).toISOString() },
  { msg: '[12:31:02] Capture saved. 6 patterns', type: 'success' as const, createdAt: new Date(2026, 4, 20, 12, 31, 2).toISOString(), detail: 'sequence_id: seq-001\npatterns: 6\nduration_ms: 4810\nbboxes: 3' },
  { msg: '[12:31:30] [DEBUG] frame buffer rotated', type: 'info' as const, createdAt: new Date(2026, 4, 20, 12, 31, 30).toISOString() },
  { msg: '[12:32:11] Capture failed: GVCP timeout', type: 'error' as const, createdAt: new Date(2026, 4, 20, 12, 32, 11).toISOString(), detail: 'error_code: SEQ-0421\nfailed_step: 3\nfailed_pattern: y_phase_2' },
]

const SAMPLE_USER = { name: 'Mina Park', email: 'mina@line-a.local' }

const SAMPLE_CLASSES = [
  { class_id: 'c1', class_name: 'scratch', color: '#f43f5e' },
  { class_id: 'c2', class_name: 'dent', color: '#f59e0b' },
  { class_id: 'c3', class_name: 'stain', color: '#10b981' },
]

// ── Shared slot scenes ────────────────────────────────────────────────────────

const TitleBarSlot = (
  <TitleBarView
    isMaximized={false}
    labels={TITLE_BAR_LABELS}
    onMinimize={() => undefined} onMaximize={() => undefined} onClose={() => undefined}
  />
)

const BottomBarSlot = (
  <BottomBarView
    isConnected syncStatus="idle" syncPending={0} syncFailed={0}
    stats={NORMAL_STATS} deleteProgress={false}
    labels={BOTTOM_BAR_LABELS} onOpenMonitor={() => undefined}
  />
)

function TopBarSlot({ project, dataset }: { project?: string | null; dataset?: string | null }) {
  return (
    <TopBarView
      selectedProjectName={project ?? null}
      selectedDatasetName={dataset ?? null}
      connectionStatus={'connected' as ConnectionStatus}
      connectionTitle="Connected"
      isRefreshing={false} canSetupCamera
      labels={TOP_BAR_LABELS}
      langSelector={<span style={{ fontSize: 12, color: 'var(--ig-color-text-muted)' }}>EN</span>}
      accountMenu={<span style={{ fontSize: 12, color: 'var(--ig-color-text-muted)' }}>{SAMPLE_USER.name}</span>}
      settingsDialog={null}
      onBackToDatasets={() => undefined} onRefresh={() => undefined} onOpenSettings={() => undefined}
    />
  )
}

function LoginContent({ mode }: { mode: 'online' | 'offline' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <LoginView
      mode={mode} email={email} password={password} savePassword keepSignedIn
      loggingIn={false} loadingPackage={false} error={null}
      packageInfo={null} savedSession={null} otherAccounts={[]}
      hasAccountList={false} showLoginForm externalUrl="https://app.ingradient.ai"
      labels={LOGIN_LABELS}
      langSelector={<span style={{ fontSize: 12 }}>EN</span>}
      settingsDialog={null}
      onEmailChange={setEmail} onPasswordChange={setPassword}
      onSavePasswordChange={() => undefined} onKeepSignedInChange={() => undefined}
      onSubmit={(e) => e.preventDefault()}
      onContinueSession={() => undefined} onSelectAccount={() => undefined}
      onChangeAccount={() => undefined} onLoadPackage={() => undefined}
      onOpenSettings={() => undefined} onOpenSignup={() => undefined}
    />
  )
}

function LicenseContent() {
  const [licenseKey, setLicenseKey] = useState('')
  return (
    <LicenseView
      mode="key" fingerprint="A1B2-C3D4-E5F6-7890"
      licenseKey={licenseKey} submitting={false} copied={false} error={null}
      labels={LICENSE_LABELS}
      langSelector={<span style={{ fontSize: 12 }}>EN</span>}
      settingsDialog={null}
      onLicenseKeyChange={setLicenseKey} onSubmit={(e) => e.preventDefault()}
      onBind={() => undefined} onCopyFingerprint={() => undefined}
      onOpenSettings={() => undefined}
    />
  )
}

function DatasetSelectContent() {
  return (
    <DatasetSelectView
      mode="online" connectionStatus="connected" connectionTitle="Connected"
      canSetupCamera
      loading={false} fetchError={null}
      recentDatasets={SAMPLE_RECENT} groups={SAMPLE_GROUPS}
      totalDatasets={4} latestDatasetId={SAMPLE_RECENT[0]?.dataset.dataset_id ?? null}
      openDotMenuDatasetId={null} sessionExpired={false}
      labels={DATASET_LABELS}
      langSelector={<span style={{ fontSize: 12 }}>EN</span>}
      accountMenu={<span style={{ fontSize: 12 }}>{SAMPLE_USER.name}</span>}
      settingsDialog={null} exportModal={null} addDatasetModal={null}
      onRefresh={() => undefined} onOpenSettings={() => undefined}
      onSelectDataset={() => undefined} onAddDatasetClick={() => undefined}
      onExportClick={() => undefined} onToggleDotMenu={() => undefined}
      onSessionExpiredConfirm={() => undefined} onSessionExpiredCancel={() => undefined}
    />
  )
}

function WorkspaceContent({ activeTabDefault = 'capture' as WorkspaceTab, mode = 'main' as WorkspaceMode }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(activeTabDefault)
  return (
    <WorkspaceView
      mode={mode}
      isCapturing={false} capturingStatusText="Capturing…"
      sequenceFailure={null} labels={WORKSPACE_LABELS}
      onSequenceFailureCancel={() => undefined} onSequenceFailureRetry={() => undefined}
      selectedDatasetId="ds-1"
      activeTab={activeTab} tabItems={SAMPLE_TAB_ITEMS} onTabChange={setActiveTab}
      isSetupMode={activeTab === 'setup'} setupPanelTarget={null} setupPanelContent={null}
      captureContent={<Placeholder>Capture view</Placeholder>}
      imagesContent={<Placeholder>Images grid</Placeholder>}
      staticsContent={<Placeholder>Statistics</Placeholder>}
      isSavingLabel={false}
      labelingContent={<Placeholder>BBox canvas</Placeholder>}
    />
  )
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ig-color-text-muted)', fontSize: 13 }}>
      {children}
    </div>
  )
}

function RightPanelSlot() {
  const [classSearch, setClassSearch] = useState('')
  return (
    <RightPanelView
      workspaceTab="capture" classes={SAMPLE_CLASSES} selectedClassId="c1"
      showPatternPreview={false} patternLabels={[]} previewPatternLabel={null}
      showRoiButton isDerivedViewActive={false} samActive={false} samViewerActive={false}
      classSearch={classSearch} commentSection={null}
      labels={RIGHT_PANEL_LABELS}
      onSetClassSearch={setClassSearch} onSelectClass={() => undefined}
      onTogglePattern={() => undefined} onToggleSamRoi={() => undefined}
    />
  )
}

function LogPanelSlot() {
  const [showFilterPopover, setShowFilterPopover] = useState(false)
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'last7' | 'last30' | 'custom'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [showConnections, setShowConnections] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null)
  const [panelHovered, setPanelHovered] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  void panelHovered

  const entries = SAMPLE_LOG_ENTRIES.map((log, index) => ({ log, index }))
  const hoveredLog = hoveredLogIndex !== null ? SAMPLE_LOG_ENTRIES[hoveredLogIndex] ?? null : null

  return (
    <LogPanelView
      entries={entries}
      hasMore={false}
      showFilterPopover={showFilterPopover}
      datePreset={datePreset}
      dateFrom={dateFrom}
      dateTo={dateTo}
      showProgress={showProgress}
      showConnections={showConnections}
      showDebug={showDebug}
      hoveredLogIndex={hoveredLogIndex}
      displayedLogIndex={hoveredLogIndex}
      hoveredLog={hoveredLog}
      displayImageUrl={null}
      modalImageUrl={modalImageUrl}
      labels={LOG_PANEL_LABELS}
      onToggleFilterPopover={() => setShowFilterPopover((v) => !v)}
      onCloseFilterPopover={() => setShowFilterPopover(false)}
      onSetDatePreset={setDatePreset}
      onSetDateFrom={setDateFrom}
      onSetDateTo={setDateTo}
      onSetShowProgress={setShowProgress}
      onSetShowConnections={setShowConnections}
      onSetShowDebug={setShowDebug}
      onSetHoveredLogIndex={setHoveredLogIndex}
      onSetPanelHovered={setPanelHovered}
      onScrollNearBottom={() => undefined}
      onOpenImageModal={setModalImageUrl}
      onCloseImageModal={() => setModalImageUrl(null)}
      onOpenSavedImage={() => undefined}
    />
  )
}

function WorkspaceWithLayout({ activeTab = 'capture' as WorkspaceTab, leftPanel = 'log' as 'log' | 'sequence' }) {
  return (
    <MainLayoutView
      topBar={<TopBarSlot project="Line A Surface Inspection" dataset="2026-05-19 morning shift" />}
      leftPanel={leftPanel === 'log' ? <LogPanelSlot /> : <Placeholder>Sequence pattern panel</Placeholder>}
      centerContent={<WorkspaceContent activeTabDefault={activeTab} />}
      rightPanel={<RightPanelSlot />}
      isCapturing={false}
    />
  )
}

// ── Labeling 시나리오 ────────────────────────────────────────────────────────

const BBOX_LABELS = {
  save: 'Save', skip: 'Skip', retry: 'Retry', reset: 'Reset',
  enterFullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen',
  bboxCount: (n: number) => `${n} bbox`,
  blockMsgRequireLabel: 'At least 1 bbox required',
  blockMsgRequireMinBbox: (n: number) => `At least ${n} bboxes required`,
  hint: 'Drag to draw a bbox · click bbox to select',
  showAnnotations: 'Show annotations',
  hideAnnotations: 'Hide annotations',
  cursorMode: 'Cursor mode',
  bboxMode: 'Draw bbox',
}

function BBoxCanvasScene({
  initialBboxes = SAMPLE_BBOXES,
  readOnly = false,
  imageSrc = SAMPLE_IMAGE_DATA_URL,
  inModal = false,
  editMode: editModeProp,
  annotationsVisible,
  onBboxesChange,
}: {
  initialBboxes?: typeof SAMPLE_BBOXES
  readOnly?: boolean
  imageSrc?: string
  /** modal 안 사용 — 자체 chrome (hint / overlay controls / toolbar) 모두 숨김 */
  inModal?: boolean
  /** controlled — modal 등 외부에서 제어 시 전달 */
  editMode?: 'cursor' | 'bbox'
  annotationsVisible?: boolean
  onBboxesChange?: (bboxes: typeof SAMPLE_BBOXES) => void
}) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>('c1')
  const [internalMode, setInternalMode] = useState<'cursor' | 'bbox'>(readOnly ? 'cursor' : 'bbox')
  const effectiveMode = editModeProp ?? internalMode
  const hideChrome = inModal || readOnly
  return (
    <BBoxCanvasView
      imageDataUrl={imageSrc}
      classes={SAMPLE_CLASSES_FULL}
      selectedClassId={selectedClassId}
      editMode={effectiveMode}
      initialBboxes={initialBboxes}
      options={{ require_labeling: false, require_min_bbox_count: 0, block_next_without_labeling: false }}
      hideActions={hideChrome}
      hideHint={hideChrome}
      hideOverlayControls={inModal}
      annotationsVisible={annotationsVisible}
      labels={BBOX_LABELS}
      onSave={() => undefined}
      onSkip={() => undefined}
      onRetry={() => undefined}
      onEditModeChange={editModeProp || readOnly ? undefined : setInternalMode}
      onSelectionChange={(_, classId) => { if (classId) setSelectedClassId(classId) }}
      onBboxesChange={onBboxesChange as (bboxes: BBox[]) => void}
    />
  )
}

function LabelingRightPanelSlot() {
  const [classSearch, setClassSearch] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('c1')
  return (
    <RightPanelView
      workspaceTab="capture"
      classes={SAMPLE_CLASSES_FULL}
      selectedClassId={selectedClassId}
      showPatternPreview={false} patternLabels={[]} previewPatternLabel={null}
      showRoiButton isDerivedViewActive={false} samActive={false} samViewerActive={false}
      classSearch={classSearch} commentSection={null}
      labels={RIGHT_PANEL_LABELS}
      onSetClassSearch={setClassSearch}
      onSelectClass={setSelectedClassId}
      onTogglePattern={() => undefined} onToggleSamRoi={() => undefined}
    />
  )
}

function LabelingWorkspaceLayout() {
  const tabItems = SAMPLE_TAB_ITEMS
  return (
    <MainLayoutView
      topBar={<TopBarSlot project="Line A Surface Inspection" dataset="2026-05-19 morning shift" />}
      leftPanel={<LogPanelSlot />}
      centerContent={
        <WorkspaceView
          mode="labeling"
          isCapturing={false} capturingStatusText="" sequenceFailure={null}
          labels={WORKSPACE_LABELS}
          onSequenceFailureCancel={() => undefined} onSequenceFailureRetry={() => undefined}
          selectedDatasetId="ds-1"
          activeTab="capture" tabItems={tabItems} onTabChange={() => undefined}
          isSetupMode={false} setupPanelTarget={null} setupPanelContent={null}
          captureContent={null} imagesContent={null} staticsContent={null}
          isSavingLabel={false}
          labelingContent={<BBoxCanvasScene />}
        />
      }
      rightPanel={<LabelingRightPanelSlot />}
      isCapturing={false}
    />
  )
}

// ── Images 탭 시나리오 ────────────────────────────────────────────────────────

const IMAGES_LABELS = {
  filterTitle: 'Filter',
  selectAll: 'Select all',
  deleteSelected: (n: number) => n > 0 ? `Delete (${n})` : 'Delete',
  empty: 'No images',
  emptyOffline: 'No images offline',
  retry: 'Retry',
  deleteConfirmTitle: 'Delete images',
  deleteConfirmDesc: (n: number) => `Delete ${n} images? This cannot be undone.`,
  deleteConfirm: 'Delete', cancel: 'Cancel',
  loading: 'Loading…', loadingMore: 'Loading more…',
  dateFilter: {
    title: 'Date', all: 'All', today: 'Today',
    last7: 'Last 7 days', last30: 'Last 30 days', custom: 'Custom',
    from: 'From', to: 'To',
  },
  grid: {
    uploading: 'Uploading',
    conversionPending: 'Converting',
    uploadFailed: (err: string | null | undefined) => err ? `Upload failed: ${err}` : 'Upload failed',
    deleteGroup: 'Delete group',
  },
  modal: {
    cursorMode: 'Cursor mode',
    bboxMode: 'Draw bbox',
    hintDraw: 'Drag to draw a bbox',
    hintNoClass: 'Select a class first',
    hintSelect: 'Click bbox to select · drag handles to resize',
    close: 'Close',
    showAnnotations: 'Show annotations',
    hideAnnotations: 'Hide annotations',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
    bboxCount: (n: number) => `${n} bbox`,
  },
}

type ImagesModalMode = 'closed' | 'edit' | 'readonly'

function ImagesContent({ modalMode = 'closed' as ImagesModalMode }: { modalMode?: ImagesModalMode }) {
  const [selectedIds] = useState<Set<string>>(new Set())
  const [modalEditMode, setModalEditMode] = useState<'cursor' | 'bbox'>('bbox')
  const [annotationsVisible, setAnnotationsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const activeImage = SAMPLE_IMAGE_ITEMS[0]
  const isOpen = modalMode !== 'closed'
  const isEdit = modalMode === 'edit'

  const initialBboxes = (activeImage?.bboxes ?? SAMPLE_BBOXES) as typeof SAMPLE_BBOXES
  const [bboxCount, setBboxCount] = useState(initialBboxes.length)

  // edit / readonly 모두 BBoxCanvasView 사용 — modal 안에서는 자체 chrome 모두 숨김
  const canvasContent = isOpen
    ? <BBoxCanvasScene
        readOnly={!isEdit}
        inModal
        editMode={modalEditMode}
        annotationsVisible={annotationsVisible}
        imageSrc={activeImage?.fullSrc ?? SAMPLE_IMAGE_DATA_URL}
        initialBboxes={initialBboxes}
        onBboxesChange={(bboxes) => setBboxCount(bboxes.length)}
      />
    : null

  const hintText = isEdit
    ? (modalEditMode === 'bbox' ? IMAGES_LABELS.modal.hintDraw : IMAGES_LABELS.modal.hintSelect)
    : null

  return (
    <ImagesView
      groupedImages={SAMPLE_IMAGE_ITEMS}
      groupMap={new Map()}
      sequenceGroupMap={new Map()}
      groupSettings={null}
      classes={SAMPLE_CLASSES_FULL}
      loading={false} loadingMore={false} hasMore={false}
      isOnline isDeleting={false}
      datePreset="all" fromDate="" toDate="" filterOpen={false}
      selectedImageIds={selectedIds} selectionMode={false}
      modalOpen={isOpen}
      modalActiveImage={isOpen ? activeImage ?? null : null}
      modalImageSrc={isOpen ? SAMPLE_IMAGE_DATA_URL : null}
      modalEditMode={modalEditMode}
      modalCanvasContent={canvasContent}
      modalHintText={hintText}
      showModalToolbar={isEdit}
      showModalOverlayControls={isOpen}
      modalAnnotationsVisible={annotationsVisible}
      modalIsFullscreen={isFullscreen}
      modalBboxCount={bboxCount}
      pendingDelete={null}
      labels={IMAGES_LABELS}
      getDisplayedGroupMembers={(img) => [img]}
      onLoadMore={() => undefined}
      onSetDatePreset={() => undefined}
      onSetFromDate={() => undefined}
      onSetToDate={() => undefined}
      onToggleFilter={() => undefined}
      onSelectAll={() => undefined}
      onClearSelection={() => undefined}
      onToggleImageSelection={() => undefined}
      onCloseModal={() => undefined}
      onSetModalEditMode={setModalEditMode}
      onSetModalAnnotationsVisible={setAnnotationsVisible}
      onToggleModalFullscreen={() => setIsFullscreen((v) => !v)}
      onConfirmDelete={() => undefined}
      onCancelDelete={() => undefined}
      onDeleteGroup={() => undefined}
      onRetryReload={() => undefined}
      onImageCellClick={() => undefined}
    />
  )
}

function ImagesTabLayout({ modalMode = 'closed' as ImagesModalMode }: { modalMode?: ImagesModalMode }) {
  return (
    <MainLayoutView
      topBar={<TopBarSlot project="Line A Surface Inspection" dataset="2026-05-19 morning shift" />}
      leftPanel={<LogPanelSlot />}
      centerContent={
        <WorkspaceView
          mode="main"
          isCapturing={false} capturingStatusText="" sequenceFailure={null}
          labels={WORKSPACE_LABELS}
          onSequenceFailureCancel={() => undefined} onSequenceFailureRetry={() => undefined}
          selectedDatasetId="ds-1"
          activeTab="images" tabItems={SAMPLE_TAB_ITEMS} onTabChange={() => undefined}
          isSetupMode={false} setupPanelTarget={null} setupPanelContent={null}
          captureContent={null}
          imagesContent={<ImagesContent modalMode={modalMode} />}
          staticsContent={null}
          isSavingLabel={false}
          labelingContent={null}
        />
      }
      rightPanel={<RightPanelSlot />}
      isCapturing={false}
    />
  )
}

// ── Meta + Stories ────────────────────────────────────────────────────────────

type SceneArgs = Parameters<typeof AppShellScene>[0]

function AppShellScene(args: {
  isResolving?: boolean
  contentKey?:
    | 'offline-login' | 'online-login' | 'license' | 'dataset-select'
    | 'workspace-capture' | 'workspace-labeling-active'
    | 'workspace-images-tab' | 'workspace-images-modal-labeling' | 'workspace-images-modal-readonly'
  showSystemMonitor?: boolean
}) {
  const contentKey = args.contentKey ?? 'workspace-capture'
  let content: React.ReactNode = null
  if (contentKey === 'offline-login') content = <LoginContent mode="offline" />
  else if (contentKey === 'online-login') content = <LoginContent mode="online" />
  else if (contentKey === 'license') content = <LicenseContent />
  else if (contentKey === 'dataset-select') content = <DatasetSelectContent />
  else if (contentKey === 'workspace-capture') content = <WorkspaceWithLayout activeTab="capture" />
  else if (contentKey === 'workspace-labeling-active') content = <LabelingWorkspaceLayout />
  else if (contentKey === 'workspace-images-tab') content = <ImagesTabLayout modalMode="closed" />
  else if (contentKey === 'workspace-images-modal-labeling') content = <ImagesTabLayout modalMode="edit" />
  else if (contentKey === 'workspace-images-modal-readonly') content = <ImagesTabLayout modalMode="readonly" />

  return (
    <EdgeAppShellView
      isResolving={args.isResolving ?? false}
      isShuttingDown={false}
      showFooter
      titleBar={TitleBarSlot}
      content={content}
      bottomBar={BottomBarSlot}
      systemMonitorModal={args.showSystemMonitor
        ? <div style={{ position: 'fixed', inset: '20% 30%', background: 'var(--ig-color-surface-raised)', border: '1px solid var(--ig-color-border-strong)', borderRadius: 8, padding: 24, zIndex: 100 }}>
            <h3 style={{ margin: 0 }}>System Monitor</h3>
            <p style={{ color: 'var(--ig-color-text-muted)', fontSize: 13 }}>Placeholder — real modal uses SystemMonitorModalView</p>
          </div>
        : null}
    />
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/AppShell',
  component: AppShellScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof AppShellScene>

export default meta

type Story = StoryObj<SceneArgs>

export const OfflineLoading: Story = { args: { isResolving: true } }
export const OfflineLogin: Story = { args: { contentKey: 'offline-login' } }
export const LicenseGate: Story = { args: { contentKey: 'license' } }
export const OnlineLogin: Story = { args: { contentKey: 'online-login' } }
export const DatasetSelect: Story = { args: { contentKey: 'dataset-select' } }
export const WorkspaceCapture: Story = { args: { contentKey: 'workspace-capture' } }
export const WorkspaceLabelingActive: Story = { args: { contentKey: 'workspace-labeling-active' } }
export const WorkspaceImagesTab: Story = { args: { contentKey: 'workspace-images-tab' } }
export const WorkspaceImagesModalLabeling: Story = { args: { contentKey: 'workspace-images-modal-labeling' } }
export const WorkspaceImagesModalReadOnly: Story = { args: { contentKey: 'workspace-images-modal-readonly' } }
export const SystemMonitorOpen: Story = { args: { contentKey: 'workspace-capture', showSystemMonitor: true } }
