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

  langSelector?: ReactNode
  accountMenu?: ReactNode
  settingsDialog?: ReactNode

  onBackToDatasets: () => void
  onRefresh: () => void
  onOpenSettings: () => void
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
