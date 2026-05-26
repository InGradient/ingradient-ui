import type { SourceBreakdownSource, PerDatasetDistributionDataset } from '@ingradient/platform-pages'

export type DashboardWidgetKey =
  | 'data_collection'
  | 'timeline'
  | 'labeling_status'
  | 'class_ratio'
  | 'labeling_by_person'
  | 'defects_by_source'
  | 'pending_processed'
  | 'dataset_distribution'

export interface DashboardPreferences {
  show_data_collection: boolean
  show_timeline: boolean
  show_labeling_status: boolean
  show_class_ratio: boolean
  show_labeling_by_person: boolean
  show_defects_by_source: boolean
  show_pending_processed: boolean
  show_dataset_distribution: boolean
  overview_date_start: string | null
  overview_date_end: string | null
  analysis_widget_layout: Array<Array<DashboardWidgetKey>>
}

export const defaultLayout: Array<Array<DashboardWidgetKey>> = [
  ['data_collection', 'timeline'],
  ['labeling_status', 'class_ratio', 'pending_processed'],
  ['labeling_by_person', 'defects_by_source'],
  ['dataset_distribution'],
]

export const defaultPreferences: DashboardPreferences = {
  show_data_collection: true,
  show_timeline: true,
  show_labeling_status: true,
  show_class_ratio: true,
  show_labeling_by_person: true,
  show_defects_by_source: true,
  show_pending_processed: true,
  show_dataset_distribution: true,
  overview_date_start: null,
  overview_date_end: null,
  analysis_widget_layout: defaultLayout,
}

export const customizeToggleItems = [
  { key: 'show_data_collection', label: 'Data Collection' },
  { key: 'show_timeline', label: 'Images Over Time' },
  { key: 'show_labeling_status', label: 'Labeling Status' },
  { key: 'show_class_ratio', label: 'Class Ratio' },
  { key: 'show_labeling_by_person', label: 'Labeling by Person' },
  { key: 'show_defects_by_source', label: 'Defects by Source' },
  { key: 'show_pending_processed', label: 'Pending vs Processed' },
  { key: 'show_dataset_distribution', label: 'Dataset Distribution' },
]

// === Mock data per widget ===

export const dataCollectionData = [
  { name: 'Wafer A', count: 412 },
  { name: 'Wafer B', count: 318 },
  { name: 'Surface', count: 247 },
  { name: 'Pixel seg', count: 165 },
  { name: 'Keypoint', count: 105 },
]

export const dataCollectionTotalImages = dataCollectionData.reduce((s, d) => s + d.count, 0)

export const timelineData = [
  { label: 'W1', total: 120, labeled: 80, unlabeled: 40 },
  { label: 'W2', total: 160, labeled: 110, unlabeled: 50 },
  { label: 'W3', total: 200, labeled: 142, unlabeled: 58 },
  { label: 'W4', total: 180, labeled: 140, unlabeled: 40 },
  { label: 'W5', total: 240, labeled: 188, unlabeled: 52 },
  { label: 'W6', total: 280, labeled: 218, unlabeled: 62 },
  { label: 'W7', total: 320, labeled: 248, unlabeled: 72 },
  { label: 'W8', total: 295, labeled: 240, unlabeled: 55 },
]

export const labelingStatus = {
  total: 1247,
  labeled: 892,
  unlabeled: 321,
  errors: 34,
  labeledPct: 71.5,
  pieData: [
    { name: 'Labeled', value: 892, color: '#35c6a7' },
    { name: 'Unlabeled', value: 321, color: '#ffd179' },
    { name: 'Errors', value: 34, color: '#ff9a9a' },
  ],
}

export const classRatioData = [
  { name: 'Crack', count: 412, ratio: 33, color: '#ff6b6b' },
  { name: 'Scratch', count: 318, ratio: 26, color: '#feca57' },
  { name: 'Dent', count: 247, ratio: 20, color: '#48dbfb' },
  { name: 'Stain', count: 165, ratio: 13, color: '#a55eea' },
  { name: 'Rust', count: 105, ratio: 8, color: '#1dd1a1' },
]

export const labelingByPersonData = [
  { uploader: 'June Lee', image_count: 412, labeled_count: 380 },
  { uploader: 'Soyeon Park', image_count: 318, labeled_count: 290 },
  { uploader: 'Daniel Kim', image_count: 247, labeled_count: 200 },
  { uploader: 'Mira Choi', image_count: 165, labeled_count: 140 },
  { uploader: 'Others', image_count: 105, labeled_count: 92 },
]

export const defectsBySource: SourceBreakdownSource[] = [
  {
    source: 'camera', camera_ip: '10.0.0.1',
    defect_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 220 },
      { class_id: 'cl-2', name: 'Scratch', count: 180 },
      { class_id: 'cl-3', name: 'Stain', count: 94 },
    ],
  },
  {
    source: 'camera', camera_ip: '10.0.0.2',
    defect_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 192 },
      { class_id: 'cl-4', name: 'Contamination', count: 47 },
    ],
  },
  {
    source: 'upload', camera_ip: null,
    defect_counts: [
      { class_id: 'cl-5', name: 'Discoloration', count: 23 },
    ],
  },
]

export const pendingProcessed = {
  pending: 321,
  processed: 892,
  pieData: [
    { name: 'Processed', value: 892, color: '#35c6a7' },
    { name: 'Pending', value: 321, color: '#ffd179' },
  ],
}

export const datasetDistribution: PerDatasetDistributionDataset[] = [
  {
    dataset_id: 'ds-1', name: 'Wafer line A',
    class_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 312 },
      { class_id: 'cl-2', name: 'Scratch', count: 187 },
      { class_id: 'cl-3', name: 'Stain', count: 94 },
      { class_id: 'cl-4', name: 'Contamination', count: 41 },
    ],
  },
  {
    dataset_id: 'ds-2', name: 'Surface defects',
    class_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 218 },
      { class_id: 'cl-5', name: 'Discoloration', count: 56 },
    ],
  },
]
