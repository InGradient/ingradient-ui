import type { EdgeProjectGroup, RecentDatasetEntry } from '@ingradient/edge-pages'

const SURFACE_CLASSES = [
  { class_id: 'c1', name: 'scratch', color: '#f43f5e' },
  { class_id: 'c2', name: 'dent', color: '#f59e0b' },
  { class_id: 'c3', name: 'stain', color: '#10b981' },
  { class_id: 'c4', name: 'crack', color: '#3b82f6' },
]

const ALIGNMENT_CLASSES = [
  { class_id: 'c5', name: 'misalign', color: '#a855f7' },
  { class_id: 'c6', name: 'tilt', color: '#06b6d4' },
]

export const SAMPLE_GROUPS: EdgeProjectGroup[] = [
  {
    project_id: 'p1',
    project_name: 'Line A Surface Inspection',
    deflectometry_enabled: true,
    role: 'owner',
    datasets: [
      {
        dataset_id: 'd1',
        dataset_name: '2026-05-19 morning shift',
        project_id: 'p1',
        project_name: 'Line A Surface Inspection',
        deflectometry_enabled: true,
        role: 'owner',
        image_count: 1248,
        task_type: 'object_detection',
        classes: SURFACE_CLASSES,
      },
      {
        dataset_id: 'd2',
        dataset_name: '2026-05-18 afternoon shift',
        project_id: 'p1',
        project_name: 'Line A Surface Inspection',
        deflectometry_enabled: true,
        role: 'owner',
        image_count: 892,
        task_type: 'object_detection',
        classes: SURFACE_CLASSES.slice(0, 2),
      },
      {
        dataset_id: 'd3',
        dataset_name: 'Empty calibration set',
        project_id: 'p1',
        project_name: 'Line A Surface Inspection',
        deflectometry_enabled: true,
        role: 'owner',
        image_count: 0,
        task_type: 'object_detection',
        classes: [],
      },
    ],
  },
  {
    project_id: 'p2',
    project_name: 'Line B Alignment Check',
    deflectometry_enabled: false,
    role: 'labeler',
    datasets: [
      {
        dataset_id: 'd4',
        dataset_name: 'Default alignment set',
        project_id: 'p2',
        project_name: 'Line B Alignment Check',
        deflectometry_enabled: false,
        role: 'labeler',
        image_count: 524,
        task_type: 'classification',
        classes: ALIGNMENT_CLASSES,
      },
    ],
  },
]

export const SAMPLE_RECENT: RecentDatasetEntry[] = [
  { dataset: SAMPLE_GROUPS[0].datasets[0], isLatest: true },
  { dataset: SAMPLE_GROUPS[0].datasets[1], isLatest: false },
  { dataset: SAMPLE_GROUPS[1].datasets[0], isLatest: false },
]
