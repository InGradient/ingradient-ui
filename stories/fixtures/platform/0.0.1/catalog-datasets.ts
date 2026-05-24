import type { DatasetTaskType } from '@ingradient/ui/patterns'

export type MockDataset = {
  id: string
  name: string
  task_type: DatasetTaskType
  image_count: number
  created_at: string
  updated_at: string
}

export const mockDatasets: MockDataset[] = [
  { id: 'd1', name: 'Wafer line A — production batch 2024Q4', task_type: 'object_detection', image_count: 1247, created_at: '2024-09-20', updated_at: '2024-12-12' },
  { id: 'd2', name: 'Surface defects', task_type: 'classification', image_count: 432, created_at: '2024-10-02', updated_at: '2024-12-10' },
  { id: 'd3', name: 'Pixel segmentation', task_type: 'segmentation', image_count: 198, created_at: '2024-08-15', updated_at: '2024-11-30' },
  { id: 'd4', name: 'Keypoint annotations', task_type: 'point', image_count: 76, created_at: '2024-11-04', updated_at: '2024-12-01' },
  { id: 'd5', name: 'Mixed batch — staging', task_type: 'object_detection', image_count: 12, created_at: '2024-12-08', updated_at: '2024-12-12' },
]
