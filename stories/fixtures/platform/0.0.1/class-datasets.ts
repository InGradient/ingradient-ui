export interface MockClassDataset {
  id: string
  name: string
  image_count: number
}

const datasetTemplates: MockClassDataset[] = [
  { id: 'ds-1', name: 'Wafer line A', image_count: 84 },
  { id: 'ds-2', name: 'Surface defects', image_count: 56 },
  { id: 'ds-3', name: 'Pixel segmentation', image_count: 32 },
  { id: 'ds-4', name: 'Keypoint annotations', image_count: 18 },
  { id: 'ds-5', name: 'Mixed batch — staging', image_count: 12 },
]

/** classId → linked datasets. cl-1, cl-2 가 풍부, 나머지는 1-2 개. */
export const classIdToDatasets: Record<string, MockClassDataset[]> = {
  'cl-1': [datasetTemplates[0], datasetTemplates[1], datasetTemplates[2], datasetTemplates[3]],
  'cl-2': [datasetTemplates[0], datasetTemplates[1], datasetTemplates[2]],
  'cl-3': [datasetTemplates[0], datasetTemplates[1]],
  'cl-4': [datasetTemplates[1]],
  'cl-5': [datasetTemplates[2]],
  'cl-6': [datasetTemplates[0]],
  'cl-7': [],
  'cl-8': [datasetTemplates[3]],
  'cl-9': [datasetTemplates[4]],
  'cl-10': [],
}
