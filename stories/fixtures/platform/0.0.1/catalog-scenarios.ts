export type DatasetStatus = 'ready' | 'syncing' | 'failed'

export interface MockDataset {
  id: string
  name: string
  imageCount: number
  status: DatasetStatus
  lastUpdatedAt: string
  owner: string
}

const baseDatasets: MockDataset[] = [
  { id: 'd-001', name: 'Wafer batch 2026-05', imageCount: 1240, status: 'ready', lastUpdatedAt: '10 min ago', owner: 'joon' },
  { id: 'd-002', name: 'Wafer batch 2026-04', imageCount: 3018, status: 'ready', lastUpdatedAt: '3 days ago', owner: 'soyeon' },
  { id: 'd-003', name: 'Defect samples', imageCount: 412, status: 'syncing', lastUpdatedAt: '1 day ago', owner: 'daniel' },
  { id: 'd-004', name: 'Line B captures', imageCount: 720, status: 'ready', lastUpdatedAt: '5 hours ago', owner: 'joon' },
  { id: 'd-005', name: 'Validation set', imageCount: 180, status: 'failed', lastUpdatedAt: '2 days ago', owner: 'soyeon' },
]

const longName = 'A-extremely-long-dataset-name-that-should-trigger-overflow-truncation-in-table-and-grid-views'

export type CatalogScenario =
  | 'default'
  | 'empty'
  | 'loading'
  | 'error'
  | 'permission-denied'
  | 'long-text'
  | 'many-items'
  | 'huge-dataset'
  | 'syncing'
  | 'multi-selection'
  | 'export-ready'

export interface CatalogScene {
  datasets: MockDataset[]
  selectedIds: string[]
  loading: boolean
  error?: string
  permissionDenied?: boolean
  exportReady?: boolean
}

export const catalogScenarios: Record<CatalogScenario, CatalogScene> = {
  default: { datasets: baseDatasets, selectedIds: [], loading: false },
  empty: { datasets: [], selectedIds: [], loading: false },
  loading: { datasets: [], selectedIds: [], loading: true },
  error: { datasets: [], selectedIds: [], loading: false, error: 'Failed to load datasets. Try again.' },
  'permission-denied': { datasets: [], selectedIds: [], loading: false, permissionDenied: true },
  'long-text': {
    datasets: baseDatasets.map((d, i) => i === 0 ? { ...d, name: longName, owner: 'long-username-for-overflow' } : d),
    selectedIds: [], loading: false,
  },
  'many-items': {
    datasets: Array.from({ length: 24 }, (_, i) => ({
      ...baseDatasets[i % baseDatasets.length],
      id: `d-many-${i}`,
      name: `${baseDatasets[i % baseDatasets.length].name} #${i + 1}`,
    })),
    selectedIds: [], loading: false,
  },
  'huge-dataset': {
    datasets: [{ ...baseDatasets[0], imageCount: 248_000, name: 'Wafer batch — full year 2025' }, ...baseDatasets.slice(1)],
    selectedIds: [], loading: false,
  },
  syncing: { datasets: baseDatasets.map((d) => ({ ...d, status: 'syncing' as const })), selectedIds: [], loading: false },
  'multi-selection': { datasets: baseDatasets, selectedIds: ['d-001', 'd-002', 'd-004'], loading: false },
  'export-ready': { datasets: baseDatasets, selectedIds: ['d-001'], loading: false, exportReady: true },
}
