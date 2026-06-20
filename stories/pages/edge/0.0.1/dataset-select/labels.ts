// DatasetSelect 화면 + Add/Export 모달 라벨 상수.
import type {
  DatasetSelectLabels,
  AddDatasetModalLabels,
  ExportModalLabels,
  AddDatasetClass,
} from '@ingradient/edge-pages'

export const DATASET_LABELS: DatasetSelectLabels = {
  title: 'Datasets',
  online: 'Online',
  offline: 'Offline',
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Camera setup — permission required',
  recentLabel: 'Recent',
  recentBadge: 'Latest',
  addDataset: 'Add dataset',
  noClasses: 'No classes',
  more: 'More',
  export: 'Export',
  loading: 'Loading…',
  emptyOffline: 'No datasets available offline.',
  emptyOnline: 'No datasets yet.',
  createOnPlatform: 'Create the first project on the Platform.',
  sessionExpiredTitle: 'Session expired',
  sessionExpiredDesc: 'Please sign in again to continue.',
  sessionExpiredConfirm: 'Sign in',
  cancel: 'Cancel',
  images: (count) => `${count} images`,
  roleLabel: (role) => role,
}

export const ADD_DATASET_LABELS: AddDatasetModalLabels = {
  title: 'Add dataset',
  cancel: 'Cancel',
  add: 'Add',
  adding: 'Adding…',
  datasetNameLabel: 'Dataset name',
  taskTypeLabel: 'Task type',
  classesLabel: (s, t) => `Classes (${s}/${t})`,
  taskTypeOptions: {
    classification: 'Classification',
    object_detection: 'Object Detection',
    segmentation: 'Segmentation',
    point: 'Point',
  },
}

export const EXPORT_LABELS: ExportModalLabels = {
  title: 'Export',
  cancel: 'Cancel',
  close: 'Close',
  export: 'Export',
  exporting: 'Exporting…',
  complete: 'Export complete.',
  images: (count) => `${count} images`,
  localImages: (count) => `${count} local`,
}

export const SAMPLE_ADD_CLASSES: AddDatasetClass[] = [
  { class_id: 'c1', class_name: 'scratch', color: '#f43f5e' },
  { class_id: 'c2', class_name: 'dent', color: '#f59e0b' },
  { class_id: 'c3', class_name: 'stain', color: '#10b981' },
]
