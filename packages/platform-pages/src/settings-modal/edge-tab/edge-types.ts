export interface DeflectometryConfig {
  schema_version: string
  phase_shift_count: number
  capture_directions: 'x_only' | 'y_only' | 'both'
  include_solid: boolean
  include_black: boolean
  fringe_period_default: number
  exposure_per_pattern: 'same' | 'auto_hdr'
  sequence_retry_policy: number
  min_fringe_contrast: number
  max_saturation_pct: number
}

export const DEFAULT_DEFLECTOMETRY_CONFIG: DeflectometryConfig = {
  schema_version: '1.0',
  phase_shift_count: 4,
  capture_directions: 'both',
  include_solid: true,
  include_black: false,
  fringe_period_default: 20,
  exposure_per_pattern: 'same',
  sequence_retry_policy: 0,
  min_fringe_contrast: 0,
  max_saturation_pct: 100,
}

export interface EdgePackageOptions {
  require_labeling: boolean
  require_min_bbox_count: number
  block_next_without_labeling: boolean
}

/** Subset of platform `EdgePackage` used by Settings Edge tab UI. */
export interface EdgePackageView {
  id: string
  device_name: string | null
  status: string
  progress: number
  created_at: string
}

export interface EdgeImportReportDetail {
  file: string
  reason: string
}

export interface EdgeImportReport {
  total: number
  imported_new: number
  overwritten: number
  failed: number
  failed_details: EdgeImportReportDetail[]
}

/** Subset of platform `ImportJob` used by Settings Edge tab UI. */
export interface EdgeImportJobView {
  id: string
  status: string
  progress: number
  error: string | null
  report: EdgeImportReport | null
}

export interface EdgeProjectView {
  id: string
  deflectometry_enabled?: boolean
  deflectometry_config?: DeflectometryConfig | null
}

export interface EdgeDatasetOption {
  id: string
  name: string
}

export interface EdgeMemberOption {
  id: string
  user_id: string
  name?: string | null
  email: string
}

/**
 * Pattern label string from DeflectometryConfig. Platform 의 `PatternLabel` 타입과 호환.
 * 형태: `x_orig`, `y_orig`, `phase_x_<n>`, `phase_y_<n>`, `solid`, `black`.
 */
export type DeflectometryPatternLabel = string
