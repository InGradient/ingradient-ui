export const dashboardStats = [
  { label: 'Total images', value: '1,247', hint: '+ 32 this week' },
  { label: 'Labeled', value: '892', hint: '71.5%' },
  { label: 'Pending', value: '321', hint: '25.8%' },
  { label: 'Errors', value: '34', hint: '2.7%' },
]

export const dataCollectionData = [
  { dataset: 'Wafer A', count: 412 },
  { dataset: 'Wafer B', count: 318 },
  { dataset: 'Surface', count: 247 },
  { dataset: 'Pixel seg', count: 165 },
  { dataset: 'Keypoint', count: 105 },
]

export const timelineData = [
  { period: 'W1', count: 120 },
  { period: 'W2', count: 160 },
  { period: 'W3', count: 200 },
  { period: 'W4', count: 180 },
  { period: 'W5', count: 240 },
  { period: 'W6', count: 280 },
  { period: 'W7', count: 320 },
  { period: 'W8', count: 295 },
]

export const labelingStatusData = [
  { name: 'Labeled', value: 892, color: '#35c6a7' },
  { name: 'Unlabeled', value: 321, color: '#ffd179' },
  { name: 'Errors', value: 34, color: '#ff9a9a' },
]

export const classRatioData = [
  { name: 'Crack', value: 412, color: '#ff6b6b' },
  { name: 'Scratch', value: 318, color: '#feca57' },
  { name: 'Dent', value: 247, color: '#48dbfb' },
  { name: 'Stain', value: 165, color: '#a55eea' },
  { name: 'Rust', value: 105, color: '#1dd1a1' },
]

export const labelingByPersonData = [
  { uploader: 'June Lee', count: 412, percentage: 33 },
  { uploader: 'Soyeon Park', count: 318, percentage: 26 },
  { uploader: 'Daniel Kim', count: 247, percentage: 20 },
  { uploader: 'Mira Choi', count: 165, percentage: 13 },
  { uploader: 'Others', count: 105, percentage: 8 },
]

export const defectsBySourceData = [
  { source: 'Camera A', count: 220 },
  { source: 'Camera B', count: 184 },
  { source: 'Camera C', count: 142 },
  { source: 'Camera D', count: 89 },
  { source: 'Lab capture', count: 41 },
]

export const labelingProgress = {
  pending: 321,
  processed: 892,
}

export const datasetDistribution = {
  rowLabels: ['Wafer A', 'Wafer B', 'Surface', 'Pixel seg', 'Keypoint'],
  columnLabels: ['Crack', 'Scratch', 'Dent', 'Stain', 'Rust'],
  matrix: [
    [120, 80, 45, 12, 0],
    [95, 110, 30, 8, 5],
    [60, 75, 88, 0, 20],
    [40, 50, 60, 25, 0],
    [10, 15, 5, 0, 30],
  ],
}

// keep legacy export for backward compat
export const mockStats = dashboardStats
