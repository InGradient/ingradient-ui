// Settings > Data 탭 라벨 + view props.

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
