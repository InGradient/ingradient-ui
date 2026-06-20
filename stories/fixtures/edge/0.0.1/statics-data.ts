// StaticsView 합성 스토리용 mock 데이터 + 라벨.
// 타입은 @ingradient/edge-pages 의 실제 정의에 맞춘다(타입 단언 없이 구조 일치).
import type {
  SessionAnalytics,
  ImageAnalytics,
  StaticsViewLabels,
} from '@ingradient/edge-pages'

// 24시간 시간대별 캡처 수
const COUNTS_BY_HOUR: SessionAnalytics['counts_by_hour'] = [
  { label: '00', count: 2 }, { label: '01', count: 1 }, { label: '02', count: 0 },
  { label: '03', count: 0 }, { label: '04', count: 1 }, { label: '05', count: 3 },
  { label: '06', count: 8 }, { label: '07', count: 14 }, { label: '08', count: 27 },
  { label: '09', count: 41 }, { label: '10', count: 53 }, { label: '11', count: 48 },
  { label: '12', count: 22 }, { label: '13', count: 39 }, { label: '14', count: 57 },
  { label: '15', count: 61 }, { label: '16', count: 44 }, { label: '17', count: 31 },
  { label: '18', count: 18 }, { label: '19', count: 9 }, { label: '20', count: 5 },
  { label: '21', count: 4 }, { label: '22', count: 2 }, { label: '23', count: 1 },
]

export const SAMPLE_SESSION_ANALYTICS: SessionAnalytics = {
  summary: {
    daily_count: 132,
    weekly_count: 847,
    monthly_count: 3214,
    total_sessions: 4128,
    total_labeling_sessions: 2967,
    tracked_since: '2026-01-08',
  },
  counts_by_hour: COUNTS_BY_HOUR,
  duration_summary: { average_ms: 18450, median_ms: 16200, p95_ms: 41300 },
  labeling_duration_summary: { average_ms: 32100, median_ms: 28700, p95_ms: 67400 },
  step_breakdown: [
    { step_key: 'align', average_ms: 4200 },
    { step_key: 'expose', average_ms: 6800 },
    { step_key: 'capture', average_ms: 3100 },
    { step_key: 'review', average_ms: 4350 },
  ],
  outcome_ratios: [
    { label: 'success', count: 3520, ratio: 0.853 },
    { label: 'retry', count: 482, ratio: 0.117 },
    { label: 'timeout', count: 126, ratio: 0.03 },
  ],
  labeling_class_distribution: [
    { class_id: 'cls-scratch', class_name: 'Scratch', count: 1284 },
    { class_id: 'cls-dent', class_name: 'Dent', count: 873 },
    { class_id: 'cls-crack', class_name: 'Crack', count: 542 },
    { class_id: 'cls-stain', class_name: 'Stain', count: 268 },
  ],
  worker_stats: [
    { worker_id: 'w-001', worker_name: 'Alice', capture_count: 1420, labeling_count: 1180, retake_count: 96, retake_rate: 0.068 },
    { worker_id: 'w-002', worker_name: 'Bob', capture_count: 1130, labeling_count: 870, retake_count: 142, retake_rate: 0.126 },
    { worker_id: 'w-003', worker_name: 'Carol', capture_count: 980, labeling_count: 720, retake_count: 58, retake_rate: 0.059 },
    { worker_id: null, worker_name: 'Unassigned', capture_count: 598, labeling_count: 197, retake_count: 73, retake_rate: 0.122 },
  ],
}

// 14일 일자별 캡처
const DAILY_CAPTURES: ImageAnalytics['daily_captures'] = [
  { date: '2026-06-06', count: 88 }, { date: '2026-06-07', count: 41 },
  { date: '2026-06-08', count: 36 }, { date: '2026-06-09', count: 112 },
  { date: '2026-06-10', count: 134 }, { date: '2026-06-11', count: 121 },
  { date: '2026-06-12', count: 98 }, { date: '2026-06-13', count: 52 },
  { date: '2026-06-14', count: 44 }, { date: '2026-06-15', count: 126 },
  { date: '2026-06-16', count: 141 }, { date: '2026-06-17', count: 137 },
  { date: '2026-06-18', count: 119 }, { date: '2026-06-19', count: 76 },
]

const PARAM_TRENDS: ImageAnalytics['param_trends'] = [
  { captured_at: '2026-06-13', exposure: 12.4, gain: 2.1 },
  { captured_at: '2026-06-14', exposure: 13.0, gain: 2.0 },
  { captured_at: '2026-06-15', exposure: 11.8, gain: 2.3 },
  { captured_at: '2026-06-16', exposure: 12.9, gain: 2.2 },
  { captured_at: '2026-06-17', exposure: 13.5, gain: 1.9 },
  { captured_at: '2026-06-18', exposure: 12.1, gain: 2.4 },
  { captured_at: '2026-06-19', exposure: 12.7, gain: 2.0 },
]

export const SAMPLE_IMAGE_ANALYTICS: ImageAnalytics = {
  total_images: 5842,
  total_sequences: 1873,
  labeled_ratio: 0.762,
  avg_bbox_count: 3.4,
  exported_count: 4120,
  not_exported_count: 1722,
  sync_distribution: [
    { status: 'synced', count: 4980 },
    { status: 'pending_review', count: 612 },
    { status: 'local_only', count: 180 },
    { status: 'upload_failed', count: 70 },
  ],
  daily_captures: DAILY_CAPTURES,
  exposure_distribution: [
    { bucket: '0-5', count: 142 }, { bucket: '5-10', count: 1280 },
    { bucket: '10-15', count: 2910 }, { bucket: '15-20', count: 1110 },
    { bucket: '20+', count: 400 },
  ],
  gain_distribution: [
    { bucket: '0-1', count: 320 }, { bucket: '1-2', count: 2480 },
    { bucket: '2-3', count: 2210 }, { bucket: '3-4', count: 620 },
    { bucket: '4+', count: 212 },
  ],
  param_trends: PARAM_TRENDS,
  class_bbox_counts: [
    { class_id: 'cls-scratch', class_name: 'Scratch', count: 4820, color: '#ef4444' },
    { class_id: 'cls-dent', class_name: 'Dent', count: 3140, color: '#f59e0b' },
    { class_id: 'cls-crack', class_name: 'Crack', count: 1960, color: '#3b82f6' },
    { class_id: 'cls-stain', class_name: 'Stain', count: 880, color: '#10b981' },
  ],
  class_image_counts: [
    { class_id: 'cls-scratch', class_name: 'Scratch', image_count: 2310, color: '#ef4444' },
    { class_id: 'cls-dent', class_name: 'Dent', image_count: 1680, color: '#f59e0b' },
    { class_id: 'cls-crack', class_name: 'Crack', image_count: 1120, color: '#3b82f6' },
    { class_id: 'cls-stain', class_name: 'Stain', image_count: 540, color: '#10b981' },
  ],
  bbox_per_image_distribution: [
    { bucket: '1', count: 1420 }, { bucket: '2-3', count: 2380 },
    { bucket: '4-5', count: 1240 }, { bucket: '6-9', count: 620 },
    { bucket: '10+', count: 182 },
  ],
  class_avg_size: [
    { class_id: 'cls-scratch', class_name: 'Scratch', avg_w: 48.2, avg_h: 12.6, color: '#ef4444' },
    { class_id: 'cls-dent', class_name: 'Dent', avg_w: 64.8, avg_h: 58.1, color: '#f59e0b' },
    { class_id: 'cls-crack', class_name: 'Crack', avg_w: 92.4, avg_h: 8.3, color: '#3b82f6' },
    { class_id: 'cls-stain', class_name: 'Stain', avg_w: 36.5, avg_h: 33.9, color: '#10b981' },
  ],
}

export const STATICS_LABELS: StaticsViewLabels = {
  title: 'Statistics',
  trackedFromVersion: 'Tracked from v0.0.1',
  startedSince: (date: string) => `since ${date}`,
  dailyCaptures: 'Daily Captures',
  weeklyCaptures: 'Weekly Captures',
  monthlyCaptures: 'Monthly Captures',
  totalImages: 'Total Images',
  labeledRatio: 'Labeled Ratio',
  sessions: 'Sessions',
  images: 'Images',
  labeling: 'Labeling',
  camera: 'Camera',
  selectDataset: 'Select a dataset to view statistics',
  loading: 'Loading statistics...',
  noData: 'No data available yet',
  sessionCharts: {
    captureByHour: 'Captures by Hour',
    outcomeTitle: 'Session Outcomes',
    outcomeSuccess: 'Success',
    outcomeRetry: 'Retry',
    outcomeTimeout: 'Timeout',
    workAndLabelingTime: 'Work & Labeling Time',
    captureWorkTime: 'Capture Work Time',
    labelingTime: 'Labeling Time',
    average: 'Average',
    median: 'Median',
    p95: 'P95',
    deflectometrySteps: 'Deflectometry Steps',
    avgMs: 'Avg (ms)',
    workerStats: 'Worker Stats',
    worker: 'Worker',
    captures: 'Captures',
    labels: 'Labels',
    retakes: 'Retakes',
    retakeRate: 'Retake Rate',
    count: 'Count',
    noOutcomeStats: 'No outcome statistics',
    noDeflectometryData: 'No deflectometry data',
    noWorkerStats: 'No worker statistics',
  },
  imageCharts: {
    dailyCaptureTrend: 'Daily Capture Trend',
    syncStatus: 'Sync Status',
    captures: 'Captures',
    exported: 'Exported',
    notExported: 'Not Exported',
    noImageData: 'No image data',
  },
  labelingCharts: {
    classLabelingTrend: 'Class Labeling Trend',
    classBboxCount: 'Class Bbox Count',
    classImageCount: 'Class Image Count',
    bboxPerImageDist: 'Bbox per Image Distribution',
    classAvgBboxSize: 'Class Avg Bbox Size',
    count: 'Count',
    images: 'Images',
    trendDaily7: 'Last 7 days',
    trendDaily14: 'Last 14 days',
    trendWeeklyMonth: 'Weekly (month)',
    noLabelingData: 'No labeling data',
  },
  cameraCharts: {
    exposureDist: 'Exposure Distribution',
    gainDist: 'Gain Distribution',
    paramTrend: 'Parameter Trend',
    count: 'Count',
    noCameraData: 'No camera data',
  },
}
