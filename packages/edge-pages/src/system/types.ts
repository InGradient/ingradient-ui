import type { ReactNode } from 'react'

export type SystemMonitorTab = 'monitor' | 'cleanup'

export interface SystemMonitorModalLabels {
  title: string
  tabMonitor: string
  tabCleanup: string
  close: string
}

export interface SystemMonitorModalViewProps {
  activeTab: SystemMonitorTab
  labels: SystemMonitorModalLabels
  monitorContent?: ReactNode
  cleanupContent?: ReactNode
  onClose: () => void
  onSetActiveTab: (tab: SystemMonitorTab) => void
}

// ── Cleanup tab ───────────────────────────────────────────────────────────────

export interface CleanupStats {
  totalSize: number
  itemCounts: { datasets: number; sessions: number; logs: number; thumbs: number }
  oldestEntry: string | null
}

export interface CleanupTabLabels {
  totalSize: string
  oldestEntry: string
  categories: string
  datasets: string
  sessions: string
  logs: string
  thumbs: string
  run: string
  running: string
  refresh: string
  empty: string
  loading: string
  freed: (bytes: string) => string
}

export interface SystemMonitorCleanupTabViewProps {
  stats: CleanupStats | null
  loading: boolean
  running: boolean
  result: { ok: boolean; freedBytes: number } | null
  selectedCategories: Set<string>
  labels: CleanupTabLabels
  onToggleCategory: (category: string) => void
  onRun: () => void
  onRefresh: () => void
}

// ── Monitor tab ───────────────────────────────────────────────────────────────

export interface SystemStatsPoint {
  ts: string
  cpu: number
  memory: number
  disk: number
}

export interface MonitorTabLabels {
  cpu: string
  memory: string
  disk: string
  empty: string
}

export interface SystemMonitorMonitorTabViewProps {
  latest: SystemStatsPoint | null
  history: SystemStatsPoint[]
  labels: MonitorTabLabels
}
