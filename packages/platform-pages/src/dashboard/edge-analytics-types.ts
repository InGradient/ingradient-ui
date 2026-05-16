export interface EdgeAnalyticsSummary {
  total_capture_sessions: number
  total_labeling_sessions: number
}

export interface EdgeStepBreakdownEntry {
  step_key: string
  average_ms: number | null
}

export interface EdgeWorkerStat {
  worker_id?: string | null
  worker_name: string
  capture_count: number
  labeling_count: number
  retry_count: number
}

export interface EdgeOutcomeEntry {
  label: string
  count: number
}

export interface EdgeLabelingClassEntry {
  name: string
  count: number
  color: string
}

/**
 * Dashboard 의 Edge analytics 섹션이 사용하는 데이터 shape.
 * Platform 의 `AnalysisOut['edge_analytics']` 와 1:1 호환.
 */
export interface EdgeAnalyticsView {
  summary: EdgeAnalyticsSummary
  step_breakdown: EdgeStepBreakdownEntry[]
  worker_stats: EdgeWorkerStat[]
  outcome_ratios: EdgeOutcomeEntry[]
  capture_duration: { average_ms: number | null }
  labeling_duration: { average_ms: number | null }
  labeling_class_distribution: EdgeLabelingClassEntry[]
}
