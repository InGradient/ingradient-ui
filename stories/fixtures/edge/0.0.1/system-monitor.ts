import type {
  CleanupStats,
  CleanupTabLabels,
  MonitorTabLabels,
  SystemMonitorModalLabels,
  SystemStatsPoint,
} from '@ingradient/edge-pages'

export const SAMPLE_MONITOR_HISTORY: SystemStatsPoint[] = [
  { ts: '2026-05-19T12:00:00Z', cpu: 28, memory: 41, disk: 56 },
  { ts: '2026-05-19T12:05:00Z', cpu: 34, memory: 43, disk: 56 },
  { ts: '2026-05-19T12:10:00Z', cpu: 41, memory: 47, disk: 57 },
  { ts: '2026-05-19T12:15:00Z', cpu: 38, memory: 49, disk: 57 },
  { ts: '2026-05-19T12:20:00Z', cpu: 52, memory: 55, disk: 58 },
  { ts: '2026-05-19T12:25:00Z', cpu: 61, memory: 58, disk: 58 },
  { ts: '2026-05-19T12:30:00Z', cpu: 47, memory: 54, disk: 59 },
  { ts: '2026-05-19T12:35:00Z', cpu: 39, memory: 51, disk: 59 },
  { ts: '2026-05-19T12:40:00Z', cpu: 44, memory: 53, disk: 60 },
  { ts: '2026-05-19T12:45:00Z', cpu: 56, memory: 57, disk: 60 },
  { ts: '2026-05-19T12:50:00Z', cpu: 49, memory: 55, disk: 61 },
  { ts: '2026-05-19T12:55:00Z', cpu: 42, memory: 52, disk: 61 },
]

export const SAMPLE_MONITOR_LATEST: SystemStatsPoint = {
  ts: '2026-05-19T12:55:00Z',
  cpu: 42,
  memory: 52,
  disk: 61,
}

export const SAMPLE_CLEANUP_STATS: CleanupStats = {
  totalSize: 4_831_838_208,
  itemCounts: { datasets: 12, sessions: 34, logs: 128, thumbs: 512 },
  oldestEntry: '2026-01-03T08:30:00Z',
}

export const SYSTEM_MONITOR_LABELS: SystemMonitorModalLabels = {
  title: 'System Monitor',
  tabMonitor: 'Monitor',
  tabCleanup: 'Cleanup',
  close: 'Close',
}

export const MONITOR_TAB_LABELS: MonitorTabLabels = {
  cpu: 'CPU',
  memory: 'Memory',
  disk: 'Disk',
  empty: 'No monitoring data available',
}

export const CLEANUP_TAB_LABELS: CleanupTabLabels = {
  totalSize: 'Total size',
  oldestEntry: 'Oldest entry',
  categories: 'Categories',
  datasets: 'Datasets',
  sessions: 'Sessions',
  logs: 'Logs',
  thumbs: 'Thumbnails',
  run: 'Run cleanup',
  running: 'Cleaning up...',
  refresh: 'Refresh',
  empty: 'No cleanup data available',
  loading: 'Loading...',
  freed: (bytes: string) => `Freed ${bytes}`,
}
