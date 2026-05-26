import type { ReactNode } from 'react'

export interface EdgeClass {
  class_id?: string
  name: string
  color: string
}

export interface EdgeDataset {
  dataset_id: string
  dataset_name: string
  project_id: string
  project_name?: string
  deflectometry_enabled?: boolean
  role?: string
  image_count?: number
  classes?: EdgeClass[]
  task_type?: string
}

export interface EdgeProjectGroup {
  project_id: string
  project_name: string
  deflectometry_enabled: boolean
  role: string
  datasets: EdgeDataset[]
}

export interface RecentDatasetEntry {
  dataset: EdgeDataset
  isLatest: boolean
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export interface DatasetSelectLabels {
  title: string
  online: string
  offline: string
  refresh: string
  settingsTitle: string
  settingsDisabledTitle: string
  recentLabel: string
  recentBadge: string
  addDataset: string
  noClasses: string
  more: string
  export: string
  loading: string
  emptyOffline: string
  emptyOnline: string
  createOnPlatform: string
  sessionExpiredTitle: string
  sessionExpiredDesc: string
  sessionExpiredConfirm: string
  cancel: string
  images: (count: number) => string
  roleLabel: (role: string) => string
}

export interface DatasetSelectViewProps {
  mode: 'online' | 'offline'
  connectionStatus: ConnectionStatus
  connectionTitle: string
  canSetupCamera: boolean

  loading: boolean
  fetchError: string | null
  recentDatasets: RecentDatasetEntry[]
  groups: EdgeProjectGroup[]
  totalDatasets: number
  latestDatasetId: string | null

  openDotMenuDatasetId: string | null

  sessionExpired: boolean

  labels: DatasetSelectLabels

  langSelector?: ReactNode
  accountMenu?: ReactNode
  settingsDialog?: ReactNode
  exportModal?: ReactNode
  addDatasetModal?: ReactNode

  onRefresh: () => void
  onOpenSettings: () => void
  onSelectDataset: (dataset: EdgeDataset) => void
  onAddDatasetClick: (projectId: string) => void
  onExportClick: (dataset: EdgeDataset) => void
  onToggleDotMenu: (datasetId: string | null) => void
  onSessionExpiredConfirm: () => void
  onSessionExpiredCancel: () => void
}
