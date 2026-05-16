import type { EdgeAnalyticsView } from '@ingradient/platform-pages'

export const mockEdgeAnalytics: EdgeAnalyticsView = {
  summary: {
    total_capture_sessions: 1284,
    total_labeling_sessions: 967,
  },
  capture_duration: { average_ms: 348 },
  labeling_duration: { average_ms: 2150 },
  step_breakdown: [
    { step_key: 'white', average_ms: 42 },
    { step_key: 'black', average_ms: 38 },
    { step_key: 'gradient_x', average_ms: 156 },
    { step_key: 'gradient_y', average_ms: 162 },
    { step_key: 'phase_x', average_ms: 188 },
    { step_key: 'phase_y', average_ms: 192 },
  ],
  worker_stats: [
    { worker_id: 'edge-01', worker_name: 'Edge-01 (Line A)', capture_count: 542, labeling_count: 412, retry_count: 18 },
    { worker_id: 'edge-02', worker_name: 'Edge-02 (Line A)', capture_count: 487, labeling_count: 360, retry_count: 24 },
    { worker_id: 'edge-03', worker_name: 'Edge-03 (Line B)', capture_count: 255, labeling_count: 195, retry_count: 9 },
  ],
  outcome_ratios: [
    { label: 'Pass', count: 712 },
    { label: 'Fail', count: 184 },
    { label: 'Review', count: 71 },
  ],
  labeling_class_distribution: [
    { name: 'Crack', count: 312, color: '#ff6b6b' },
    { name: 'Scratch', count: 248, color: '#feca57' },
    { name: 'Dent', count: 187, color: '#48dbfb' },
    { name: 'Stain', count: 142, color: '#a55eea' },
    { name: 'Rust', count: 78, color: '#1dd1a1' },
  ],
}

export const mockEdgeAnalyticsEmpty: EdgeAnalyticsView = {
  summary: { total_capture_sessions: 0, total_labeling_sessions: 0 },
  capture_duration: { average_ms: null },
  labeling_duration: { average_ms: null },
  step_breakdown: [],
  worker_stats: [],
  outcome_ratios: [],
  labeling_class_distribution: [],
}
