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

  collapsedSections: Partial<Record<'sessions' | 'images' | 'labeling' | 'camera', boolean>>

  trendMode: TrendMode

  labels: StaticsViewLabels

  onToggleSection: (key: 'sessions' | 'images' | 'labeling' | 'camera') => void
  onTrendModeChange: (mode: TrendMode) => void
}
