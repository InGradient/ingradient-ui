// Settings > Logs 탭 (Unified + Backend + Frontend) 라벨 + view props.

import type { ReactNode } from 'react'

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
