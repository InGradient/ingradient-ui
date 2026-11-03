import type { ReactNode } from 'react'
import type { ConnectionStatus } from '../dataset-select/types'

// ── TitleBar ──────────────────────────────────────────────────────────────────

export interface TitleBarLabels {
  appName: string
  minimize: string
  maximize: string
  restore: string
  close: string
}

export interface TitleBarViewProps {
  isMaximized: boolean
  /** electron favicon path. 안 주면 @ingradient/ui 의 BrandMark default 사용. */
  logoSrc?: string
  logoAlt?: string
  labels: TitleBarLabels
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

// ── TopBar ────────────────────────────────────────────────────────────────────

export interface TopBarLabels {
  /** Accessible name of the back (chevron) button. */
  backToDatasets?: string
  refresh: string
  settingsTitle: string
  settingsDisabledTitle: string
}

export interface TopBarViewProps {
  selectedProjectName: string | null
  selectedDatasetName: string | null

  connectionStatus: ConnectionStatus
  connectionTitle: string
  isRefreshing: boolean
  canSetupCamera: boolean

  labels: TopBarLabels

  /** PLC link shown next to the camera status; omit when the PLC UI is off. */
  plcStatus?: PlcStatusIndicator
  /** Auto-inspect start/stop control (AutoInspectView), left of the status icons. */
  autoInspect?: ReactNode
  langSelector?: ReactNode
  accountMenu?: ReactNode
  settingsDialog?: ReactNode

  onBackToDatasets: () => void
  onRefresh: () => void
  onOpenSettings: () => void
  /** Camera status icon opens Settings › Connection; falls back to onOpenSettings. */
  onOpenConnectionSettings?: () => void
}

/** connected = linked, disconnected = address set but no link, unconfigured = no PLC address. */
export type PlcStatusTone = 'connected' | 'disconnected' | 'unconfigured'

export interface PlcStatusIndicator {
  tone: PlcStatusTone
  /** Status sentence, e.g. "PLC connected: 192.168.0.10:502". */
  title: string
  /** Opens Settings › PLC Communication. */
  onOpen?: () => void
}

// ── BottomBar ─────────────────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'syncing' | 'done' | 'error'

export interface SystemStats {
  cpu?: number
  memory?: number
  disk?: number
}

export interface BottomBarLabels {
  deletingSimple: string
  syncing: (count: number) => string
  syncDone: string
  syncFailed: (count: number) => string
  openMonitor: string
  connected: string
  disconnected: string
  diskUsage: (pct: string) => string
  cpuUsage: (pct: string) => string
  memoryUsage: (pct: string) => string
}

export interface BottomBarViewProps {
  isConnected: boolean
  syncStatus: SyncStatus
  syncPending: number
  syncFailed: number
  stats: SystemStats | null
  deleteProgress: boolean
  labels: BottomBarLabels
  onOpenMonitor: () => void
}

// ── AccountMenu ───────────────────────────────────────────────────────────────

export interface AccountUser {
  name: string
  email: string
}

export interface AccountHistoryEntry {
  email: string
  name: string
}

export interface AccountMenuLabels {
  account: string
  changeAccount: string
  logout: string
  accountHistory: string
  noAccountHistory: string
  cancel: string
}

export interface AccountMenuViewProps {
  currentUser: AccountUser | null
  accountHistory: AccountHistoryEntry[]

  dropdownOpen: boolean
  changeAccountModalOpen: boolean

  labels: AccountMenuLabels

  onToggleDropdown: () => void
  onCloseDropdown: () => void
  onOpenChangeAccount: () => void
  onCloseChangeAccount: () => void
  onLogout: () => void
  onSelectAccount: (entry: AccountHistoryEntry) => void
}

export interface LangOption {
  value: string
  /** Native name, e.g. 한국어 / English / Tiếng Việt. */
  label: string
}

export interface LangSelectorViewProps {
  value: string
  options: LangOption[]
  open: boolean
  /** Accessible name and tooltip of the globe button, e.g. "Language". */
  label: string
  onToggle: () => void
  onClose: () => void
  onSelect: (value: string) => void
}
