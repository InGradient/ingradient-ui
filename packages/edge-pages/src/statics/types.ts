import type { ImageItem } from '../images/image-helpers'

// ── Domain types (subset from edge electron/db) ───────────────────────────────

export interface SessionAnalyticsSummary {
  daily_count: number
  weekly_count: number
  monthly_count: number
  total_sessions: number
  total_labeling_sessions: number
  tracked_since: string | null
}

export interface SessionAnalytics {
  summary: SessionAnalyticsSummary
  counts_by_hour: { label: string; count: number }[]
  duration_summary: { average_ms: number | null; median_ms: number | null; p95_ms: number | null }
  labeling_duration_summary: { average_ms: number | null; median_ms: number | null; p95_ms: number | null }
  step_breakdown: { step_key: string; average_ms: number }[]
  outcome_ratios: { label: 'success' | 'retry' | 'timeout'; count: number; ratio: number }[]
  labeling_class_distribution: { class_id: string; class_name: string; count: number }[]
  worker_stats: {
    worker_id: string | null
    worker_name: string
    capture_count: number
    labeling_count: number
    retake_count: number
    retake_rate: number
  }[]
}

export interface ImageAnalytics {
  total_images: number
  total_sequences: number
  labeled_ratio: number
  avg_bbox_count: number
  exported_count: number
  not_exported_count: number
  sync_distribution: { status: string; count: number }[]
  daily_captures: { date: string; count: number }[]
  exposure_distribution: { bucket: string; count: number }[]
  gain_distribution: { bucket: string; count: number }[]
  param_trends: { captured_at: string; exposure: number | null; gain: number | null }[]
  class_bbox_counts: { class_id: string; class_name: string; count: number; color: string }[]
  class_image_counts: { class_id: string; class_name: string; image_count: number; color: string }[]
  bbox_per_image_distribution: { bucket: string; count: number }[]
  class_avg_size: { class_id: string; class_name: string; avg_w: number; avg_h: number; color: string }[]
}

export type TrendMode = 'daily7' | 'daily14' | 'weeklyMonth'

// ── Labels ────────────────────────────────────────────────────────────────────

export interface SessionChartsLabels {
  captureByHour: string
  outcomeTitle: string
  outcomeSuccess: string
  outcomeRetry: string
  outcomeTimeout: string
  workAndLabelingTime: string
  captureWorkTime: string
  labelingTime: string
  average: string
  median: string
  p95: string
  deflectometrySteps: string
  avgMs: string
  workerStats: string
  worker: string
  captures: string
  labels: string
  retakes: string
  retakeRate: string
  count: string
  noOutcomeStats: string
  noDeflectometryData: string
  noWorkerStats: string
}

export interface ImageChartsLabels {
  dailyCaptureTrend: string
  syncStatus: string
  captures: string
  exported: string
  notExported: string
  noImageData: string
}

export interface LabelingChartsLabels {
  classLabelingTrend: string
  classBboxCount: string
  classImageCount: string
  bboxPerImageDist: string
  classAvgBboxSize: string
  count: string
  images: string
  trendDaily7: string
  trendDaily14: string
  trendWeeklyMonth: string
  noLabelingData: string
}

export interface CameraChartsLabels {
  exposureDist: string
  gainDist: string
  paramTrend: string
  count: string
  noCameraData: string
}

export interface StaticsViewLabels {
  title: string
  trackedFromVersion: string
  startedSince: (date: string) => string
  dailyCaptures: string
  weeklyCaptures: string
  monthlyCaptures: string
  totalImages: string
  labeledRatio: string
  sessions: string
  images: string
  labeling: string
  camera: string
  selectDataset: string
  loading: string
  noData: string
  sessionCharts: SessionChartsLabels
  imageCharts: ImageChartsLabels
  labelingCharts: LabelingChartsLabels
  cameraCharts: CameraChartsLabels
}

// ── View props ────────────────────────────────────────────────────────────────

export interface SessionChartsViewProps {
  countsByHour: SessionAnalytics['counts_by_hour']
  outcomeRatios: SessionAnalytics['outcome_ratios']
  durationSummary: SessionAnalytics['duration_summary']
  labelingDurationSummary: SessionAnalytics['labeling_duration_summary']
  stepBreakdown: SessionAnalytics['step_breakdown']
  workerStats: SessionAnalytics['worker_stats']
  labels: SessionChartsLabels
}

export interface ImageChartsViewProps {
  data: ImageAnalytics
  labels: ImageChartsLabels
}

export interface LabelingChartsViewProps {
  data: ImageAnalytics
  classNameMap: Map<string, string>
  classes: { class_id: string; class_name: string; color: string }[]
  images: ImageItem[]
  trendMode: TrendMode
  labels: LabelingChartsLabels
  onTrendModeChange: (mode: TrendMode) => void
}

export interface CameraChartsViewProps {
  data: ImageAnalytics
  labels: CameraChartsLabels
}

export interface StaticsViewProps {
  hasDataset: boolean
  loading: boolean
  imagesLoading: boolean

  session: SessionAnalytics | null
  enhancedImage: ImageAnalytics | null
  classNameMap: Map<string, string>
  classes: { class_id: string; class_name: string; color: string }[]
  images: ImageItem[]

  collapsedSections: Partial<Record<StaticsSectionKey, boolean>>

  trendMode: TrendMode

  labels: StaticsViewLabels

  /** Live status section at the top (capture counts, speed, PLC, memory, disk). Shown even before any captures. */
  live?: LiveStatsViewProps

  onToggleSection: (key: StaticsSectionKey) => void
  onTrendModeChange: (mode: TrendMode) => void
}

export type StaticsSectionKey = 'live' | 'sessions' | 'images' | 'labeling' | 'camera'

// ── Live status (real app: features/stats/LiveStatsSection) ───────────────────

export interface LiveCount { sequences: number; images: number }
export interface LiveCounts { auto: LiveCount; manual: LiveCount; unknown: LiveCount }
export interface LiveDuration { count: number; avg_ms: number | null; median_ms: number | null; p95_ms: number | null }
/** One chart bucket (average over a slice of the selected range); null = no data in that slice. */
export interface LiveCapturePoint { at: string; auto_s: number | null; manual_s: number | null; plc_s: number | null }
export interface LiveSample {
  at: string
  main_mb: number | null
  renderer_mb: number | null
  backend_mb: number | null
  sys_mem_pct: number | null
  disk_free_gb: number | null
}
export type LiveRange = 'hour' | 'day' | 'week'

/** Same shape the Edge main process returns (src/types/live-stats.types.ts). */
export interface LiveStats {
  generated_at: string
  range_ms: number
  today: LiveCounts
  total: LiveCounts
  errors_today: number
  capture: { auto: LiveDuration; manual: LiveDuration }
  plc: { count: number; avg_s: number | null; p95_s: number | null; over_limit: number; limit_s: number }
  recent: LiveCapturePoint[]
  samples: LiveSample[]
  disk: { free_gb: number | null; used_per_day_gb: number | null; days_left: number | null }
}

export interface LiveStatsLabels {
  section: string
  loading: string
  note: (time: string) => string
  range: Record<LiveRange, string>
  rangeAriaLabel: string
  todayAuto: string
  todayManual: string
  totalSub: (sequences: string, images: string) => string
  errorsToday: string
  autoCapture: string
  manualCapture: string
  durationSub: (avg: string, p95: string, runs: number) => string
  plc: (limitS: number) => string
  plcSub: (avg: string, over: number, runs: number) => string
  memory: string
  memorySub: (main: string, renderer: string, backend: string) => string
  disk: string
  diskSub: (perDay: string, daysLeft: string) => string
  autoChart: string
  manualChart: string
  memoryChart: string
  seriesAuto: string
  seriesManual: string
  seriesPlc: string
  seriesMain: string
  seriesRenderer: string
  seriesBackend: string
}

export interface LiveStatsViewProps {
  /** null while the first sample loads. */
  stats: LiveStats | null
  range: LiveRange
  labels: LiveStatsLabels
  onRangeChange: (range: LiveRange) => void
  /** Clock text for the "last updated" note; defaults to HH:MM:SS. */
  formatTime?: (iso: string) => string
  /** Chart x-axis text for a bucket start; defaults to local H:MM (week: M/D Hh). */
  formatAxis?: (iso: string, range: LiveRange) => string
}
