import type { EdgeAnalyticsView } from '@ingradient/platform-pages'
import type { DashboardPreferences, DashboardWidgetKey } from './dashboard-analysis'
import { defaultLayout, defaultPreferences } from './dashboard-analysis'
import { mockEdgeAnalytics } from './dashboard-edge-analytics'

export type DashboardScenarioKey =
  | 'default'
  | 'no-project'
  | 'loading'
  | 'error'
  | 'no-data'
  | 'customize-open'
  | 'date-range-open'
  | 'subset-widgets'
  | 'layout-2-rows'
  | 'layout-3-per-row'
  | 'layout-1-per-row'
  | 'save-message'
  | 'date-applied'
  | 'no-project-name'
  | 'all-widgets-hidden'
  | 'with-edge-analytics'
  | 'with-deflectometry'

export interface DashboardScene {
  projectName?: string | null
  noProject?: boolean
  loading?: boolean
  error?: string | null
  noData?: boolean
  saveMessage?: string | null
  customizeOpen?: boolean
  dateRangeOpen?: boolean
  preferences: DashboardPreferences
  /** dateLabel — Panel header DateButton 라벨 */
  dateLabel?: string
  edgeAnalytics?: EdgeAnalyticsView
  deflectometryEnabled?: boolean
}

const allWidgetsLayout3PerRow: Array<Array<DashboardWidgetKey>> = [
  ['data_collection', 'timeline', 'labeling_status'],
  ['class_ratio', 'labeling_by_person', 'pending_processed'],
  ['defects_by_source', 'dataset_distribution'],
]

const layout1PerRow: Array<Array<DashboardWidgetKey>> = [
  ['data_collection'], ['timeline'], ['labeling_status'], ['class_ratio'],
  ['labeling_by_person'], ['defects_by_source'], ['pending_processed'], ['dataset_distribution'],
]

const subsetPreferences: DashboardPreferences = {
  ...defaultPreferences,
  show_labeling_status: false,
  show_class_ratio: false,
  show_pending_processed: false,
  show_dataset_distribution: false,
}

const allHiddenPreferences: DashboardPreferences = {
  ...defaultPreferences,
  show_data_collection: false,
  show_timeline: false,
  show_labeling_status: false,
  show_class_ratio: false,
  show_labeling_by_person: false,
  show_defects_by_source: false,
  show_pending_processed: false,
  show_dataset_distribution: false,
}

const base: DashboardScene = {
  projectName: 'Wafer-2026',
  preferences: defaultPreferences,
  dateLabel: 'All time',
}

export const dashboardScenarios: Record<DashboardScenarioKey, DashboardScene> = {
  'default': base,
  'no-project': { ...base, noProject: true, projectName: null },
  'loading': { ...base, loading: true },
  'error': { ...base, error: 'Failed to load analysis. Try again.' },
  'no-data': { ...base, noData: true },
  'customize-open': { ...base, customizeOpen: true },
  'date-range-open': { ...base, dateRangeOpen: true },
  'subset-widgets': { ...base, preferences: subsetPreferences },
  'layout-2-rows': { ...base, preferences: { ...defaultPreferences, analysis_widget_layout: defaultLayout } },
  'layout-3-per-row': { ...base, preferences: { ...defaultPreferences, analysis_widget_layout: allWidgetsLayout3PerRow } },
  'layout-1-per-row': { ...base, preferences: { ...defaultPreferences, analysis_widget_layout: layout1PerRow } },
  'save-message': { ...base, saveMessage: 'PDF saved.' },
  'date-applied': {
    ...base,
    preferences: { ...defaultPreferences, overview_date_start: '2026-05-01', overview_date_end: '2026-05-14' },
    dateLabel: '2026-05-01 → 2026-05-14',
  },
  'no-project-name': { ...base, projectName: null },
  'all-widgets-hidden': { ...base, preferences: allHiddenPreferences },
  'with-edge-analytics': { ...base, edgeAnalytics: mockEdgeAnalytics },
  'with-deflectometry': { ...base, edgeAnalytics: mockEdgeAnalytics, deflectometryEnabled: true },
}
