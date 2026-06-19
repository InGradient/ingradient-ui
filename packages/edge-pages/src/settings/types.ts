import type { ReactNode } from 'react'

// ── Dialog shell ──────────────────────────────────────────────────────────────

export type SettingsTab =
  | 'connection' | 'camera' | 'logs' | 'about' | 'server' | 'data' | 'fieldtest'

export interface CameraSettingsDialogLabels {
  title: string
  close: string
  tabConnection: string
  tabCamera: string
  tabServer: string
  tabData: string
  tabLogs: string
  tabFieldTest: string
  tabAbout: string
}

export interface CameraSettingsDialogViewProps {
  activeTab: SettingsTab
  currentUserRole: string | null

  labels: CameraSettingsDialogLabels

  connectionContent?: ReactNode
  cameraContent?: ReactNode
  serverContent?: ReactNode
  dataContent?: ReactNode
  fieldTestContent?: ReactNode
  logsContent?: ReactNode
  aboutContent?: ReactNode

  onClose: () => void
  onSetActiveTab: (tab: SettingsTab) => void
}

// ── Server tab ────────────────────────────────────────────────────────────────

export type ServerRuntimeMode = 'auto' | 'online' | 'offline'

export interface ServerTabLabels {
  baseUrl: string
  runtimeMode: string
  modeAuto: string
  modeOnline: string
  modeOffline: string
  save: string
  saving: string
  saved: string
  saveError: string
  connectivityCheck: string
  connected: string
  noConnect: string
  hint: string
}

export interface ServerTabViewProps {
  baseUrl: string
  runtimeMode: ServerRuntimeMode
  saving: boolean
  saveResult: 'connected' | 'no-connect' | 'error' | null
  saveMessage: string | null
  connectivityResult: 'online' | 'offline' | 'checking' | null
  labels: ServerTabLabels
  onBaseUrlChange: (value: string) => void
  onRuntimeModeChange: (value: ServerRuntimeMode) => void
  onSave: () => void
}

// ── About tab ─────────────────────────────────────────────────────────────────

export interface AboutTabLabels {
  hero: string
  versionLabel: string
  licenseTitle: string
  licenseStatus: string
  licenseValid: string
  licenseExpired: string
  licenseMissing: string
  expiresAt: string
  fingerprint: string
  deactivateButton: string
  deactivating: string
  deactivationCodeTitle: string
  deactivationCodeHint: string
  releaseTitle: string
  copyrightLine: string
}

export interface AboutTabViewProps {
  appVersion: string
  licenseStatus: 'valid' | 'expired' | 'missing' | 'unknown'
  licenseExpiresAt: string | null
  fingerprint: string | null
  deactivationCode: string | null
  deactivateError: string | null
  isDeactivating: boolean
  labels: AboutTabLabels
  updateSection?: ReactNode
  onOpenDeactivateConfirm: () => void
  onCloseDeactivationCode: () => void
}

// ── Data tab ──────────────────────────────────────────────────────────────────

export interface DataTabLabels {
  title: string
  dataDirLabel: string
  totalSpace: string
  freeSpace: string
  cacheLabel: string
  cleanCache: string
  cleaning: string
  cleanupComplete: string
  openDataDir: string
}

export interface DataTabViewProps {
  dataDirPath: string
  totalBytes: number
  freeBytes: number
  cacheSize: number
  isCleaningCache: boolean
  cleanupCompleted: boolean
  labels: DataTabLabels
  onCleanCache: () => void
  onOpenDataDir: () => void
}

// ── Camera params tab ─────────────────────────────────────────────────────────

export interface CameraParamsTabLabels {
  title: string
  dllPath: string
  applyDllPath: string
  reload: string
  saved: string
  save: string
  exposure: string
  gain: string
  blackLevel: string
  sharpness: string
  gamma: string
  // many more — simplified for Phase 9
  [key: string]: string
}

export interface CameraParamsTabViewProps {
  isConnected: boolean
  cvsCamDllPath: string
  fetching: boolean
  saving: boolean
  saveResult: 'success' | 'error' | null
  labels: CameraParamsTabLabels
  onDllPathChange: (path: string) => void
  onApplyDllPath: () => void
  onSave: () => void
  onReset: () => void
}

// ── Field test tab ────────────────────────────────────────────────────────────

export interface FieldTestTabLabels {
  title: string
  description: string
  run: string
  running: string
  cancel: string
  reset: string
  export: string
  noResults: string
}

export interface FieldTestTabViewProps {
  running: boolean
  progress: number
  hasResults: boolean
  log: string[]
  labels: FieldTestTabLabels
  onRun: () => void
  onCancel: () => void
  onReset: () => void
  onExport: () => void
}

// ── Logs tab ──────────────────────────────────────────────────────────────────

export type LogsSource = 'backend' | 'frontend'

export interface UnifiedLogsTabLabels {
  backend: string
  frontend: string
}

export interface UnifiedLogsTabViewProps {
  source: LogsSource
  backendLogsContent: ReactNode
  frontendLogsContent: ReactNode
  labels: UnifiedLogsTabLabels
  onSetSource: (source: LogsSource) => void
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success' | string
  message: string
  source?: string
}

export interface BackendLogsLabels {
  search: string
  level: string
  all: string
  info: string
  warn: string
  error: string
  refresh: string
  clear: string
  export: string
  empty: string
}

export interface BackendLogsContentViewProps {
  logs: LogEntry[]
  loading: boolean
  refreshing: boolean
  searchQuery: string
  levelFilter: string
  labels: BackendLogsLabels
  onSearchChange: (q: string) => void
  onLevelFilterChange: (level: string) => void
  onRefresh: () => void
  onClear: () => void
  onExport: () => void
}

export interface FrontendLogsLabels {
  search: string
  level: string
  all: string
  info: string
  warn: string
  error: string
  refresh: string
  clear: string
  export: string
  empty: string
}

export interface FrontendLogsContentViewProps {
  logs: LogEntry[]
  refreshing: boolean
  searchQuery: string
  levelFilter: string
  labels: FrontendLogsLabels
  onSearchChange: (q: string) => void
  onLevelFilterChange: (level: string) => void
  onRefresh: () => void
  onClear: () => void
  onExport: () => void
}

// ── Update section ────────────────────────────────────────────────────────────

export type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'noUpdate'

export interface UpdateSectionLabels {
  title: string
  currentVersion: string
  checkForUpdates: string
  checking: string
  available: (version: string) => string
  download: string
  downloading: string
  downloaded: string
  install: string
  noUpdate: string
  error: string
}

export interface UpdateSectionViewProps {
  currentVersion: string
  status: UpdateStatus
  availableVersion: string | null
  progress: number
  error: string | null
  labels: UpdateSectionLabels
  onCheckForUpdates: () => void
  onDownloadUpdate: () => void
  onInstallUpdate: () => void
}
