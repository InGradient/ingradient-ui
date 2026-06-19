// Settings > About 안 Update 섹션 라벨 + view props.

export type UpdateStatus =
  | 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'noUpdate'

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
